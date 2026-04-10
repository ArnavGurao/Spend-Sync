import { useMemo, useState } from "react"
import { useLoaderData } from "react-router-dom"

function formatInr(value) {
  return `\u20b9${Math.round(value).toLocaleString("en-IN")}`
}

function Sparkline({ points, valueKey }) {
  const width = 320
  const height = 92
  const max = Math.max(...points.map((point) => point[valueKey]), 1)
  const step = points.length > 1 ? width / (points.length - 1) : width

  const path = points
    .map((point, index) => {
      const x = index * step
      const y = height - (point[valueKey] / max) * (height - 12) - 6
      return `${index === 0 ? "M" : "L"}${x},${y}`
    })
    .join(" ")

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="ss-sparkline" role="img">
      <path d={path} className="ss-sparkline-line" />
    </svg>
  )
}

function DonutChart({ categories, centerLabel, centerValue }) {
  const size = 220
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let cumulative = 0
  const segments = categories.map((category) => {
    const share = Math.max(category.share, 0)
    const segmentLength = (share / 100) * circumference
    const dashOffset = circumference - cumulative
    cumulative += segmentLength

    return {
      ...category,
      segmentLength,
      dashOffset,
    }
  })

  return (
    <div className="ss-donut-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="ss-donut" role="img">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="ss-donut-track"
          strokeWidth={strokeWidth}
        />
        {segments.map((segment) => (
          <circle
            key={segment.category}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="ss-donut-segment"
            stroke={segment.color}
            strokeDasharray={`${segment.segmentLength} ${circumference}`}
            strokeDashoffset={segment.dashOffset}
          />
        ))}
      </svg>
      <div className="ss-donut-center">
        <span>{centerLabel}</span>
        <strong>{centerValue}</strong>
      </div>
    </div>
  )
}

function SectionTitle({ title, body }) {
  return (
    <header className="ss-section-head">
      <h3 className="ss-heading">{title}</h3>
      <p className="ss-body">{body}</p>
    </header>
  )
}

function SegmentControl({ value, onChange, options }) {
  return (
    <div
      className="ss-segment-control"
      role="tablist"
      aria-label="Analytics sections"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            value === option.value ? "ss-segment-btn active" : "ss-segment-btn"
          }
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function KpiGrid({ kpis }) {
  return (
    <section className="ss-kpi-grid">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="ss-kpi-card">
          <p className="ss-kpi-label">{kpi.label}</p>
          <p className="ss-kpi-value">{kpi.value}</p>
          {kpi.note ? <p className="ss-kpi-note">{kpi.note}</p> : null}
        </div>
      ))}
    </section>
  )
}

function SpendingTrends({ trends, upcomingForecast }) {
  const [range, setRange] = useState("month")

  const monthlySpendPoints =
    range === "week"
      ? trends.monthlySpend.slice(-3)
      : range === "year"
        ? trends.monthlySpend
        : trends.monthlySpend.slice(-4)

  const subscriptionPoints =
    range === "week"
      ? trends.subscriptionCount.slice(-3)
      : range === "year"
        ? trends.subscriptionCount
        : trends.subscriptionCount.slice(-4)

  return (
    <section className="ss-card ss-section">
      <SectionTitle
        title="Spending Trends"
        body="Two clean trend views to avoid chart clutter on smaller screens."
      />

      <div
        className="ss-range-toggle"
        role="tablist"
        aria-label="Spending overview range"
      >
        {[
          { value: "week", label: "Past Week" },
          { value: "month", label: "Past Month" },
          { value: "year", label: "Past Year" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              range === option.value ? "ss-range-btn active" : "ss-range-btn"
            }
            onClick={() => setRange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="ss-trend-block">
        <p className="ss-label">Monthly Spend</p>
        <Sparkline points={monthlySpendPoints} valueKey="amount" />
        <div className="ss-axis-row">
          {monthlySpendPoints.map((month) => (
            <span key={month.key}>{month.label}</span>
          ))}
        </div>
        <p className="ss-body">
          Spend changed by {Math.round(trends.spendGrowth)}% in the last 6
          months.
        </p>
      </div>

      <div className="ss-trend-block">
        <p className="ss-label">Subscription Count</p>
        <Sparkline points={subscriptionPoints} valueKey="count" />
        <div className="ss-axis-row">
          {subscriptionPoints.map((month) => (
            <span key={month.key}>{month.label}</span>
          ))}
        </div>
        <p className="ss-body">
          Subscription count changed by {Math.round(trends.subscriptionGrowth)}%
          in the last 6 months.
        </p>
      </div>

      <section className="ss-upcoming-box">
        <p className="ss-label">Upcoming Subscriptions</p>
        <ul className="ss-upcoming-list">
          {upcomingForecast.upcomingCharges.map((charge) => (
            <li
              key={`${charge.merchant}-${charge.cardLast4}-${charge.dateLabel}`}
              className="ss-upcoming-item"
            >
              <div>
                <strong>{charge.merchant}</strong>
                <p>{`${charge.dateLabel} · Card ••${charge.cardLast4}`}</p>
              </div>
              <span>{charge.amountFormatted}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}

function CategoryAnalytics({
  categoryBreakdown,
  categoryInsights,
  totalSpend,
}) {
  const categories = categoryBreakdown.slice(0, 12)

  return (
    <section className="ss-card ss-section">
      <SectionTitle
        title="Category Analytics"
        body="Donut chart + full 12-category coverage for fast scanning."
      />

      <div className="ss-category-layout">
        <DonutChart
          categories={categories}
          centerLabel="Spent"
          centerValue={formatInr(totalSpend)}
        />
        <div className="ss-legend-grid">
          {categories.map((category) => (
            <div key={category.category} className="ss-legend-item">
              <span
                className="ss-legend-dot"
                style={{ backgroundColor: category.color }}
              />
              <span>{`${category.category} ${category.shareRounded}%`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ss-table-wrap">
        <table className="ss-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Spend</th>
              <th>Share</th>
              <th>Subs</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((row) => (
              <tr key={row.category}>
                <td>
                  <span className="ss-rank">#{row.rank}</span> {row.category}
                </td>
                <td>{row.spendFormatted}</td>
                <td>{`${row.shareRounded}%`}</td>
                <td>{row.subscriptionCount}</td>
                <td>{`${Math.round(row.growthRate)}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="ss-list">
        {categoryInsights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
    </section>
  )
}

function SubscriptionEfficiency({ subscriptionInsights }) {
  const [showDetails, setShowDetails] = useState(false)
  const bars = [
    { label: "Week 1", value: subscriptionInsights.weeklyDistribution.week1 },
    { label: "Week 2", value: subscriptionInsights.weeklyDistribution.week2 },
    { label: "Week 3", value: subscriptionInsights.weeklyDistribution.week3 },
    { label: "Week 4", value: subscriptionInsights.weeklyDistribution.week4 },
    { label: "Week 5", value: subscriptionInsights.weeklyDistribution.week5 },
  ]
  const maxBar = Math.max(...bars.map((bar) => bar.value), 1)
  const activeIndex = bars.findIndex((bar) => bar.value === maxBar)

  return (
    <section className="ss-card ss-section">
      <SectionTitle
        title="Subscription Efficiency"
        body="Bar chart view for weekly load + service efficiency score."
      />

      <div className="ss-efficiency-top">
        <div
          className={
            showDetails ? "ss-efficiency-chart compact" : "ss-efficiency-chart"
          }
        >
          <div className="ss-weekly-bars">
            {bars.map((bar, index) => {
              const numericValue = Math.round(Number(bar.value) || 0)
              const height =
                numericValue <= 0
                  ? "0%"
                  : `${Math.max(26, (numericValue / maxBar) * 100)}%`
              const highlighted = numericValue === maxBar && numericValue > 0

              return (
                <div key={bar.label} className="ss-weekly-col">
                  <span
                    className={
                      highlighted ? "ss-weekly-value active" : "ss-weekly-value"
                    }
                  >
                    {formatInr(numericValue)}
                  </span>
                  <div className="ss-weekly-track">
                    {numericValue > 0 ? (
                      <div
                        className={
                          highlighted
                            ? "ss-weekly-fill active"
                            : "ss-weekly-fill"
                        }
                        style={{ height }}
                      />
                    ) : null}
                  </div>
                  <span
                    className={
                      index === activeIndex
                        ? "ss-weekly-label active"
                        : "ss-weekly-label"
                    }
                  >
                    {bar.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <aside className="ss-efficiency-action">
          <p className="ss-label">Details</p>
          <p className="ss-body">
            {showDetails
              ? "Detailed table is visible below."
              : "Open the detailed table for scores, status, and monthly amount."}
          </p>
          <button
            type="button"
            className="ss-efficiency-btn"
            onClick={() => setShowDetails((current) => !current)}
          >
            {showDetails
              ? "Hide Subscription Efficiency Details"
              : "Get Subscription Efficiency Details"}
          </button>
        </aside>
      </div>

      {showDetails ? (
        <div className="ss-table-wrap ss-eff-table-wrap">
          <table className="ss-table ss-eff-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Efficiency</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionInsights.efficiencyBars.map((entry) => {
                const band =
                  entry.score >= 75
                    ? "high"
                    : entry.score >= 55
                      ? "medium"
                      : "low"

                return (
                  <tr key={entry.subscriptionKey}>
                    <td>
                      <div className="ss-service-cell">
                        <strong>{entry.merchant}</strong>
                        <span className="ss-kpi-note">
                          Recurring behavior signal
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`ss-score-pill ${band}`}>
                        {entry.score}
                      </span>
                    </td>
                    <td>
                      <span className={`ss-status-text ${band}`}>
                        {band === "high"
                          ? "Healthy"
                          : band === "medium"
                            ? "Watch"
                            : "Low"}
                      </span>
                    </td>
                    <td>{entry.amountFormatted}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

function CardOptimization({ cardBreakdown, cardOptimization }) {
  const barColors = [
    "linear-gradient(90deg, #ff7a00, #ffad54)",
    "linear-gradient(90deg, #3f6cff, #7f9bff)",
    "linear-gradient(90deg, #14b8a6, #4de2d1)",
    "linear-gradient(90deg, #f43f5e, #fb8ba0)",
  ]

  return (
    <section className="ss-card ss-section">
      <SectionTitle
        title="Card Optimization"
        body="Spend concentration by card plus merchant-level switch opportunities."
      />

      <div className="ss-bars">
        {cardBreakdown.map((row, index) => (
          <div key={row.cardLast4} className="ss-bar-row">
            <div className="ss-bar-meta">
              <span>{`Card ••${row.cardLast4}`}</span>
              <span>{formatInr(row.spend)}</span>
            </div>
            <div className="ss-track colorful">
              <div
                className="ss-fill colorful"
                style={{
                  width: `${Math.round(row.share)}%`,
                  background: barColors[index % barColors.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="ss-kpi-note">{cardOptimization.concentrationRisk}</p>

      <div className="ss-table-wrap">
        <table className="ss-table">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Used</th>
              <th>Optimal</th>
              <th>Est. Loss</th>
            </tr>
          </thead>
          <tbody>
            {cardOptimization.opportunities.length === 0 ? (
              <tr>
                <td colSpan={4}>No switching opportunities detected.</td>
              </tr>
            ) : (
              cardOptimization.opportunities.map((item) => (
                <tr
                  key={`${item.merchant}-${item.usedCardLast4}-${item.suggestedCardLast4}`}
                >
                  <td>{item.merchant}</td>
                  <td>{`••${item.usedCardLast4}`}</td>
                  <td>{`••${item.suggestedCardLast4}`}</td>
                  <td>{item.estimatedLossFormatted}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="ss-body">
        Potential yearly savings: {cardOptimization.potentialSavingsYearly}
      </p>
    </section>
  )
}

function PortfolioAnalysis({ portfolioDistribution, upcomingForecast }) {
  return (
    <section className="ss-card ss-section">
      <SectionTitle
        title="Portfolio + Forecast"
        body="Distribution by subscription value tier and upcoming renewals."
      />

      <div className="ss-table-wrap">
        <table className="ss-table">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Count</th>
              <th>Spend</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {portfolioDistribution.tiers.map((tier) => (
              <tr key={tier.label}>
                <td>{tier.label}</td>
                <td>{tier.count}</td>
                <td>{formatInr(tier.spend)}</td>
                <td>{`${Math.round(tier.share)}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="ss-body">{portfolioDistribution.insight}</p>

      <div className="ss-forecast-grid">
        <div className="ss-mini-kpi">
          <span>Next 7 Days</span>
          <strong>{upcomingForecast.next7Days}</strong>
        </div>
        <div className="ss-mini-kpi">
          <span>Next 30 Days</span>
          <strong>{upcomingForecast.next30Days}</strong>
        </div>
        <div className="ss-mini-kpi">
          <span>Next 90 Days</span>
          <strong>{upcomingForecast.next90Days}</strong>
        </div>
      </div>

      <ul className="ss-list">
        {upcomingForecast.upcomingCharges.map((charge) => (
          <li
            key={`${charge.merchant}-${charge.cardLast4}-${charge.dateLabel}`}
            className={
              charge.amount >= 2000 ? "ss-upcoming-highlight" : undefined
            }
          >
            {`${charge.dateLabel} · ${charge.merchant} · ${charge.amountFormatted} · Card ••${charge.cardLast4}`}
          </li>
        ))}
      </ul>
    </section>
  )
}

function InflationTracker({ subscriptionInsights }) {
  return (
    <section className="ss-card ss-section">
      <SectionTitle
        title="Subscription Inflation"
        body="Largest price deltas from historical subscription charges."
      />

      <div className="ss-table-wrap">
        <table className="ss-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Old</th>
              <th>New</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {subscriptionInsights.inflationTracker.length === 0 ? (
              <tr>
                <td colSpan={4}>No significant price inflation detected.</td>
              </tr>
            ) : (
              subscriptionInsights.inflationTracker.map((item) => (
                <tr key={item.subscriptionKey}>
                  <td>{item.merchant}</td>
                  <td>{item.firstAmountFormatted}</td>
                  <td>{item.latestAmountFormatted}</td>
                  <td>{`${item.inflationRateRounded}%`}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AiInsights({ insights }) {
  return (
    <section className="ss-card ss-section ss-ai-panel">
      <SectionTitle
        title="AI Insights"
        body="Actionable recommendations generated from current analytics signals."
      />
      <ul className="ss-list">
        {insights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
    </section>
  )
}

export function Analytics() {
  const data = useLoaderData()
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = useMemo(() => {
    return [
      { value: "overview", label: "Overview" },
      { value: "category", label: "Category" },
      { value: "efficiency", label: "Efficiency" },
      { value: "cards", label: "Cards" },
      { value: "forecast", label: "Forecast" },
      { value: "inflation", label: "Inflation" },
      { value: "insights", label: "AI" },
    ]
  }, [])

  return (
    <article className="ss-analytics ss-starry-bg">
      <SectionTitle
        title="Analytics"
        body="Simple, mobile-friendly analytics with deep insights and low chart clutter."
      />

      <section className="ss-card ss-section">
        <SectionTitle
          title="Monthly Snapshot"
          body="A familiar donut + bar visual language from earlier prototypes."
        />
        <div className="ss-month-pill">{data.summary.currentMonthLabel}</div>
        <DonutChart
          categories={data.categoryBreakdown.slice(0, 12)}
          centerLabel="Spent"
          centerValue={data.summary.monthlySpendFormatted}
        />
      </section>

      <KpiGrid kpis={data.kpis} />

      <SegmentControl
        value={activeTab}
        onChange={setActiveTab}
        options={tabs}
      />

      {activeTab === "overview" ? (
        <SpendingTrends
          trends={data.trends}
          upcomingForecast={data.upcomingForecast}
        />
      ) : null}
      {activeTab === "category" ? (
        <CategoryAnalytics
          categoryBreakdown={data.categoryBreakdown}
          categoryInsights={data.categoryInsights}
          totalSpend={data.summary.monthlySpend}
        />
      ) : null}
      {activeTab === "efficiency" ? (
        <SubscriptionEfficiency
          subscriptionInsights={data.subscriptionInsights}
        />
      ) : null}
      {activeTab === "cards" ? (
        <CardOptimization
          cardBreakdown={data.cardBreakdown}
          cardOptimization={data.cardOptimization}
        />
      ) : null}
      {activeTab === "forecast" ? (
        <PortfolioAnalysis
          portfolioDistribution={data.portfolioDistribution}
          upcomingForecast={data.upcomingForecast}
        />
      ) : null}
      {activeTab === "inflation" ? (
        <InflationTracker subscriptionInsights={data.subscriptionInsights} />
      ) : null}
      {activeTab === "insights" ? (
        <AiInsights insights={data.aiInsights} />
      ) : null}
    </article>
  )
}
