import { defineWorkstream } from './shared'

export const w2 = defineWorkstream({
  workstreamId: 2,
  title: "Refining Current State & Benchmarking",
  summary: "Establish the operating perimeter and comparable refinery baselines.",
  requirement: "Confirm refinery configuration, capacity, site boundaries and comparable energy and emissions baselines.",
  affectedRoutes: [
    "/strategy/value-chain",
    "/strategy/portfolio",
    "/strategy/evidence"
  ],
  affectedRecords: [],
  unresolvedQuestions: [
    "Which site data share a consistent refinery boundary?",
    "Which assets and constraints can be used in the case?"
  ],
  topics: [
    {
      id: "assets",
      title: "Supported asset boundaries",
      description: "Confirm the assets, contracts and site rights in scope.",
      publicContext: "The company’s disclosed refining and logistics perimeter is a starting reference.",
      evidenceIds: [
        "E05"
      ]
    },
    {
      id: "capacity",
      title: "Capacity",
      description: "Supply dated unit- or site-level throughput, capacity and boundaries."
    },
    {
      id: "energy",
      title: "Energy baseline",
      description: "Validate the metered refinery baseline and denominator.",
      publicContext: "The historical group figure uses products sold including trading.",
      evidenceIds: [
        "E10"
      ],
      affectedRecords: [
        {
          kind: "kpi",
          id: "energy-intensity"
        }
      ]
    },
    {
      id: "emissions",
      title: "Emissions baseline",
      description: "Provide the relevant site and scopes with consistent boundaries.",
      publicContext: "Historical group emissions are disclosed within their reported scope.",
      evidenceIds: [
        "E10"
      ],
      affectedRecords: [
        {
          kind: "kpi",
          id: "operational-emissions-scope1"
        },
        {
          kind: "kpi",
          id: "operational-emissions-scope2"
        }
      ]
    },
    {
      id: "benchmark",
      title: "Benchmark",
      description: "Provide comparable peer measures and boundaries."
    },
    {
      id: "constraints",
      title: "Constraints",
      description: "Document operating, maintenance, utility and contractual limits."
    },
    {
      id: "gaps",
      title: "Gaps",
      description: "Prioritise remaining data and capability gaps."
    }
  ]
})
