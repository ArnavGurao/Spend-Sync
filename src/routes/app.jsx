import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AppLayout } from "./AppLayout.jsx"
import { Home } from "./Home.jsx"
import { About } from "./About.jsx"
import { homeLoader, aboutLoader } from "./loaders.jsx"

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
        path: "about",
        loader: aboutLoader,
        element: <About />,
      },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} fallbackElement={<p>Loading route...</p>} />
  </StrictMode>,
)
