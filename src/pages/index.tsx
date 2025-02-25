import { useCallback, useEffect, useState } from "react"
import endpointsMap from "../../shared/data/endpointsMap"
import init, { SubscribeCB, UnsubscribeFn } from "../../shared/websocket/init"
import { TickerData, Token } from "../../types/coinbase"
import MatchView from "../components/MatchView"
import PriceView from "../components/PriceView"
import TokensList from "../components/TokensList"

const RENDER_INTERVAL = 20 // milli, can be adjusted as needed
const MAX_TICKS_LENGTH = 10

export type TokensMap = {
  [K in Token]: {
    subscribed?: boolean,
    lastSeen: number,
    bids: Partial<TickerData>[],
    asks: Partial<TickerData>[],
  }
}

const IndexPage = () => {
  const [error, setError] = useState<Error | undefined>()
  const [tokensMap, setTokensMap] = useState<TokensMap>({
    BTC: { lastSeen: Date.now(), bids: [], asks: [], },
    ETH: { lastSeen: Date.now(), bids: [], asks: [], },
    LTC: { lastSeen: Date.now(), bids: [], asks: [], },
    XRP: { lastSeen: Date.now(), bids: [], asks: [], },
  })

  const subscription = useCallback<SubscribeCB>((data) => {
    const { product_id = "", price, best_ask, best_bid, time, side, } = data as TickerData
    const [token] = product_id.split("-") as [Token]
    const tokenData = tokensMap[token]

    if (!tokenData) { return }

    const { lastSeen } = tokenData
    // console.log(`data`, data)

    const currentMilli = Date.now()
    if ((Date.now() - lastSeen) < RENDER_INTERVAL) { return }
    tokenData.lastSeen = currentMilli

    const ticks = tokenData[side === "buy" ? "bids" : "asks"]

    ticks.push({ price, best_ask, best_bid, time, product_id, side })

    if (ticks.length > MAX_TICKS_LENGTH) { ticks.shift() }

    setTokensMap(prevState => ({ ...prevState }))
  }, [tokensMap])

  const subscribeOrUnsubscribe = useCallback<React.MouseEventHandler<HTMLButtonElement>>(async (event) => {
    const { id } = event.target as HTMLButtonElement
    const [type, token] = id.split("-") as [string, Token]

    const isSubscribe = type === "subscribe"
    const endpoint = isSubscribe ? endpointsMap.subscribe : endpointsMap.unsubscribe

    const { VITE_SERVER_URL } = import.meta.env
    const response = await fetch(`${VITE_SERVER_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    const { msg } = await response.json()

    if (msg) { setError({ message: msg, name: type }) }

    const tokenData = tokensMap[token]

    if (isSubscribe) {
      tokenData.subscribed = true
    } else {
      tokenData.subscribed = false
      tokenData.asks = []
      tokenData.bids = []
    }

    setTokensMap(prevState => ({ ...prevState }))
  }, [tokensMap])

  useEffect(() => {
    const { VITE_WS_SERVER_URL } = import.meta.env

    let unsubscribe: UnsubscribeFn | undefined

    init(VITE_WS_SERVER_URL).then((resultOrError) => {
      if ("message" in resultOrError) { return setError(resultOrError) }

      const { subscribe, unsubscribe: _unsubscribe } = resultOrError
      unsubscribe = unsubscribe
      subscribe(subscription)
    })

    // cleanup
    return () => {
      unsubscribe?.(subscription)
    }
  }, [])

  return (
    <div className="">
      {error ? (
        <div>{error.message}</div>
      ) : (
        <div className="main flex">
          <div className="w-[45%]">
            <div className="bg-gray-100 m-2 p-2">
              <h1 className="font-medium">Tokens List</h1>
              <TokensList
                subscribeOrUnsubscribe={subscribeOrUnsubscribe}
                tokensMap={tokensMap}
              />
            </div>

            <div className="bg-gray-100 m-2 p-2">
              <h1 className="font-medium">Match View</h1>
              <MatchView tokensMap={tokensMap} />
            </div>
          </div>

          <div className="bg-gray-100 w-[55%] m-2 p-2">
            <h1 className="font-medium">Price View</h1>
            <PriceView tokensMap={tokensMap} />
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPage
