import { defineWorkstream } from './shared'

export const w4 = defineWorkstream({
  workstreamId: 4,
  title: "Distribution Current State & Benchmarking",
  summary: "Establish the network perimeter, customer requirements and local site readiness.",
  requirement: "Provide site typologies, local comparisons, operating rights and comparable availability and utilisation metrics.",
  affectedRoutes: [
    "/strategy/portfolio",
    "/strategy/evidence",
    "/mobility/explore"
  ],
  affectedRecords: [],
  unresolvedQuestions: [
    "Which sites have sufficient rights, demand and connection capacity?",
    "Which services are active and how is availability defined?"
  ],
  topics: [
    {
      id: "network",
      title: "Network findings",
      description: "Confirm the applicable network, ownership and service boundary.",
      publicContext: "IP’s network and charging disclosure has a specific reporting perimeter.",
      evidenceIds: [
        "E08"
      ]
    },
    {
      id: "archetypes",
      title: "Station archetypes",
      description: "Define site archetypes from supported demand and service patterns."
    },
    {
      id: "competition",
      title: "Competition",
      description: "Compare local supply, service coverage and competing sites.",
      publicContext: "Market and competitor context includes public offers and local catchment definitions.",
      evidenceIds: [
        "E04"
      ]
    },
    {
      id: "customers",
      title: "Customer segments",
      description: "Validate driver and fleet requirements, demand and compatibility.",
      publicContext: "Existing public interfaces describe the services in their respective scopes.",
      evidenceIds: [
        "E09"
      ]
    },
    {
      id: "grid",
      title: "Grid constraints",
      description: "Obtain site-specific grid headroom, tariffs and connection terms.",
      publicContext: "Lecture context distinguishes grid constraints from national capacity.",
      evidenceIds: [
        "E13"
      ],
      affectedRecords: [
        {
          kind: "kpi",
          id: "charger-utilisation"
        }
      ]
    },
    {
      id: "sites",
      title: "Site constraints",
      description: "Confirm property, permissions, staffing, assets and operator rights."
    },
    {
      id: "benchmarks",
      title: "Benchmarks",
      description: "Set like-for-like comparison boundaries for utilisation, availability and uptake.",
      publicContext: "Published charging counts describe the network footprint.",
      evidenceIds: [
        "E08",
        "E10"
      ],
      affectedRecords: [
        {
          kind: "kpi",
          id: "service-availability"
        },
        {
          kind: "kpi",
          id: "station-conversion"
        }
      ]
    }
  ]
})
