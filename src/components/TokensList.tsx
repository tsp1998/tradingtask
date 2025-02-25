import { Token } from "../../types/coinbase"
import { TokensMap } from "../pages"

const TokensList = (props: {
  tokensMap: TokensMap,
  subscribeOrUnsubscribe: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const { tokensMap, subscribeOrUnsubscribe } = props

  return (
    <ul className="">
      {Object.keys(tokensMap).map(token => {
        const tokenData = tokensMap[token as Token]

        return (
          <li className="flex gap-x-2 my-2">
            <div>{token}-USD</div>

            {tokenData.subscribed ? (
              <button className="bg-gray-300 rounded-lg px-4 py-1" id={`unsubscribe-${token}`} onClick={subscribeOrUnsubscribe}>Unsubscribe</button>
            ) : (
              <button className="bg-gray-300 rounded-lg px-4 py-1" id={`subscribe-${token}`} onClick={subscribeOrUnsubscribe}>Subscribe</button>
            )}
          </li>
        )
      })}

    </ul>
  )
}

export default TokensList