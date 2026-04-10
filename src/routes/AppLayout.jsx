import { NavLink, Outlet } from "react-router-dom"

function navClass({ isActive }) {
  return isActive ? "font-semibold underline" : "hover:underline"
}

export function AppLayout() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Nitro + React Router</h1>
        <p className="mt-2 text-gray-700">
          Basic routed app with loader boilerplate.
        </p>
      </header>

      <nav className="mb-6 flex gap-4 border-b pb-4">
        <NavLink to="/" className={navClass} end>
          Home
        </NavLink>
        <NavLink to="/about" className={navClass}>
          About
        </NavLink>
      </nav>

      <section>
        <Outlet />
      </section>
    </main>
  )
}
