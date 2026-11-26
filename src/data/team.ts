import type { EntityRef, TeamContribution, WorkstreamId } from '../models/strategy'

interface PendingContribution {
  workstream: WorkstreamId
  title: string
  requirement: string
  affectedRoutes: readonly string[]
  affectedRecords: readonly EntityRef[]
  evidenceIds: readonly string[]
  unresolvedQuestions: readonly string[]
  owner?: string
}

const pendingContributions: readonly PendingContribution[] = [
  {
    workstream: 1,
    title: 'Regulation and Market Context',
    requirement: 'Provide the regulatory applicability matrix, demand scenarios and competitor comparisons. Distinguish binding obligations from proposals and market forecasts.',
    affectedRoutes: ['/strategy', '/strategy/portfolio', '/strategy/gate'],
    affectedRecords: [
      { kind: 'evidence', id: 'E02' },
      { kind: 'evidence', id: 'E03' },
      { kind: 'evidence', id: 'E04' },
    ],
    evidenceIds: ['E02', 'E03', 'E04'],
    unresolvedQuestions: [
      'Which compliance duties apply to each product, operator and site?',
      'How do demand and competition vary by customer segment and catchment?',
    ],
  },
  {
    workstream: 2,
    title: 'Refining Context and Benchmarking',
    requirement: 'Confirm the case perimeter, refinery process configuration, assets, site boundaries and comparable energy and emissions baselines. Provide the separate IP presentation if available.',
    affectedRoutes: ['/strategy/value-chain', '/strategy/portfolio', '/strategy/evidence'],
    affectedRecords: [
      { kind: 'evidence', id: 'E05' },
      { kind: 'evidence', id: 'E10' },
      { kind: 'kpi', id: 'energy-intensity' },
    ],
    evidenceIds: ['E05', 'E10'],
    unresolvedQuestions: [
      'What throughput, energy and emissions data share a consistent refinery boundary?',
      'Which assets, operating constraints and contractual interfaces can be used?',
    ],
  },
  {
    workstream: 3,
    title: 'Refining Solutions and Roadmap',
    requirement: 'Provide the shortlisted efficiency, electrification and fuel transformation measures, with feasibility, certification dependencies, production options and decision milestones.',
    affectedRoutes: ['/strategy/value-chain', '/strategy/portfolio', '/strategy/roadmap', '/strategy/gate'],
    affectedRecords: [
      { kind: 'initiative', id: 'refinery-efficiency' },
      { kind: 'initiative', id: 'feedstock-coprocessing' },
      { kind: 'initiative', id: 'refinery-hydrogen' },
    ],
    evidenceIds: ['E05', 'E06', 'E07', 'E10'],
    unresolvedQuestions: [
      'Which site measures can proceed within planned outages and acceptable process risk?',
      'What quality, certification and volume can each approved fuel route deliver?',
    ],
  },
  {
    workstream: 4,
    title: 'Distribution Context and Benchmarking',
    requirement: 'Provide station and competitor benchmarks by site archetype, charging and fuel service perimeter, local operator rights and comparable utilisation and availability baselines.',
    affectedRoutes: ['/strategy/portfolio', '/strategy/evidence', '/mobility/explore'],
    affectedRecords: [
      { kind: 'evidence', id: 'E04' },
      { kind: 'evidence', id: 'E08' },
      { kind: 'kpi', id: 'charger-utilisation' },
    ],
    evidenceIds: ['E04', 'E08', 'E09'],
    unresolvedQuestions: [
      'Which site types have sufficient site control, local demand and connection capacity?',
      'Which services are active and how is utilisation measured?',
    ],
  },
  {
    workstream: 5,
    title: 'Distribution Solutions and Roadmap',
    requirement: 'Provide selected station, depot and fleet pilots and their geography, commercial model, grid or refuelling dependencies, service design and scale conditions.',
    affectedRoutes: ['/mobility/explore', '/mobility/journey', '/strategy/roadmap', '/strategy/gate'],
    affectedRecords: [
      { kind: 'initiative', id: 'road-hvo-pilot' },
      { kind: 'initiative', id: 'public-charging' },
      { kind: 'initiative', id: 'fleet-charging' },
    ],
    evidenceIds: ['E06', 'E07', 'E08', 'E09'],
    unresolvedQuestions: [
      'Which sites and fleets can supply measurable demand and usable pilot data?',
      'How are service ownership, commissioning, compatibility and partner access governed?',
    ],
  },
  {
    workstream: 6,
    title: 'Economics, Technology Maturity and Risks',
    requirement: 'Provide investment and operating cost ranges, price and uptake sensitivity, readiness criteria, risk owners and methods for comparing pilot and scale decisions.',
    affectedRoutes: ['/strategy/portfolio', '/strategy/roadmap', '/strategy/evidence', '/strategy/gate'],
    affectedRecords: [
      { kind: 'kpi', id: 'financial-sustainability' },
      { kind: 'initiative', id: 'road-hvo-pilot' },
      { kind: 'initiative', id: 'public-charging' },
    ],
    evidenceIds: ['E10', 'E13', 'E14'],
    unresolvedQuestions: [
      'What unit economics and downside tests apply by product and site?',
      'What evidence and approval roles should release pilot or scale investment?',
    ],
  },
  {
    workstream: 7,
    title: 'Integrated Strategy, Platform and Roadmap',
    owner: 'Part 7 workstream lead',
    requirement: 'Confirm cross-workstream assumptions, operating responsibilities and any partner data rights for a production pilot. The academic draft is available for group review.',
    affectedRoutes: ['/strategy', '/strategy/value-chain', '/strategy/roadmap', '/strategy/architecture', '/strategy/evidence?tab=team-inputs'],
    affectedRecords: [
      { kind: 'pillar', id: 'evidence-led-investment' },
      { kind: 'kpi', id: 'data-quality' },
      { kind: 'initiative', id: 'linked-mobility' },
    ],
    evidenceIds: ['E01', 'E09', 'fictional-scenario'],
    unresolvedQuestions: [
      'Which roles can approve pilots and resolve data-quality exceptions?',
      'Which partner systems and permissions would a production service need?',
    ],
  },
  {
    workstream: 8,
    title: 'Executive Summary and Final Presentation',
    requirement: 'Provide the final group thesis, executive-summary allocation, slide style, speaker timing and assigned presentation slot.',
    affectedRoutes: ['/strategy', '/strategy/value-chain', '/strategy/roadmap', '/about'],
    affectedRecords: [{ kind: 'evidence', id: 'E01' }],
    evidenceIds: ['E01'],
    unresolvedQuestions: [
      'How much presentation time and executive-summary space is assigned to Part 7?',
      'Which claims, screenshots and demonstration sequence does the group approve?',
    ],
  },
]

export const teamContributions: readonly TeamContribution[] = pendingContributions.map((entry) => ({
  id: `workstream-${entry.workstream}`,
  title: entry.title,
  description: entry.requirement,
  status: 'Awaiting submission',
  evidenceType: 'NO DATA',
  source: [],
  evidenceIds: entry.evidenceIds,
  owner: entry.owner ?? 'Owner to be confirmed',
  timeHorizon: null,
  dependencies: [],
  assumptions: [],
  lastUpdated: null,
  workstream: entry.workstream,
  inputReceived: false,
  dateReceived: null,
  affectedRoutes: entry.affectedRoutes,
  unresolvedQuestions: entry.unresolvedQuestions,
  requests: [
    {
      id: `ws${entry.workstream}-input`,
      label: `[INPUT REQUIRED FROM WORKSTREAM ${entry.workstream}]`,
      requirement: entry.requirement,
      affectedRecords: entry.affectedRecords,
      evidenceIds: entry.evidenceIds,
      status: 'Missing',
    },
  ],
}))
