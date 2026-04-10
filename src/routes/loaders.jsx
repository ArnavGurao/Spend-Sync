import { buildAnalytics } from "./analytics-engine.js"
import { buildCardOptimizerData } from "./card-optimizer-engine.js"

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const seedTransactions = [
  { merchant: "Netflix", amount: 499, date: "2025-10-28", cardLast4: "4521" },
  { merchant: "Spotify", amount: 99, date: "2025-10-16", cardLast4: "4521" },
  {
    merchant: "Amazon Prime",
    amount: 199,
    date: "2025-10-11",
    cardLast4: "8834",
  },
  { merchant: "Canva Pro", amount: 399, date: "2025-11-09", cardLast4: "2210" },
  { merchant: "Netflix", amount: 549, date: "2025-11-28", cardLast4: "4521" },
  { merchant: "Spotify", amount: 109, date: "2025-11-16", cardLast4: "4521" },
  {
    merchant: "Disney+ Hotstar",
    amount: 199,
    date: "2025-11-14",
    cardLast4: "8834",
  },
  {
    merchant: "Google One",
    amount: 130,
    date: "2025-12-08",
    cardLast4: "2210",
  },
  {
    merchant: "LinkedIn Premium",
    amount: 2499,
    date: "2025-12-02",
    cardLast4: "6603",
  },
  {
    merchant: "YouTube Premium",
    amount: 129,
    date: "2025-12-19",
    cardLast4: "4521",
  },
  { merchant: "Netflix", amount: 599, date: "2025-12-28", cardLast4: "4521" },
  { merchant: "Zoom Pro", amount: 1100, date: "2026-01-07", cardLast4: "6603" },
  {
    merchant: "Adobe Creative Cloud",
    amount: 1499,
    date: "2026-01-13",
    cardLast4: "2210",
  },
  {
    merchant: "Swiggy One",
    amount: 299,
    date: "2026-01-20",
    cardLast4: "8834",
  },
  { merchant: "Netflix", amount: 649, date: "2026-01-28", cardLast4: "4521" },
  { merchant: "Canva Pro", amount: 499, date: "2026-02-09", cardLast4: "2210" },
  {
    merchant: "LinkedIn Premium",
    amount: 2499,
    date: "2026-02-02",
    cardLast4: "6603",
  },
  {
    merchant: "Disney+ Hotstar",
    amount: 299,
    date: "2026-02-14",
    cardLast4: "8834",
  },
  { merchant: "Spotify", amount: 119, date: "2026-02-16", cardLast4: "4521" },
  {
    merchant: "Zoom Pro",
    amount: 1100,
    date: "2026-03-07",
    cardLast4: "6603",
  },
  {
    merchant: "Google One",
    amount: 130,
    date: "2026-03-08",
    cardLast4: "2210",
  },
  { merchant: "Canva Pro", amount: 499, date: "2026-03-09", cardLast4: "2210" },
  {
    merchant: "Swiggy One",
    amount: 299,
    date: "2026-03-20",
    cardLast4: "8834",
  },
  { merchant: "Netflix", amount: 649, date: "2026-03-28", cardLast4: "4521" },
]

export async function homeLoader() {
  const data = await fetch("/home").then((res) => res.json())

  return data
}

export async function aboutLoader() {
  await wait(120)
  return {
    title: "About",
    description: "Product baseline with design-system aligned visuals.",
    stack: [
      "Unified spend dashboard",
      "Subscription renewal tracking",
      "Future scope: SMS ingestion",
    ],
  }
}

export async function analyticsLoader() {
  await wait(120)
  return buildAnalytics(seedTransactions)
}

export async function cardOptimizerLoader() {
  await wait(120)
  return buildCardOptimizerData()
}
