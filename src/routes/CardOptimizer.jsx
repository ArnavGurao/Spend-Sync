import { useMemo, useState } from "react"
import { useLoaderData } from "react-router-dom"

function inr(value) {
  return `\u20b9${Math.round(value).toLocaleString("en-IN")}`
}

function deriveCategory(query, merchantMap, categories) {
  const normalized = String(query || "")
    .trim()
    .toLowerCase()
  if (!normalized) {
    return "all"
  }

  if (merchantMap[normalized]) {
    return merchantMap[normalized]
  }

  return categories.find((category) => normalized.includes(category)) || "all"
}

function findBestCard(cards, category) {
  return [...cards].sort((a, b) => {
    return (b.categoryRates[category] || 0) - (a.categoryRates[category] || 0)
  })[0]
}

export function CardOptimizer() {
  const data = useLoaderData()
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const effectiveCategory = useMemo(() => {
    if (activeCategory !== "all") {
      return activeCategory
    }
    return deriveCategory(query, data.merchantCategoryMap, data.categories)
  }, [activeCategory, data.categories, data.merchantCategoryMap, query])

  const smartPicks = useMemo(() => {
    if (effectiveCategory !== "all") {
      return data.categoryPicks.filter(
        (pick) => pick.category === effectiveCategory,
      )
    }
    return data.categoryPicks
  }, [data.categoryPicks, effectiveCategory])

  const highlightedCard = useMemo(() => {
    if (effectiveCategory === "all") {
      return data.cards[0]
    }
    return findBestCard(data.cards, effectiveCategory)
  }, [data.cards, effectiveCategory])

  const rates = useMemo(() => {
    const entries = Object.entries(highlightedCard.categoryRates)
    return entries.sort((a, b) => b[1] - a[1])
  }, [highlightedCard])

  return (
    <article className="ss-optimizer-page ss-starry-bg ss-stagger-enter">
      <header className="ss-optimizer-head">
        <h2 className="ss-heading">Optimal Card Advisor</h2>
        <p className="ss-body">
          Compare card benefits and pick the most rewarding option by merchant
          or category.
        </p>
      </header>

      <section className="ss-card ss-optimizer-search">
        <div className="ss-orb ss-orb-a" />
        <div className="ss-orb ss-orb-b" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search merchant (Amazon, Netflix) or category..."
          className="ss-optimizer-input"
        />
        <div className="ss-optimizer-filters">
          {data.categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "ss-optimizer-filter active"
                  : "ss-optimizer-filter"
              }
              onClick={() => setActiveCategory(category)}
            >
              {category === "all" ? "All Recommendations" : category}
            </button>
          ))}
        </div>
      </section>

      <section className="ss-card ss-optimizer-picks">
        <div className="ss-optimizer-title-row">
          <h3 className="ss-heading">Smart Pick</h3>
          <span className="ss-label">Compare All</span>
        </div>
        <div className="ss-picks-grid">
          {smartPicks.map((pick) => (
            <article
              key={pick.category}
              className="ss-pick-card"
              style={{ borderLeftColor: pick.accentColor }}
            >
              <p className="ss-label">{pick.title}</p>
              <h4>{pick.cardName}</h4>
              <p className="ss-kpi-note">Est. monthly saving</p>
              <strong style={{ color: pick.accentColor }}>
                {inr(pick.monthlySaving)}
              </strong>
            </article>
          ))}
        </div>
      </section>

      <section
        className="ss-card ss-card-profile"
        style={{ borderLeftColor: highlightedCard.accentColor }}
      >
        <div className="ss-card-profile-top">
          <div>
            <p className="ss-label">{highlightedCard.bank}</p>
            <h3 className="ss-heading">{highlightedCard.name}</h3>
            <div className="ss-tag-row">
              {highlightedCard.tags.map((tag) => (
                <span key={tag} className="ss-card-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <span
            className="ss-tier-pill"
            style={{ color: highlightedCard.accentColor }}
          >
            {highlightedCard.tier}
          </span>
        </div>

        <div
          className="ss-top-benefit"
          style={{
            background: `${highlightedCard.accentColor}22`,
            borderColor: `${highlightedCard.accentColor}66`,
          }}
        >
          <p className="ss-label">Top Benefit</p>
          <h4>{highlightedCard.benefitText}</h4>
        </div>

        <div className="ss-card-panels">
          <div className="ss-panel">
            <p className="ss-label">Cashback & Rewards</p>
            <ul className="ss-rate-list">
              {rates.map(([category, rate]) => (
                <li key={category}>
                  <span>{category}</span>
                  <strong style={{ color: highlightedCard.accentColor }}>
                    {`${rate}% ${highlightedCard.valueType}`}
                  </strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="ss-panel">
            <p className="ss-label">Rewards Analytics</p>
            <div className="ss-reward-stats">
              <div>
                <span>Points Balance</span>
                <strong>
                  {highlightedCard.pointsBalance.toLocaleString("en-IN")}
                </strong>
              </div>
              <div>
                <span>Redeemable Value</span>
                <strong style={{ color: highlightedCard.accentColor }}>
                  {inr(highlightedCard.rewardValue)}
                </strong>
              </div>
            </div>
            <p className="ss-kpi-note">{highlightedCard.expiryNote}</p>
          </div>
        </div>
      </section>
    </article>
  )
}
