import { NavLink, Outlet } from "react-router-dom"

const navItems = [
  { to: "/", label: "Dashboard", icon: "⌂", end: true },
  { to: "/optimizer", label: "Cards", icon: "◈" },
  { to: "/analytics", label: "Analytics", icon: "◎" },
  { label: "Alerts", icon: "◌", disabled: true },
  { to: "/about", label: "About", icon: "◍" },
]

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
          {navItems.map((item) => {
            if (item.disabled) {
              return (
                <span key={item.label} className="ss-side-nav-item disabled">
                  <span className="ss-nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </span>
              )
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={sideNavClass}
                end={item.end}
              >
                <span className="ss-nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            )
          })}
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
