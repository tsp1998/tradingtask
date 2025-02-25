import { Token } from "../../types/coinbase"
import { TokensMap } from "../pages"

const PriceView = (props: { tokensMap: TokensMap }) => {
  const { tokensMap } = props

  return (
    <ul className="flex">
      {Object.keys(tokensMap).map(token => {
        const tokenData = tokensMap[token as Token]
        const { asks, bids } = tokenData

        bids.sort((a, b) => {
          const aPrice = a.price ? +a.price : 0
          const bPrice = b.price ? +b.price : 0
          return (bPrice - aPrice)
        })
        asks.sort((a, b) => {
          const aPrice = a.price ? +a.price : 0
          const bPrice = b.price ? +b.price : 0
          return (aPrice - bPrice)
        })

        return (
          <li className="gap-x-2 mx-2 p-2 bg-gray-200">
            <div>{token}-USD</div>
            <div className="flex gap-x-1">
              <div>
                <h3 className="font-bold">Bids</h3>
                <ul>
                  {bids.map(bid => (<li>{bid.price}</li>))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Asks</h3>
                <ul>
                  {asks.map(ask => (<li>{ask.price}</li>))}
                </ul>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default PriceView