const CATEGORY_RULES = [
  {
    category: "Entertainment",
    keywords: ["netflix", "spotify", "youtube", "hotstar", "prime video"],
  },
  {
    category: "Productivity",
    keywords: ["notion", "canva", "adobe", "grammarly", "figma"],
  },
  {
    category: "Cloud Storage",
    keywords: ["google one", "icloud", "dropbox"],
  },
  {
    category: "Food & Delivery",
    keywords: ["swiggy", "zomato"],
  },
  {
    category: "Learning & Education",
    keywords: ["coursera", "udemy", "skillshare"],
  },
  {
    category: "Gaming",
    keywords: ["xbox", "playstation", "steam"],
  },
  {
    category: "Shopping",
    keywords: ["amazon prime", "flipkart"],
  },
  {
    category: "Finance & Investing",
    keywords: ["smallcase", "zerodha", "et prime"],
  },
  {
    category: "Fitness & Wellness",
    keywords: ["cult", "headspace", "calm"],
  },
  {
    category: "Communication",
    keywords: ["zoom", "slack", "teams"],
  },
  {
    category: "AI & Tools",
    keywords: ["chatgpt", "claude", "midjourney", "perplexity"],
  },
  {
    category: "Security & VPN",
    keywords: ["nordvpn", "bitdefender", "1password"],
  },
]

const CATEGORY_COLORS = {
  Entertainment: "#ff7a00",
  Productivity: "#3f6cff",
  "Cloud Storage": "#14b8a6",
  "Food & Delivery": "#ffbf00",
  "Learning & Education": "#a855f7",
  Gaming: "#ef4444",
  Shopping: "#22c55e",
  "Finance & Investing": "#38bdf8",
  "Fitness & Wellness": "#f97316",
  Communication: "#06b6d4",
  "AI & Tools": "#f43f5e",
  "Security & VPN": "#84cc16",
}

function normalizeMerchant(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function categorizeMerchant(merchant) {
  const normalized = normalizeMerchant(merchant)
  const rule = CATEGORY_RULES.find(({ keywords }) => {
    return keywords.some((keyword) => normalized.includes(keyword))
  })
  return rule?.category ?? "Other"
}

function monthKey(date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  return `${year}-${month}`
}

function monthLabel(date) {
  return date.toLocaleString("en-IN", { month: "short" })
}

function inr(amount) {
  return `\u20b9${Math.round(amount).toLocaleString("en-IN")}`
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0)
}

function average(values) {
  if (values.length === 0) {
    return 0
  }
  return sum(values) / values.length
}

function getMonthWindow(referenceDate, count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(referenceDate)
    date.setDate(1)
    date.setMonth(referenceDate.getMonth() - (count - 1 - index))
    return date
  })
}

function growthPercent(first, last) {
  if (first <= 0) {
    return 0
  }
  return ((last - first) / first) * 100
}

function getNextChargeDate(referenceDate, chargeDay) {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()
  const thisMonthMax = new Date(year, month + 1, 0).getDate()
  const safeDayThisMonth = Math.min(chargeDay, thisMonthMax)

  const candidate = new Date(year, month, safeDayThisMonth)
  if (candidate <= referenceDate) {
    const nextMonthMax = new Date(year, month + 2, 0).getDate()
    const safeDayNextMonth = Math.min(chargeDay, nextMonthMax)
    return new Date(year, month + 1, safeDayNextMonth)
  }

  return candidate
}

export function buildAnalytics(transactions) {
  const normalized = transactions
    .map((transaction) => {
      const date = new Date(transaction.date)
      const amount = Number(transaction.amount) || 0
      const merchant = String(transaction.merchant || "Unknown")
      const cardLast4 = String(transaction.cardLast4 || "0000")
      const category = categorizeMerchant(merchant)

      return {
        ...transaction,
        date,
        monthKey: monthKey(date),
        amount,
        merchant,
        cardLast4,
        category,
        subscriptionKey: `${normalizeMerchant(merchant)}-${cardLast4}`,
      }
    })
    .sort((a, b) => a.date - b.date)

  const referenceDate = normalized.at(-1)?.date ?? new Date()
  const currentMonth = monthKey(referenceDate)
  const currentMonthTransactions = normalized.filter((transaction) => {
    return transaction.monthKey === currentMonth
  })

  const monthWindow = getMonthWindow(referenceDate, 6)
  const previousMonthDate = getMonthWindow(referenceDate, 2)[0]
  const previousMonthKey = monthKey(previousMonthDate)
  const monthlySpendTrend = monthWindow.map((monthDate) => {
    const key = monthKey(monthDate)
    const amount = sum(
      normalized
        .filter((transaction) => transaction.monthKey === key)
        .map((transaction) => transaction.amount),
    )
    return {
      key,
      label: monthLabel(monthDate),
      amount,
    }
  })

  const monthlySubscriptionTrend = monthWindow.map((monthDate) => {
    const key = monthKey(monthDate)
    const set = new Set(
      normalized
        .filter((transaction) => transaction.monthKey === key)
        .map((transaction) => transaction.subscriptionKey),
    )

    return {
      key,
      label: monthLabel(monthDate),
      count: set.size,
    }
  })

  const latestBySubscription = new Map()
  for (const transaction of normalized) {
    latestBySubscription.set(transaction.subscriptionKey, transaction)
  }
  const activeSubscriptions = [...latestBySubscription.values()]

  const monthlySpend = sum(
    currentMonthTransactions.map((transaction) => transaction.amount),
  )
  const yearlyProjection = monthlySpend * 12
  const activeSubscriptionCount = activeSubscriptions.length
  const avgSubscriptionCost =
    activeSubscriptionCount > 0 ? monthlySpend / activeSubscriptionCount : 0

  const mostExpensive = [...activeSubscriptions].sort((a, b) => {
    return b.amount - a.amount
  })[0]

  const upcomingCharges = activeSubscriptions
    .map((transaction) => {
      const nextChargeDate = getNextChargeDate(
        referenceDate,
        transaction.date.getDate(),
      )
      const daysUntil = Math.ceil(
        (nextChargeDate.getTime() - referenceDate.getTime()) /
          (1000 * 60 * 60 * 24),
      )
      return {
        merchant: transaction.merchant,
        amount: transaction.amount,
        cardLast4: transaction.cardLast4,
        date: nextChargeDate,
        daysUntil,
      }
    })
    .sort((a, b) => a.date - b.date)

  const upcoming7Days = sum(
    upcomingCharges
      .filter((charge) => charge.daysUntil >= 0 && charge.daysUntil <= 7)
      .map((charge) => charge.amount),
  )

  const upcoming30Days = sum(
    upcomingCharges
      .filter((charge) => charge.daysUntil >= 0 && charge.daysUntil <= 30)
      .map((charge) => charge.amount),
  )

  const categoryMap = new Map()
  const previousCategoryMap = new Map()
  for (const transaction of currentMonthTransactions) {
    const entry = categoryMap.get(transaction.category) ?? {
      category: transaction.category,
      spend: 0,
      subscriptions: new Set(),
    }
    entry.spend += transaction.amount
    entry.subscriptions.add(transaction.subscriptionKey)
    categoryMap.set(transaction.category, entry)
  }

  for (const transaction of normalized.filter((transaction) => {
    return transaction.monthKey === previousMonthKey
  })) {
    const current = previousCategoryMap.get(transaction.category) ?? 0
    previousCategoryMap.set(transaction.category, current + transaction.amount)
  }

  const categoryBreakdown = [...categoryMap.values()].map((entry) => {
    const subscriptionCount = entry.subscriptions.size
    const share = monthlySpend > 0 ? (entry.spend / monthlySpend) * 100 : 0
    return {
      category: entry.category,
      spend: entry.spend,
      share,
      subscriptionCount,
      averageCost: subscriptionCount > 0 ? entry.spend / subscriptionCount : 0,
      growthRate:
        previousCategoryMap.get(entry.category) > 0
          ? ((entry.spend - previousCategoryMap.get(entry.category)) /
              previousCategoryMap.get(entry.category)) *
            100
          : 0,
    }
  })

  const categoriesWithDefaults = CATEGORY_RULES.map((rule) => {
    const existing = categoryBreakdown.find(
      (entry) => entry.category === rule.category,
    )
    if (existing) {
      return existing
    }

    return {
      category: rule.category,
      spend: 0,
      share: 0,
      subscriptionCount: 0,
      averageCost: 0,
      growthRate: 0,
    }
  })

  const rankedCategoryBreakdown = categoriesWithDefaults
    .sort((a, b) => b.spend - a.spend)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      color: CATEGORY_COLORS[entry.category],
      spendFormatted: inr(entry.spend),
      shareRounded: Math.round(entry.share),
    }))

  const cardMap = new Map()
  for (const transaction of currentMonthTransactions) {
    const entry = cardMap.get(transaction.cardLast4) ?? {
      cardLast4: transaction.cardLast4,
      spend: 0,
      subscriptions: 0,
    }
    entry.spend += transaction.amount
    entry.subscriptions += 1
    cardMap.set(transaction.cardLast4, entry)
  }

  const cardBreakdown = [...cardMap.values()]
    .map((entry) => {
      return {
        ...entry,
        share: monthlySpend > 0 ? (entry.spend / monthlySpend) * 100 : 0,
      }
    })
    .sort((a, b) => b.spend - a.spend)

  const transactionsBySubscription = normalized.reduce((acc, transaction) => {
    const key = transaction.subscriptionKey
    const current = acc.get(key) ?? []
    current.push(transaction)
    acc.set(key, current)
    return acc
  }, new Map())

  const subscriptionInsights = [...transactionsBySubscription.entries()]
    .map(([subscriptionKey, records]) => {
      const sorted = [...records].sort((a, b) => a.date - b.date)
      const first = sorted[0]
      const latest = sorted.at(-1)
      const uniqueMonths = new Set(sorted.map((record) => record.monthKey)).size
      const avgMonthly = average(sorted.map((record) => record.amount))
      const inflationRate =
        first.amount > 0
          ? ((latest.amount - first.amount) / first.amount) * 100
          : 0

      return {
        subscriptionKey,
        merchant: latest.merchant,
        cardLast4: latest.cardLast4,
        latestAmount: latest.amount,
        averageAmount: avgMonthly,
        recordsCount: sorted.length,
        activeMonths: uniqueMonths,
        inflationRate,
        firstAmount: first.amount,
      }
    })
    .sort((a, b) => b.latestAmount - a.latestAmount)

  const inflationTracker = subscriptionInsights
    .filter((entry) => Math.abs(entry.inflationRate) >= 5)
    .slice(0, 5)

  const merchantDefaultCard = normalized.reduce((acc, transaction) => {
    const merchantKey = normalizeMerchant(transaction.merchant)
    const bucket = acc.get(merchantKey) ?? new Map()
    bucket.set(
      transaction.cardLast4,
      (bucket.get(transaction.cardLast4) ?? 0) + 1,
    )
    acc.set(merchantKey, bucket)
    return acc
  }, new Map())

  function bestCardForMerchant(merchant) {
    const bucket = merchantDefaultCard.get(normalizeMerchant(merchant))
    if (!bucket) {
      return null
    }

    return [...bucket.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  }

  const optimizationOpportunities = currentMonthTransactions
    .map((transaction) => {
      const suggestedCard = bestCardForMerchant(transaction.merchant)
      if (!suggestedCard || suggestedCard === transaction.cardLast4) {
        return null
      }

      const estimatedLoss = transaction.amount * 0.02
      return {
        merchant: transaction.merchant,
        usedCardLast4: transaction.cardLast4,
        suggestedCardLast4: suggestedCard,
        estimatedLoss,
      }
    })
    .filter(Boolean)
    .slice(0, 5)

  const potentialSavingsMonthly = sum(
    optimizationOpportunities.map((item) => item.estimatedLoss),
  )
  const potentialSavingsYearly = potentialSavingsMonthly * 12

  const portfolioDistribution = {
    low: activeSubscriptions.filter((subscription) => subscription.amount < 200)
      .length,
    medium: activeSubscriptions.filter((subscription) => {
      return subscription.amount >= 200 && subscription.amount <= 1000
    }).length,
    high: activeSubscriptions.filter(
      (subscription) => subscription.amount > 1000,
    ).length,
  }

  const portfolioSpend = {
    low: sum(
      activeSubscriptions
        .filter((subscription) => subscription.amount < 200)
        .map((subscription) => subscription.amount),
    ),
    medium: sum(
      activeSubscriptions
        .filter((subscription) => {
          return subscription.amount >= 200 && subscription.amount <= 1000
        })
        .map((subscription) => subscription.amount),
    ),
    high: sum(
      activeSubscriptions
        .filter((subscription) => subscription.amount > 1000)
        .map((subscription) => subscription.amount),
    ),
  }

  const spendGrowth = growthPercent(
    monthlySpendTrend[0]?.amount ?? 0,
    monthlySpendTrend.at(-1)?.amount ?? 0,
  )

  const subscriptionGrowth = growthPercent(
    monthlySubscriptionTrend[0]?.count ?? 0,
    monthlySubscriptionTrend.at(-1)?.count ?? 0,
  )

  const topCategory = rankedCategoryBreakdown[0]
  const fastestGrowingCategory = [...rankedCategoryBreakdown].sort((a, b) => {
    return b.growthRate - a.growthRate
  })[0]
  const topCard = cardBreakdown[0]

  const aiInsights = [
    `Monthly spend is ${inr(monthlySpend)} with a yearly projection of ${inr(yearlyProjection)}.`,
    `Spend trend changed by ${Math.round(spendGrowth)}% over the last 6 months.`,
    `Subscription count changed by ${Math.round(subscriptionGrowth)}% in the same period.`,
    topCategory
      ? `${topCategory.category} is your largest category at ${Math.round(topCategory.share)}% of monthly spend.`
      : "No category insight yet.",
    topCard
      ? `Card ••${topCard.cardLast4} carries ${Math.round(topCard.share)}% of monthly spend.`
      : "No card concentration insight yet.",
    optimizationOpportunities.length > 0
      ? `Switching recurring charges to preferred cards may save about ${inr(potentialSavingsYearly)} per year.`
      : "No card switching opportunities detected from current history.",
  ]

  const totalPortfolioSpend =
    portfolioSpend.low + portfolioSpend.medium + portfolioSpend.high

  const renewalDensity = upcomingCharges.reduce(
    (acc, charge) => {
      const day = charge.date.getDate()
      if (day <= 6) {
        acc.week1 += 1
      } else if (day <= 13) {
        acc.week2 += 1
      } else if (day <= 20) {
        acc.week3 += 1
      } else if (day <= 27) {
        acc.week4 += 1
      } else {
        acc.week5 += 1
      }
      return acc
    },
    { week1: 0, week2: 0, week3: 0, week4: 0, week5: 0 },
  )

  const categoryInsights = [
    topCategory
      ? `${topCategory.category} is the largest category at ${Math.round(topCategory.share)}% of monthly spend.`
      : "Category signals will appear after more transactions.",
    fastestGrowingCategory && fastestGrowingCategory.growthRate > 0
      ? `${fastestGrowingCategory.category} is growing fastest at +${Math.round(fastestGrowingCategory.growthRate)}% vs last month.`
      : "No significant category growth this month.",
  ]

  const efficiencyBars = subscriptionInsights
    .map((entry) => {
      const usageScore = clamp(entry.recordsCount * 12, 0, 48)
      const continuityScore = clamp(entry.activeMonths * 8, 0, 32)
      const stabilityScore = clamp(20 - Math.abs(entry.inflationRate), 0, 20)
      const score = Math.round(
        clamp(usageScore + continuityScore + stabilityScore, 0, 100),
      )

      return {
        subscriptionKey: entry.subscriptionKey,
        merchant: entry.merchant,
        score,
        amount: entry.latestAmount,
        amountFormatted: inr(entry.latestAmount),
      }
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 6)

  const weeklyDistribution = {
    week1: sum(
      upcomingCharges
        .filter((charge) => charge.date.getDate() <= 6)
        .map((charge) => charge.amount),
    ),
    week2: sum(
      upcomingCharges
        .filter(
          (charge) => charge.date.getDate() > 6 && charge.date.getDate() <= 13,
        )
        .map((charge) => charge.amount),
    ),
    week3: sum(
      upcomingCharges
        .filter(
          (charge) => charge.date.getDate() > 13 && charge.date.getDate() <= 20,
        )
        .map((charge) => charge.amount),
    ),
    week4: sum(
      upcomingCharges
        .filter(
          (charge) => charge.date.getDate() > 20 && charge.date.getDate() <= 27,
        )
        .map((charge) => charge.amount),
    ),
    week5: sum(
      upcomingCharges
        .filter((charge) => charge.date.getDate() > 27)
        .map((charge) => charge.amount),
    ),
  }

  return {
    kpis: [
      { id: "monthly", label: "Monthly Spend", value: inr(monthlySpend) },
      {
        id: "yearly",
        label: "Yearly Projection",
        value: inr(yearlyProjection),
      },
      {
        id: "active",
        label: "Active Subscriptions",
        value: `${activeSubscriptionCount}`,
      },
      {
        id: "average",
        label: "Avg Subscription Cost",
        value: inr(avgSubscriptionCost),
      },
      {
        id: "expensive",
        label: "Most Expensive",
        value: mostExpensive
          ? `${mostExpensive.merchant} ${inr(mostExpensive.amount)}`
          : "--",
      },
      { id: "upcoming", label: "Upcoming 7 Days", value: inr(upcoming7Days) },
      {
        id: "trial-risk",
        label: "Free Trial Risk",
        value: "--",
        note: "Needs trial metadata",
      },
      {
        id: "savings",
        label: "Potential Savings",
        value:
          potentialSavingsYearly > 0
            ? inr(potentialSavingsYearly)
            : "No signal",
        note: "Heuristic estimate from card switching patterns",
      },
    ],
    trends: {
      monthlySpend: monthlySpendTrend,
      subscriptionCount: monthlySubscriptionTrend,
      spendGrowth,
      subscriptionGrowth,
    },
    summary: {
      monthlySpend,
      monthlySpendFormatted: inr(monthlySpend),
      currentMonthLabel: referenceDate.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
    },
    categoryBreakdown: rankedCategoryBreakdown,
    categoryInsights,
    cardBreakdown,
    cardOptimization: {
      opportunities: optimizationOpportunities.map((item) => ({
        ...item,
        estimatedLossFormatted: inr(item.estimatedLoss),
      })),
      potentialSavingsYearly: inr(potentialSavingsYearly),
      concentrationRisk:
        topCard && topCard.share >= 45
          ? `Card ••${topCard.cardLast4} handles ${Math.round(topCard.share)}% of monthly spend.`
          : "Card concentration is currently balanced.",
    },
    subscriptionInsights: {
      topSubscriptions: subscriptionInsights.slice(0, 5).map((item) => ({
        ...item,
        latestAmountFormatted: inr(item.latestAmount),
        inflationRateRounded: Math.round(item.inflationRate),
      })),
      renewalDensity,
      inflationTracker: inflationTracker.map((item) => ({
        ...item,
        firstAmountFormatted: inr(item.firstAmount),
        latestAmountFormatted: inr(item.latestAmount),
        inflationRateRounded: Math.round(item.inflationRate),
      })),
      efficiencyBars,
      weeklyDistribution,
    },
    upcomingForecast: {
      next7Days: inr(upcoming7Days),
      next30Days: inr(upcoming30Days),
      next90Days: inr(upcoming30Days * 3),
      upcomingCharges: upcomingCharges.slice(0, 5).map((charge) => {
        return {
          ...charge,
          amountFormatted: inr(charge.amount),
          dateLabel: charge.date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
        }
      }),
    },
    portfolioDistribution: {
      tiers: [
        {
          label: "Low (< \u20b9200)",
          count: portfolioDistribution.low,
          spend: portfolioSpend.low,
          share:
            totalPortfolioSpend > 0
              ? (portfolioSpend.low / totalPortfolioSpend) * 100
              : 0,
        },
        {
          label: "Medium (\u20b9200-\u20b91,000)",
          count: portfolioDistribution.medium,
          spend: portfolioSpend.medium,
          share:
            totalPortfolioSpend > 0
              ? (portfolioSpend.medium / totalPortfolioSpend) * 100
              : 0,
        },
        {
          label: "High (> \u20b91,000)",
          count: portfolioDistribution.high,
          spend: portfolioSpend.high,
          share:
            totalPortfolioSpend > 0
              ? (portfolioSpend.high / totalPortfolioSpend) * 100
              : 0,
        },
      ],
      insight:
        totalPortfolioSpend > 0
          ? `High-value subscriptions contribute ${Math.round((portfolioSpend.high / totalPortfolioSpend) * 100)}% of portfolio spend.`
          : "Portfolio distribution will appear with more data.",
    },
    aiInsights,
  }
}
