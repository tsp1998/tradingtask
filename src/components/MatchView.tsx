import { Token } from "../../types/coinbase"
import { TokensMap } from "../pages"

const MatchView = (props: { tokensMap: TokensMap }) => {
  const { tokensMap } = props

  return (
    <table>
      <thead>
        <tr>
          <td className="px-4">Token</td>
          <td className="px-4">Timestamp</td>
          <td className="px-4">Price</td>
          <td className="px-4">Side</td>
        </tr>
      </thead>


      <tbody>
        {Object.keys(tokensMap).map(token => {
          const { bids } = tokensMap[token as Token]
          const tick = bids[bids.length - 1]
          const { time, product_id, price, side } = tick || {}

          return (
            <tr>
              <td className="px-4">{product_id}</td>
              <td className="px-4">{time}</td>
              <td className="px-4">{price}</td>
              <td className="px-4">{side}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MatchView