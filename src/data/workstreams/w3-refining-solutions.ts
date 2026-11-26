import { defineWorkstream } from './shared'

export const w3 = defineWorkstream({
  workstreamId: 3,
  title: "Refining Solutions",
  summary: "Assess site measures, fuel pathways and the product mix.",
  requirement: "Submit the refined shortlist with priorities, timing, feasibility, certification dependencies and decision milestones.",
  affectedRoutes: [
    "/strategy/value-chain",
    "/strategy/portfolio",
    "/strategy/roadmap",
    "/strategy/gate"
  ],
  affectedRecords: [],
  unresolvedQuestions: [
    "Which measures fit operating and outage constraints?",
    "Which certified outputs and volumes can each route deliver?"
  ],
  topics: [
    {
      id: "efficiency",
      title: "Efficiency",
      description: "Assess unit and heat-integration measures.",
      publicContext: "Lecture context covers energy supply and decarbonisation levers.",
      evidenceIds: [
        "E11",
        "E12"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "refinery-efficiency-technology"
        },
        {
          kind: "initiative",
          id: "refinery-efficiency"
        },
        {
          kind: "phase",
          id: "near-term"
        }
      ]
    },
    {
      id: "electrification",
      title: "Electrification",
      description: "Evaluate specific refinery duties and electricity constraints.",
      publicContext: "Lecture context describes industrial energy carriers and electricity-system constraints.",
      evidenceIds: [
        "E11",
        "E13"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "process-electrification-technology"
        },
        {
          kind: "initiative",
          id: "process-electrification"
        },
        {
          kind: "phase",
          id: "medium-term"
        }
      ]
    },
    {
      id: "renewables",
      title: "Renewable electricity",
      description: "Assess sourcing, electricity attributes, contracts and load.",
      publicContext: "Lecture material describes procurement and power-purchase mechanisms.",
      evidenceIds: [
        "E14"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "renewable-power-technology"
        },
        {
          kind: "initiative",
          id: "renewable-power"
        },
        {
          kind: "phase",
          id: "near-term"
        }
      ]
    },
    {
      id: "feedstocks",
      title: "Alternative feedstocks",
      description: "Screen feedstock quality, unit fit, traceability and supply.",
      publicContext: "Company-reported co-processing provides historical context.",
      evidenceIds: [
        "E06"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "feedstock-coprocessing-technology"
        },
        {
          kind: "initiative",
          id: "feedstock-coprocessing"
        },
        {
          kind: "phase",
          id: "near-term"
        }
      ]
    },
    {
      id: "biofuels",
      title: "Biofuels",
      description: "Assess qualifying output, destination channels and certification.",
      publicContext: "Reported commercial channels and European rules provide starting context.",
      evidenceIds: [
        "E02",
        "E06"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "advanced-biofuels-technology"
        },
        {
          kind: "initiative",
          id: "feedstock-coprocessing"
        },
        {
          kind: "kpi",
          id: "eligible-product-share"
        },
        {
          kind: "phase",
          id: "medium-term"
        }
      ]
    },
    {
      id: "hydrogen",
      title: "Hydrogen",
      description: "Assess use cases and case-specific infrastructure and economics.",
      publicContext: "The disclosed Trecate project establishes context for its stated scope.",
      evidenceIds: [
        "E07"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "refinery-hydrogen-technology"
        },
        {
          kind: "initiative",
          id: "refinery-hydrogen"
        },
        {
          kind: "phase",
          id: "medium-term"
        }
      ]
    },
    {
      id: "e-fuels",
      title: "E-fuels",
      description: "Assess feedstock, synthesis, power, demand and certification.",
      publicContext: "The regulatory register records separate aviation and maritime requirements.",
      evidenceIds: [
        "E03"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "e-fuels-technology"
        },
        {
          kind: "initiative",
          id: "e-fuels"
        },
        {
          kind: "phase",
          id: "long-term"
        }
      ]
    },
    {
      id: "carbon",
      title: "Carbon management",
      description: "Review residual emissions and feasibility, including full-chain dependencies.",
      publicContext: "The public and lecture register frames refinery emissions and policy.",
      evidenceIds: [
        "E03",
        "E12"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "carbon-capture-technology"
        },
        {
          kind: "initiative",
          id: "carbon-capture"
        },
        {
          kind: "phase",
          id: "long-term"
        }
      ]
    }
  ]
})
