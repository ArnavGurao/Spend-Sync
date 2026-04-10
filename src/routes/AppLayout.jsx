import { NavLink, Outlet } from "react-router-dom"

function sideNavClass({ isActive }) {
  return isActive ? "ss-side-nav-item active" : "ss-side-nav-item"
}

export function AppLayout() {
  return (
    <main className="ss-app-shell ss-shell-grid">
      <header className="ss-topbar">
        <div className="ss-topbar-brand" aria-label="SpendSync brand">
          <span className="ss-topbar-logo" aria-hidden="true">
            ◍
          </span>
          <h1 className="ss-wordmark">SpendSync</h1>
        </div>

        <button
          type="button"
          className="ss-bell-btn"
          aria-label="Notifications"
        >
          <span className="ss-bell-icon" aria-hidden="true">
            🔔
          </span>
          <span className="ss-badge">3</span>
        </button>
      </header>

      <aside className="ss-sidebar">
        <nav className="ss-side-nav">
          <NavLink to="/" className={sideNavClass} end>
            Dashboard
          </NavLink>
          <NavLink to="/optimizer" className={sideNavClass}>
            Cards
          </NavLink>
          <NavLink to="/analytics" className={sideNavClass}>
            Analytics
          </NavLink>
          <span className="ss-side-nav-item disabled">Alerts</span>
          <NavLink to="/about" className={sideNavClass}>
            About
          </NavLink>
        </nav>
      </aside>

      <section className="ss-main-panel">
        <section className="ss-content">
          <Outlet />
        </section>
      </section>
    </main>
  )
}
