import { Link } from "react-router-dom"
import routesMap from "../data/routesMap"

const Header = () => {
  return (
    <header className="flex justify-between bg-gray-300 px-4 py-2">
      <div>
        Trade+
      </div>

      <div className="flex gap-x-3">
        <Link to={routesMap.index}>Home</Link>
        <Link to={routesMap.about}>About</Link>
      </div>
    </header>
  )
}

export default Header