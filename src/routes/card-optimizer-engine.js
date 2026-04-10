const sampleSpendByCategory = {
  dining: 8500,
  ott: 2400,
  fuel: 6000,
  travel: 12000,
  shopping: 18000,
}

const merchantCategoryMap = {
  amazon: "shopping",
  netflix: "ott",
  swiggy: "dining",
  zomato: "dining",
  uber: "travel",
  makemytrip: "travel",
  shell: "fuel",
  hpcl: "fuel",
}

const cards = [
  {
    id: "hdfc-regalia",
    name: "HDFC Regalia",
    bank: "HDFC Bank",
    last4: "4829",
    tier: "Active",
    tags: ["Best for Travel and Dining", "Luxury Rewards"],
    categoryRates: {
      dining: 5,
      ott: 10,
      fuel: 1.5,
      travel: 4,
      shopping: 2,
    },
    benefitText: "5X reward points on all dining spends",
    valueType: "points",
    pointValue: 0.5,
    pointsBalance: 12450,
    rewardValue: 6225,
    expiryNote: "Points expire in 45 days",
    accentColor: "#ffbf00",
  },
  {
    id: "icici-amazon-pay",
    name: "ICICI Amazon Pay",
    bank: "ICICI Bank",
    last4: "1102",
    tier: "Elite",
    tags: ["Best for Amazon Spends", "Unlimited Cashback"],
    categoryRates: {
      dining: 1,
      ott: 1,
      fuel: 2,
      travel: 2,
      shopping: 5,
    },
    benefitText: "5% flat cashback on Amazon purchases",
    valueType: "cashback",
    pointValue: 1,
    pointsBalance: 0,
    rewardValue: 24102,
    expiryNote: "No expiry",
    accentColor: "#ff716b",
  },
  {
    id: "axis-atlas",
    name: "Axis Atlas",
    bank: "Axis Bank",
    last4: "6603",
    tier: "Active",
    tags: ["Best for Flights", "Travel Accelerators"],
    categoryRates: {
      dining: 2,
      ott: 1,
      fuel: 1,
      travel: 6,
      shopping: 2,
    },
    benefitText: "6% effective value back on travel partners",
    valueType: "points",
    pointValue: 0.65,
    pointsBalance: 9300,
    rewardValue: 6045,
    expiryNote: "Points expire in 60 days",
    accentColor: "#38bdf8",
  },
]

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
}

function inferCategory(query) {
  const normalized = normalize(query)
  if (!normalized) {
    return null
  }

  if (merchantCategoryMap[normalized]) {
    return merchantCategoryMap[normalized]
  }

  return Object.keys(sampleSpendByCategory).find((category) => {
    return normalized.includes(category)
  })
}

function estimateMonthlySaving(rate, category) {
  const monthlySpend = sampleSpendByCategory[category] ?? 5000
  return Math.round((monthlySpend * rate) / 100)
}

function buildCategoryPick(category) {
  const sorted = [...cards].sort((a, b) => {
    return (b.categoryRates[category] || 0) - (a.categoryRates[category] || 0)
  })
  const best = sorted[0]

  return {
    category,
    title: `Best for ${category.toUpperCase()}`,
    cardId: best.id,
    cardName: best.name,
    monthlySaving: estimateMonthlySaving(
      best.categoryRates[category] || 0,
      category,
    ),
    rate: best.categoryRates[category] || 0,
    accentColor: best.accentColor,
  }
}

export function buildCardOptimizerData() {
  const categories = ["all", "dining", "ott", "fuel", "travel", "shopping"]

  const categoryPicks = categories
    .filter((category) => category !== "all")
    .map((category) => buildCategoryPick(category))

  return {
    cards,
    categories,
    categoryPicks,
    sampleSpendByCategory,
    merchantCategoryMap,
    inferCategory,
  }
}
