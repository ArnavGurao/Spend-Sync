# SpendSync

SpendSync is a personal finance product focused on transaction intelligence,
subscription tracking, and renewal leak prevention.

This README is product-focused. It intentionally avoids implementation details
about frameworks, languages, infrastructure, or vendor choices.

## What SpendSync Does

SpendSync converts noisy financial signals into useful actions for users:

- Tracks card spend and subscription commitments in one place
- Detects likely recurring charges from transaction activity
- Forecasts upcoming renewals and trial conversions
- Flags potential "subscription leaks" (forgotten or redundant recurring spend)
- Recommends the best payment option for a purchase
- Provides analytics views for monthly/yearly spend behavior

Core promise: minimal manual work after setup, with clear, timely
recommendations.

## Product Goals

- Capture and normalize transaction signals from user-provided sources
- Classify spend into useful categories and recurring patterns
- Maintain an accurate subscription ledger with renewal dates
- Alert users before charge events with urgency-based prioritization
- Provide card-level and portfolio-level spending insights
- Suggest payment optimization opportunities at decision time
- Support a future natural-language copilot over a user’s own data

## Non-Goals (MVP)

- No storage of full card number, CVV, OTP, or bank login credentials
- No direct payment execution as part of core product behavior
- No hard dependency on a single ingestion method to use the app

## Primary User Value

- "What am I spending on subscriptions right now?"
- "Which payments are due soon?"
- "What should I use to pay for this purchase?"
- "Where can I cut recurring spend quickly?"

## Key Product Surfaces

- Dashboard: spend totals, upcoming renewals, quick insights
- Card Detail: card-linked subscriptions and usage context
- Add Card: metadata-only card onboarding
- Analytics: category and card spend breakdowns
- Alerts: urgency-sorted renewal/trial reminders
- Optimal Advisor: best payment option for a merchant/amount
- Subscription DNA: portfolio persona and behavior narrative

## Core User Flow

1. User completes onboarding and adds one or more cards (metadata only).
2. User provides transaction signals through supported ingestion paths.
3. System parses and normalizes events into structured charge candidates.
4. User confirms classification when confidence is low or context is missing.
5. System creates/updates subscriptions and computes next renewal dates.
6. Alert schedule is generated and surfaced in notifications + Alerts screen.
7. Dashboard and analytics refresh with latest totals and trends.

## Functional Requirements

### Onboarding

- Explain value clearly and request only minimum profile data.
- Offer fallback paths if users do not enable optional data access.
- Keep setup lightweight so users can see value quickly.

### Card Management

Store only safe card metadata:

- bank name
- card variant (optional)
- last four digits
- expiry (display/context)
- network

Rules:

- Never request or store full PAN/CVV/OTP.
- Mask card representation in all user-visible surfaces.
- Support edit/delete with safe handling for linked records.

### Transaction Parsing

System should extract, when available:

- merchant/service
- amount and currency
- card identifier (e.g., last four)
- event date/time
- source confidence

Quality requirements:

- Duplicate suppression for repeated signals
- Confidence scoring with safe user confirmation path
- Merchant normalization for consistent analytics/subscriptions

### Subscription Tracking

Track recurring and trial behaviors with:

- amount
- billing cadence
- next renewal date
- status severity (`safe`, `warning`, `urgent`, `trial-urgent`)

Status guidance:

- urgent: renewal imminent
- warning: near-term renewal window
- safe: outside warning window
- trial-urgent: trial ending soon

### Alerts

- Sort by urgency and time-to-renewal
- Support filter views (all, urgent, trials)
- Use default reminder cadence before renewal/trial end
- Keep alerts actionable and low-noise

### Analytics

Provide:

- monthly spend total
- yearly projection
- spend by card
- spend by category
- top recurring commitments

Analytics should remain interpretable and explainable to users.

### Optimization Advisor

- Recommend best payment option for merchant/category + amount context
- Return rationale and estimated upside
- Show nudges when user-selected option appears sub-optimal

### Subscription DNA

- Derive a simple persona from subscription portfolio patterns
- Present peer-style insights and trend narrative
- Keep persona explainable and non-prescriptive

### AI Copilot (Phase)

Enable natural-language queries over user-owned data, such as:

- "What renews this week?"
- "How much do I spend on entertainment each month?"
- "What is my most expensive subscription?"

Copilot responses should prioritize correctness, transparency, and privacy.

## Future Scope

The following capabilities are intentionally planned as future scope (not current
baseline behavior):

- SMS ingestion pipeline for real-time transaction signal capture
- SMS parsing and recurring-signature detection automation
- SMS-driven subscription creation prompts with confidence-based review

Until this scope is activated, users should still be able to track cards,
subscriptions, alerts, and analytics through non-SMS flows.

## Data and Privacy Principles

- Data minimization first: store only what is required for product outcomes.
- Sensitive data must be masked/redacted in logs and operational tooling.
- Users should be able to correct categorization and subscription mapping.
- Ambiguous automation should request confirmation instead of guessing.
- Retention should align with user benefit and compliance obligations.

## Product Quality Requirements

- Accuracy: extraction and classification must be reliable for common cases.
- Freshness: dashboard and alerts should reflect new confirmed data quickly.
- Robustness: duplicate prevention and idempotent processing are mandatory.
- Explainability: recommendations include clear reason strings.
- UX safety: uncertain predictions degrade gracefully to user confirmation.

## Success Metrics (Product)

- Activation: users completing setup and adding at least one card
- Coverage: percentage of recurring spend correctly identified
- Precision: low false-positive leak alerts
- Engagement: alert open and action rates
- Savings proxy: estimated value from optimization recommendations
- Retention: recurring monthly active users with sustained value

## Milestones (Product)

- M1: Card management + manual subscription tracking + alerts basics
- M2: Automated signal parsing + confirmation workflow
- M3: Analytics and trend surfaces
- M4: Optimization advisor and recommendation nudges
- M5: Subscription DNA persona layer
- M6: Copilot experience

## Open Product Questions

- How should confidence thresholds vary by source quality?
- Which alert cadence is most useful without creating fatigue?
- What persona outputs are informative without feeling generic?
- Which optimization explanation style builds the most trust?

## Notes

- This document describes the product behavior and scope.
- Engineering conventions, commands, and implementation rules are maintained in
  `AGENTS.md`.
