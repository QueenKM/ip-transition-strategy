import { defineWorkstream } from './shared'

export const w6 = defineWorkstream({
  workstreamId: 6,
  title: "Economics, Technology Maturity & Risks",
  summary: "Compare investment cases, readiness criteria and downside risks.",
  requirement: "Validate capital and operating costs, margins, hurdle rates, demand sensitivity, risk owners and criteria for pilot and scale.",
  affectedRoutes: [
    "/strategy/portfolio",
    "/strategy/roadmap",
    "/strategy/gate",
    "/strategy/evidence"
  ],
  affectedRecords: [
    {
      kind: "initiative",
      id: "road-hvo-pilot"
    },
    {
      kind: "initiative",
      id: "public-charging"
    },
    {
      kind: "kpi",
      id: "investment-progress"
    }
  ],
  unresolvedQuestions: [
    "What comparable unit economics and downside cases apply?",
    "What financial and operating thresholds release investment?"
  ],
  topics: [
    {
      id: "finance",
      title: "Investment case",
      description: "Provide a scoped cost model and its drivers.",
      publicContext: "Lecture material describes infrastructure finance and procurement mechanisms.",
      evidenceIds: [
        "E13",
        "E14"
      ],
      affectedRecords: [
        {
          kind: "kpi",
          id: "financial-sustainability"
        },
        {
          kind: "phase",
          id: "near-term"
        },
        {
          kind: "phase",
          id: "medium-term"
        },
        {
          kind: "phase",
          id: "long-term"
        }
      ]
    },
    {
      id: "maturity",
      title: "Technology maturity for IP",
      description: "Separate general market maturity from development, site and contractual readiness."
    },
    {
      id: "risks",
      title: "Risk and dependencies",
      description: "Supply risk owners, mitigation and conditions for pilot and scale."
    }
  ],
  metrics: [
    {
      id: "capex",
      title: "CAPEX",
      description: "Capital cost by candidate scope.",
      unit: null,
      value: {
        value: null,
        evidenceType: "NO DATA",
        inputRequestIds: [
          "ws6-input"
        ]
      }
    },
    {
      id: "opex",
      title: "OPEX",
      description: "Recurring costs and service support.",
      unit: null,
      value: {
        value: null,
        evidenceType: "NO DATA",
        inputRequestIds: [
          "ws6-input"
        ]
      }
    },
    {
      id: "roi",
      title: "ROI",
      description: "Return within the agreed measurement boundary.",
      unit: null,
      value: {
        value: null,
        evidenceType: "NO DATA",
        inputRequestIds: [
          "ws6-input"
        ]
      }
    },
    {
      id: "npv",
      title: "NPV",
      description: "Discounted net cash flows at the agreed rate.",
      unit: null,
      value: {
        value: null,
        evidenceType: "NO DATA",
        inputRequestIds: [
          "ws6-input"
        ]
      }
    },
    {
      id: "payback",
      title: "Payback",
      description: "Time to recover the initial outlay.",
      unit: null,
      value: {
        value: null,
        evidenceType: "NO DATA",
        inputRequestIds: [
          "ws6-input"
        ]
      }
    },
    {
      id: "margin",
      title: "Margin",
      description: "Contribution within the agreed operating scope.",
      unit: null,
      value: {
        value: null,
        evidenceType: "NO DATA",
        inputRequestIds: [
          "ws6-input"
        ]
      }
    },
    {
      id: "hurdle-rate",
      title: "Hurdle rate",
      description: "Minimum decision threshold for investment.",
      unit: null,
      value: {
        value: null,
        evidenceType: "NO DATA",
        inputRequestIds: [
          "ws6-input"
        ]
      }
    },
    {
      id: "demand-sensitivity",
      title: "Demand sensitivity",
      description: "Effect of demand variation on the case.",
      unit: null,
      value: {
        value: null,
        evidenceType: "NO DATA",
        inputRequestIds: [
          "ws6-input"
        ]
      }
    }
  ]
})
