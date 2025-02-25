import "./tailwind.css"

import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

import Fallback from "./components/Fallback"
import Header from "./components/Header"
import routesMap from "./data/routesMap"

const IndexPage = lazy(() => import("./pages/index"))
const AboutPage = lazy(() => import("./pages/about"))

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <Suspense fallback={<Fallback />}>
      <BrowserRouter>
        <Header />
        
        <Routes>
          <Route path={routesMap.index} Component={IndexPage} />
          <Route path={routesMap.about} Component={AboutPage} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
)
