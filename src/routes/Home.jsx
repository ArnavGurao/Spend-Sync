import { useMemo, useState } from "react"

const walletCards = [
  {
    id: "axis",
    bank: "Axis Bank Magnus",
    last4: "6603",
    monthlySpend: 3898,
    gradient: "axis",
  },
  {
    id: "sbi",
    bank: "SBI Aurum",
    last4: "2210",
    monthlySpend: 2140,
    gradient: "sbi",
  },
  {
    id: "icici",
    bank: "ICICI Emeralde",
    last4: "8834",
    monthlySpend: 1890,
    gradient: "icici",
  },
  {
    id: "hdfc",
    bank: "HDFC Regalia",
    last4: "4521",
    monthlySpend: 1678,
    gradient: "hdfc",
  },
]

function inr(value) {
  return `\u20b9${Math.round(value).toLocaleString("en-IN")}`
}

function rotateToFront(cards, index) {
  if (index <= 0) {
    return cards
  }
  return [...cards.slice(index), ...cards.slice(0, index)]
}

function WalletStack() {
  const [activeIndex, setActiveIndex] = useState(0)

  const orderedCards = useMemo(() => {
    return rotateToFront(walletCards, activeIndex)
  }, [activeIndex])

  function changeByDelta(delta) {
    setActiveIndex((current) => {
      const total = walletCards.length
      return (current + delta + total) % total
    })
  }

  function onWheel(event) {
    if (Math.abs(event.deltaY) < 4) {
      return
    }
    event.preventDefault()
    changeByDelta(event.deltaY > 0 ? 1 : -1)
  }

  function onKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      changeByDelta(1)
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      changeByDelta(-1)
    }
  }

  return (
    <section
      className="ss-wallet-stack"
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label="Wallet card stack"
    >
      <div className="ss-wallet-active-wrap">
        <article
          className={`ss-wallet-active-card ss-wallet-gradient-${orderedCards[0].gradient}`}
          key={orderedCards[0].id}
        >
          <header className="ss-wallet-card-head">
            <span>{orderedCards[0].bank}</span>
            <span className="ss-wallet-badge">
              {`${inr(orderedCards[0].monthlySpend)}/MO`}
            </span>
          </header>
          <p className="ss-wallet-number">{`XXXX XXXX XXXX ${orderedCards[0].last4}`}</p>
        </article>

        <div className="ss-wallet-peek-stack">
          {orderedCards.slice(1).map((card, index) => (
            <button
              key={card.id}
              type="button"
              className={`ss-wallet-peek ss-wallet-gradient-${card.gradient}`}
              style={{ transform: `translateY(${index * 0.95}rem)` }}
              onClick={() => {
                const originalIndex = walletCards.findIndex(
                  (item) => item.id === card.id,
                )
                setActiveIndex(originalIndex)
              }}
            >
              <span>{`XXXX XXXX XXXX ${card.last4}`}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Home() {
  const totalMonthly = walletCards.reduce(
    (sum, card) => sum + card.monthlySpend,
    0,
  )

  return (
    <article className="ss-dashboard-screen">
      <section className="ss-dashboard-greeting ss-enter-row">
        <h2>Good morning, Rahul</h2>
        <p>You have 4 active cards and 12 subscriptions</p>
      </section>

      <section className="ss-dashboard-spend-card ss-enter-row">
        <p className="ss-utility-label">Total Monthly Spend</p>
        <h3>{inr(totalMonthly)}</h3>
        <span className="ss-yearly-pill">{`Total Yearly ${inr(totalMonthly * 12)}`}</span>
      </section>

      <section className="ss-wallet-title-row ss-enter-row">
        <h3>Your Wallet</h3>
        <button type="button" className="ss-utility-link">
          Manage All
        </button>
      </section>

      <section className="ss-enter-row">
        <WalletStack />
      </section>

      <section className="ss-optimization-card ss-enter-row">
        <div className="ss-optimization-icon" aria-hidden="true">
          ✦
        </div>
        <div className="ss-optimization-copy">
          <p className="ss-optimization-title">Optimization Ready</p>
          <p className="ss-optimization-subtitle">
            3 subscriptions have price drops available.
          </p>
        </div>
        <button type="button" className="ss-review-pill">
          Review
        </button>
      </section>

      <section
        className="ss-dashboard-pills ss-enter-row"
        aria-label="Quick actions"
      >
        <button type="button" className="ss-mini-pill">
          <span aria-hidden="true">✦</span>
          <span>Card Advisor</span>
        </button>
        <button type="button" className="ss-mini-pill">
          <span aria-hidden="true">◍</span>
          <span>Your DNA</span>
        </button>
      </section>

      <button type="button" className="ss-main-cta ss-enter-row">
        <span aria-hidden="true" className="ss-main-cta-icon">
          ▣
        </span>
        <span>Simulate Incoming SMS</span>
      </button>
    </article>
  )
}
