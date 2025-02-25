import { WebSocket } from "ws"
import { SubscribeCB } from "../shared/websocket/init"
import { Token } from "./coinbase"

export type UserConfig = {
  subscribedTokensMap: { [K in Token]?: { subscribeCB?: SubscribeCB } },
  socket?: WebSocket,
}

export type UsersMap = { [userHash: string]: UserConfig } 