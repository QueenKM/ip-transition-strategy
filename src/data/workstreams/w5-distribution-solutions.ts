import { defineWorkstream } from './shared'

export const w5 = defineWorkstream({
  workstreamId: 5,
  title: "Distribution Solutions",
  summary: "Assess formats for stations, charging, fuels and customer services.",
  requirement: "Supply selected pilots, site and fleet criteria, commercial model, service design and conditions for scale.",
  affectedRoutes: [
    "/strategy/portfolio",
    "/strategy/roadmap",
    "/strategy/gate",
    "/mobility/explore",
    "/mobility/journey"
  ],
  affectedRecords: [],
  unresolvedQuestions: [
    "Which places and fleets can support comparable pilot evidence?",
    "How will operator rights, compatibility and data access be verified?"
  ],
  topics: [
    {
      id: "ev",
      title: "EV charging",
      description: "Assess public charging format and site selection.",
      publicContext: "Public evidence covers IP’s reported footprint and applicable infrastructure rules.",
      evidenceIds: [
        "E03",
        "E08"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "public-charging-technology"
        },
        {
          kind: "initiative",
          id: "public-charging"
        },
        {
          kind: "phase",
          id: "near-term"
        }
      ]
    },
    {
      id: "fleet-charge",
      title: "Fleet charging",
      description: "Assess duty cycles, depot dwell and corridor requirements.",
      publicContext: "Lecture context describes flexibility and grid constraints.",
      evidenceIds: [
        "E13",
        "E14"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "fleet-charging-technology"
        },
        {
          kind: "initiative",
          id: "fleet-charging"
        },
        {
          kind: "phase",
          id: "near-term"
        }
      ]
    },
    {
      id: "fuels",
      title: "Lower-carbon fuels",
      description: "Assess compatible fleets, fuel supply and site readiness.",
      publicContext: "IP discloses XTL-HVO and other specific product channels.",
      evidenceIds: [
        "E06"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "road-hvo-pilot-technology"
        },
        {
          kind: "initiative",
          id: "road-hvo-pilot"
        },
        {
          kind: "phase",
          id: "medium-term"
        }
      ]
    },
    {
      id: "carriers",
      title: "Alternative energy carriers",
      description: "Assess carrier-specific demand, distribution and safety.",
      publicContext: "Public hydrogen disclosure identifies intended links in its stated scope.",
      evidenceIds: [
        "E07"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "road-hydrogen-technology"
        },
        {
          kind: "technology",
          id: "biomethane-technology"
        },
        {
          kind: "technology",
          id: "speculative-fossil-gas-technology"
        },
        {
          kind: "initiative",
          id: "road-hydrogen"
        },
        {
          kind: "initiative",
          id: "biomethane"
        },
        {
          kind: "phase",
          id: "long-term"
        }
      ]
    },
    {
      id: "stations",
      title: "Station transformation",
      description: "Compare feasible site formats and local services.",
      publicContext: "Reported network scope provides historical context.",
      evidenceIds: [
        "E08"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "station-services-technology"
        },
        {
          kind: "initiative",
          id: "station-services"
        },
        {
          kind: "kpi",
          id: "station-conversion"
        },
        {
          kind: "phase",
          id: "near-term"
        }
      ]
    },
    {
      id: "customer-service",
      title: "Customer services",
      description: "Validate discovery, eligibility, booking and service access.",
      publicContext: "Public interface descriptions provide product context.",
      evidenceIds: [
        "E09"
      ],
      affectedRecords: [
        {
          kind: "initiative",
          id: "linked-mobility"
        },
        {
          kind: "kpi",
          id: "customer-adoption"
        }
      ]
    },
    {
      id: "fleet-service",
      title: "Fleet services",
      description: "Validate compatibility, reconciliation and useful reporting.",
      publicContext: "Public fleet card scope is separate from the prototype.",
      evidenceIds: [
        "E09"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "fleet-management-technology"
        },
        {
          kind: "initiative",
          id: "linked-mobility"
        },
        {
          kind: "kpi",
          id: "fleet-adoption"
        },
        {
          kind: "phase",
          id: "medium-term"
        }
      ]
    },
    {
      id: "payments",
      title: "Payments",
      description: "Assess payment, reconciliation, accessibility and operator rights.",
      publicContext: "Existing product descriptions cover separately operated payment capabilities.",
      evidenceIds: [
        "E09"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "linked-mobility-technology"
        },
        {
          kind: "initiative",
          id: "linked-mobility"
        }
      ]
    },
    {
      id: "loyalty",
      title: "Loyalty",
      description: "Assess adoption, integration and viable customer value.",
      publicContext: "IP documents its own existing retail interfaces.",
      evidenceIds: [
        "E09"
      ],
      affectedRecords: [
        {
          kind: "technology",
          id: "linked-mobility-technology"
        },
        {
          kind: "initiative",
          id: "linked-mobility"
        }
      ]
    }
  ]
})
