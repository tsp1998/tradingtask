import cors from "cors"
import { config } from "dotenv"
import express from "express"
import { createServer } from "http"
import { WebSocket, WebSocketServer } from "ws"

import { SubscribeFn, UnsubscribeFn } from "../shared/websocket/init"

import endpointsMap from "../shared/data/endpointsMap"
import init from "../shared/websocket/init"
import { SubscriptionRequest, TickerData, Token } from "../types/coinbase"
import { UsersMap } from "../types/user"
import initUser from "./core/initUser"

config()
const { PORT, CLIENT_URLS, COINBASE_WS_URL } = process.env


// for this task, I am using in memory storage but we can use db or file storage for real use
const usersMap: UsersMap = {}
const tokenSubscribedCountMap: { [K in Token]?: number } = {}

// console.log(`WebSocket`, WebSocket)
let subscribe: SubscribeFn, unsubscribe: UnsubscribeFn

init(COINBASE_WS_URL as string, WebSocket as any).then((resultOrError) => {
  if ("message" in resultOrError) { return }

  const { subscribe: _subscribe, unsubscribe: _unsubscribe } = resultOrError

  subscribe = _subscribe
  unsubscribe = _unsubscribe

  console.log("connected to coinbase")
})

const app = express()

if (CLIENT_URLS) {
  const allowedOrigins = CLIENT_URLS.split(",")
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
  }))
}

app.use(express.json())

app.use((req, res, next) => { initUser(req, usersMap); next(); })

app.get("/", (req, res) => {
  console.log(`req`, req.url)
  res.send("hello")
})

const handleSubscribeOrUnsubscribe: express.RequestHandler = (req, res) => {
  const { hash = "", body, url } = req

  const userConfig = usersMap[hash]

  if (!userConfig) { res.send({ msg: "No User Config Found" }); return }

  const { token } = body as { token: Token }
  const { subscribedTokensMap, socket } = userConfig

  const tokenData = subscribedTokensMap[token] ||= {}
  const isSubscribe = url.indexOf(endpointsMap.unsubscribe) === -1

  const pair = `${token}-USD`

  const subscriptionRequest: SubscriptionRequest = {
    type: isSubscribe ? "subscribe" : "unsubscribe",
    product_ids: [pair],
    channels: [
      "ticker",
      // "level2",
      // "matches"
    ]
  }

  if (isSubscribe) {
    let { subscribeCB } = tokenData

    if (!subscribeCB) {
      subscribeCB = tokenData.subscribeCB = (data) => {
        // console.log(`data`, data)
        const { product_id: pair = "" } = data as TickerData
        const [_token] = pair.split("-")
        // console.log(`_token`, _token, data)
        if (_token in subscribedTokensMap) {
          socket?.send(JSON.stringify(data))
        }
      }

      subscribe(subscribeCB, subscriptionRequest)

      tokenSubscribedCountMap[token] ||= 0
      tokenSubscribedCountMap[token]++
    }
  } else {
    const { subscribeCB } = tokenData

    if (subscribeCB) {
      const count = tokenSubscribedCountMap[token] ||= 0
      tokenData.subscribeCB = undefined
      tokenSubscribedCountMap[token]--
      
      if (count === 1) {
        unsubscribe(subscribeCB, subscriptionRequest)
      }
    }
  }

  // console.log(`usersMap`, usersMap)
  res.send({})
}

// all these routes can be arranged in mvc pattern but for this task's smaller scope I am writing here only
app.post(endpointsMap.subscribe, handleSubscribeOrUnsubscribe)
app.post(endpointsMap.unsubscribe, handleSubscribeOrUnsubscribe)

// error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.send({
    msg: error.message // this should be transformed before sending to client in real world use
  })
})

const server = createServer(app)
const wss = new WebSocketServer({ server })

wss.on("connection", (socket, req) => {
  initUser(req as any, usersMap)
  const { hash = "" } = req
  const userConfig = usersMap[hash]
  userConfig.socket = socket
  const handleErrorOrDisconnect = () => {
    userConfig.socket = undefined
  }
  socket.on("close", handleErrorOrDisconnect)
  socket.on("error", handleErrorOrDisconnect)
})

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})