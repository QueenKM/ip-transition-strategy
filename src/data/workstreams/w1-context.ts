import { defineWorkstream } from './shared'

export const w1 = defineWorkstream({
  workstreamId: 1,
  title: "Regulation, Market & Demand",
  summary: "Identify the rules, market conditions and demand scenarios that shape the case.",
  requirement: "Provide applicable duties, customer demand scenarios, competitor findings and implications for IP.",
  affectedRoutes: [
    "/strategy",
    "/strategy/portfolio",
    "/strategy/gate"
  ],
  affectedRecords: [],
  unresolvedQuestions: [
    "Which obligations apply by product, operator and site?",
    "Which customer segments and catchments support the demand scenarios?"
  ],
  topics: [
    {
      id: "regulation",
      title: "Regulatory conclusions",
      description: "Identify binding requirements and decision implications.",
      publicContext: "Lecture 3 explains the distinction between the EU ETS for covered installations and the upstream ETS2 framework. IP applicability requires confirmation against current rules.",
      evidenceIds: [
        "E02",
        "E03",
        "E16"
      ]
    },
    {
      id: "market",
      title: "Market conclusions",
      description: "Validate market trends within relevant reporting and geographic boundaries.",
      publicContext: "Previously verified Italian registrations and public offers provide market context.",
      evidenceIds: [
        "E04"
      ]
    },
    {
      id: "demand",
      title: "Demand scenarios",
      description: "Supply dated segment, geography and adoption assumptions and scenarios."
    },
    {
      id: "competition",
      title: "Competitor conclusions",
      description: "Compare locally relevant competitors and services with a consistent boundary.",
      publicContext: "Public offers describe specific products and services.",
      evidenceIds: [
        "E04"
      ]
    },
    {
      id: "implications",
      title: "Implications for IP",
      description: "Explain which decisions depend on regulation, demand and competition."
    }
  ]
})
