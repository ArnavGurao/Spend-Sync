import { useLoaderData } from "react-router-dom"

const featureCards = [
  {
    title: "Expense Tracking",
    body: "Real-time expense logging with receipt-level categorization.",
    points: [
      "Real-time expense logging",
      "Receipt parsing support",
      "Cross-card spend visibility",
      "Currency aware summaries",
    ],
    tone: "violet",
  },
  {
    title: "Budget Management",
    body: "Monthly budget planning with custom limits and spend rails.",
    points: [
      "Monthly budget planning",
      "Customizable spending limits",
      "Visual progress indicators",
      "Budget alerts",
    ],
    tone: "blue",
  },
  {
    title: "Smart Analytics",
    body: "Interactive spend trends and recommendation-backed decisions.",
    points: [
      "Interactive spending charts",
      "Detailed financial reports",
      "Custom range analysis",
      "Pattern detection",
    ],
    tone: "indigo",
  },
  {
    title: "Split Expenses",
    body: "Track and settle shared costs across friends or teams.",
    points: [
      "Group expense management",
      "Easy bill splitting",
      "Settlement tracking",
      "Reminder nudges",
    ],
    tone: "teal",
  },
  {
    title: "Smart Reminders",
    body: "Never miss due dates with context-aware renewals and alerts.",
    points: [
      "Bill payment alerts",
      "Custom financial reminders",
      "Payment due notifications",
      "Recurring bill tracking",
    ],
    tone: "purple",
  },
  {
    title: "Security Features",
    body: "Data-first safety posture with encrypted records and backups.",
    points: [
      "Secure authentication",
      "Data encryption",
      "Cloud backup",
      "Biometric login",
    ],
    tone: "slate",
  },
]

export function About() {
  const data = useLoaderData()

  return (
    <article className="ss-about-page ss-stagger-enter">
      <section className="ss-about-hero ss-card">
        <h2 className="ss-heading">Empowering You for Financial Success</h2>
        <p className="ss-body">{data.description}</p>
        <button type="button" className="ss-about-cta ss-interactive-card">
          Get Started
        </button>
      </section>

      <section className="ss-feature-grid" aria-label="Platform capabilities">
        {featureCards.map((card) => (
          <article
            key={card.title}
            className={`ss-feature-card ss-feature-${card.tone} ss-interactive-card`}
            tabIndex={0}
          >
            <h3>{card.title}</h3>
            <p>{card.body}</p>
            <ul>
              {card.points.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </article>
  )
}
