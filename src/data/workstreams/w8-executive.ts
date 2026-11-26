import { defineWorkstream } from './shared'

export const w8 = defineWorkstream({
  workstreamId: 8,
  title: "Executive Summary & Presentation",
  summary: "Reconcile approved findings and give the group a shared presentation narrative.",
  requirement: "Provide the group-approved strategic recommendation, summary, storyline, timing and presentation allocation.",
  affectedRoutes: [
    "/",
    "/strategy",
    "/strategy/value-chain",
    "/strategy/roadmap",
    "/about"
  ],
  affectedRecords: [],
  unresolvedQuestions: [
    "What wording and demonstration sequence does the group approve?",
    "How is presentation time allocated?"
  ],
  topics: [
    {
      id: "recommendation",
      title: "Final strategic recommendation",
      description: "Approve the consolidated group recommendation."
    },
    {
      id: "summary",
      title: "Executive summary",
      description: "Supply the group-approved one-page summary.",
      publicContext: "The challenge brief defines the expected deliverables.",
      evidenceIds: [
        "E01"
      ]
    },
    {
      id: "storyline",
      title: "Group-approved storyline",
      description: "Confirm the storyline and supporting evidence."
    },
    {
      id: "allocation",
      title: "Presentation allocation",
      description: "Confirm timing, owners and section boundaries."
    },
    {
      id: "terminology",
      title: "Final terminology",
      description: "Verify definitions and terminology across sections."
    },
    {
      id: "conclusion",
      title: "Final conclusion",
      description: "Approve the final wording and explicit uncertainties."
    }
  ]
})
