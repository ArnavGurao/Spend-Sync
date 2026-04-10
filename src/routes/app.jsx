import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./design-system.css"
import { AppLayout } from "./AppLayout.jsx"
import { Home } from "./Home.jsx"
import { About } from "./About.jsx"
import { Analytics } from "./Analytics.jsx"
import { CardOptimizer } from "./CardOptimizer.jsx"
import {
  homeLoader,
  aboutLoader,
  analyticsLoader,
  cardOptimizerLoader,
} from "./loaders.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        loader: homeLoader,
        element: <Home />,
      },
      {
        path: "analytics",
        loader: analyticsLoader,
        element: <Analytics />,
      },
      {
        path: "about",
        loader: aboutLoader,
        element: <About />,
      },
      {
        path: "optimizer",
        loader: cardOptimizerLoader,
        element: <CardOptimizer />,
      },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider
      router={router}
      fallbackElement={<p className="ss-content">Loading route...</p>}
    />
  </StrictMode>,
)
