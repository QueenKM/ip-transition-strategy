import { defineWorkstream } from './shared'

export const w7 = defineWorkstream({
  workstreamId: 7,
  title: "Integrated Strategy, Roadmap & Digital Decision Support",
  summary: "Connect the group evidence, strategic pillars, adaptive roadmap and proof of concept.",
  requirement: "Confirm cross-workstream assumptions, responsibility, approval roles and partner data rights before final group integration.",
  affectedRoutes: [
    "/strategy",
    "/strategy/value-chain",
    "/strategy/roadmap",
    "/strategy/governance",
    "/strategy/evidence",
    "/strategy/architecture",
    "/mobility/explore",
    "/strategy/gate"
  ],
  affectedRecords: [
    {
      kind: "pillar",
      id: "evidence-led-investment"
    },
    {
      kind: "initiative",
      id: "linked-mobility"
    },
    {
      kind: "kpi",
      id: "data-quality"
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
  ],
  unresolvedQuestions: [
    "Which partner permissions and accountable roles would a production service require?",
    "Which upstream conclusions can be linked to each decision?"
  ],
  topics: [
    {
      id: "integration",
      title: "Strategic integration and value chain",
      description: "Connect refining, distribution, customer services and feedback.",
      publicContext: "The university brief requires coherence across refining and distribution.",
      evidenceIds: ["E01"]
    },
    {
      id: "roadmap",
      title: "Integrated roadmap",
      description: "Use the proposed 0–3, 3–7 and 7–15+ year horizons and stage gates."
    },
    {
      id: "governance",
      title: "Governance and KPI framework",
      description: "Define scope, accountability and evidence review."
    },
    {
      id: "demo",
      title: "Data architecture and digital demonstration",
      description: "Show how a fictional service request could create a separate illustrative demand signal."
    },
    {
      id: "gate",
      title: "Investment decision gate",
      description: "Connect evidence checks with accountable human approval."
    }
  ],
  owner: "Workstream 7 lead",
  missingData: [
    "Final cross-workstream findings and approvals",
    "Production roles and partner data rights"
  ],
  framework: {
    lastUpdated: "2026-11-26",
    sources: [
      {
        sourceId: "lecture-2",
        locator: "Challenge scope and assessment criteria, pp. 3–6"
      }
    ]
  }
})
