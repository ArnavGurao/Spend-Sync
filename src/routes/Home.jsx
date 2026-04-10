import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const initialWalletCards = [
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

function WalletStack({ cards }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (activeIndex < cards.length) {
      return
    }
    setActiveIndex(0)
  }, [activeIndex, cards.length])

  const orderedCards = useMemo(
    () => rotateToFront(cards, activeIndex),
    [activeIndex, cards],
  )

  if (cards.length === 0) {
    return null
  }

  function changeByDelta(delta) {
    setDirection(delta > 0 ? 1 : -1)
    setActiveIndex((current) => {
      const total = cards.length
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
    if (event.key === "ArrowRight") {
      event.preventDefault()
      changeByDelta(1)
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      changeByDelta(-1)
    }
  }

  const activeCard = orderedCards[0]
  const layeredCards = orderedCards.slice(1, 4)

  return (
    <section
      className="ss-wallet-stack"
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label="Wallet card stack"
    >
      <div className="ss-wallet-active-wrap">
        <div className="ss-wallet-glimpse-row">
          {layeredCards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              className={`ss-wallet-glimpse ss-wallet-gradient-${card.gradient}`}
              style={{
                transform: `translateX(${(index + 1) * 0.9}rem) scale(${1 - (index + 1) * 0.06})`,
                zIndex: 4 - index,
              }}
              onClick={() => {
                const originalIndex = cards.findIndex(
                  (item) => item.id === card.id,
                )
                setDirection(1)
                setActiveIndex(originalIndex)
              }}
            >
              <span>{card.bank}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.article
            key={activeCard.id}
            custom={direction}
            className={`ss-wallet-active-card ss-wallet-gradient-${activeCard.gradient}`}
            initial={{ opacity: 0.6, x: direction > 0 ? 48 : -48, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction > 0 ? -48 : 48, scale: 0.94 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x <= -55) {
                changeByDelta(1)
                return
              }
              if (info.offset.x >= 55) {
                changeByDelta(-1)
              }
            }}
          >
            <header className="ss-wallet-card-head">
              <span>{activeCard.bank}</span>
              <span className="ss-wallet-badge">{`${inr(activeCard.monthlySpend)}/MO`}</span>
            </header>
            <p className="ss-wallet-chip">SpendSync Wallet</p>
            <p className="ss-wallet-number">{`XXXX XXXX XXXX ${activeCard.last4}`}</p>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="ss-wallet-controls" aria-label="Wallet controls">
        <button
          type="button"
          className="ss-wallet-nav"
          onClick={() => changeByDelta(-1)}
          aria-label="Previous card"
        >
          ←
        </button>
        <div
          className="ss-wallet-dots"
          role="tablist"
          aria-label="Card selector"
        >
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              className={`ss-wallet-dot ${activeIndex === index ? "active" : ""}`}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1)
                setActiveIndex(index)
              }}
              aria-label={`View ${card.bank}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="ss-wallet-nav"
          onClick={() => changeByDelta(1)}
          aria-label="Next card"
        >
          →
        </button>
      </div>
    </section>
  )
}

export function Home() {
  const cards = initialWalletCards

  const totalMonthly = cards.reduce((sum, card) => sum + card.monthlySpend, 0)

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

      <section className="ss-enter-row ss-wallet-zone">
        <WalletStack cards={cards} />
      </section>

      <section className="ss-optimization-card ss-enter-row ss-optimization-spacing">
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
