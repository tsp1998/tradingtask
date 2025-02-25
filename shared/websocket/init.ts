import { SubscriptionRequest } from "../../types/coinbase"

export type SubscribeCB = (data: any) => void
export type SubscribeFn = (cb: SubscribeCB, subscriptionRequest?: SubscriptionRequest) => boolean
export type UnsubscribeFn = (cb: SubscribeCB, subscriptionRequest?: SubscriptionRequest) => boolean

const init = (wsUrl: string, _WebSocket: typeof WebSocket = WebSocket): Promise<Error | {
  subscribe: SubscribeFn,
  unsubscribe: UnsubscribeFn
}> => {
  const ws = new _WebSocket(wsUrl);
  const subscriptions: SubscribeCB[] = []

  return new Promise((resolve) => {
    ws.onerror = () => {
      resolve({ message: "Something went wrong", name: "SWW" })
    }

    ws.onopen = () => {
      resolve({
        subscribe: (cb, subscriptionRequest) => {
          subscriptions.push(cb)

          if (subscriptionRequest) {
            ws.send(JSON.stringify(subscriptionRequest))
          }

          return true
        },
        unsubscribe: (cb, subscriptionRequest) => {
          const cbIndex = subscriptions.indexOf(cb)

          if (cbIndex === -1) { return false }

          subscriptions.splice(cbIndex, 1)

          if (subscriptionRequest) {
            ws.send(JSON.stringify(subscriptionRequest))
          }

          return true
        }
      })
    }

    ws.onmessage = (message) => {
      const { data: dataString } = message
      const data = JSON.parse(dataString.toString());

      for (let i = 0; i < subscriptions.length; i++) {
        const subscriptionCB = subscriptions[i];
        subscriptionCB(data)
      }
    }

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    }
  })
}

export default init