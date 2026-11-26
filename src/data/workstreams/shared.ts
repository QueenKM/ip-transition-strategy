import type {
  DateStamp, EntityRef, SourceRef, TeamContribution, WorkstreamId, WorkstreamMetric, WorkstreamTopic,
} from '../../models/strategy'

type TopicSeed = Pick<WorkstreamTopic, 'id' | 'title' | 'description'>
  & Partial<Omit<WorkstreamTopic, 'id' | 'title' | 'description' | 'inputRequestIds'>>

interface WorkstreamSubmission {
  summary: string
  dateReceived: DateStamp
  lastUpdated: DateStamp
  lastValidated: DateStamp | null
  sources: readonly SourceRef[]
  evidenceIds: readonly string[]
  keyFindings: readonly string[]
  recommendations: readonly string[]
}

interface WorkstreamSeed {
  workstreamId: WorkstreamId
  title: string
  owner?: string
  summary: string
  requirement: string
  affectedRoutes: readonly string[]
  affectedRecords?: readonly EntityRef[]
  assumptions?: readonly string[]
  missingData?: readonly string[]
  unresolvedQuestions: readonly string[]
  topics: readonly TopicSeed[]
  metrics?: readonly WorkstreamMetric[]
  submission?: WorkstreamSubmission
  framework?: { lastUpdated: DateStamp; sources: readonly SourceRef[] }
}

export function defineWorkstream(seed: WorkstreamSeed): TeamContribution {
  const { workstreamId, title, owner, framework, submission } = seed
  const requestId = `ws${workstreamId}-input`
  const inputReceived = submission !== undefined
  const lastValidated = submission?.lastValidated ?? null
  const validated = lastValidated !== null

  const topics: readonly WorkstreamTopic[] = seed.topics.map((topic) => ({
    publicContext: null,
    evidenceIds: [],
    findingEvidenceIds: [],
    finding: null,
    priority: null,
    timing: null,
    rationale: null,
    affectedRecords: [],
    ...topic,
    inputRequestIds: [requestId],
  }))
  const affectedRecords = [...new Map(
    [...(seed.affectedRecords ?? []), ...topics.flatMap((topic) => topic.affectedRecords)].map(
      (record) => [`${record.kind}:${record.id}`, record] as const,
    ),
  ).values()]
  const affectedIds = (kind: EntityRef['kind']) => affectedRecords.filter((record) => record.kind === kind).map((record) => record.id)
  const evidenceIds = [...new Set([...topics.flatMap((topic) => topic.evidenceIds), ...(submission?.evidenceIds ?? [])])]
  const metrics = seed.metrics ?? []

  return {
    id: `workstream-${workstreamId}`,
    workstream: workstreamId,
    workstreamId,
    title,
    description: seed.requirement,
    summary: validated ? submission?.summary ?? seed.summary : seed.summary,
    status: validated ? 'Reviewed' : inputReceived ? 'Received' : framework ? 'In development' : 'Awaiting submission',
    evidenceType: inputReceived ? 'TEAM INPUT' : framework ? 'STRATEGIC RECOMMENDATION' : 'NO DATA',
    source: [...(framework?.sources ?? []), ...(submission?.sources ?? [])],
    sources: submission?.sources ?? [],
    evidenceIds,
    owner: owner ?? 'Owner to be confirmed',
    timeHorizon: null,
    dependencies: [],
    assumptions: seed.assumptions ?? [],
    lastUpdated: submission?.lastUpdated ?? framework?.lastUpdated ?? null,
    inputReceived,
    dateReceived: submission?.dateReceived ?? null,
    validated,
    lastValidated,
    frameworkAvailable: framework !== undefined,
    keyFindings: submission?.keyFindings ?? [],
    recommendations: submission?.recommendations ?? [],
    missingData: seed.missingData ?? [
      ...topics.filter((topic) => !validated || topic.finding === null).map((topic) => topic.title),
      ...metrics.filter((metric) => !validated || metric.value.value === null).map((metric) => metric.title),
    ],
    affectedInitiatives: affectedIds('initiative'),
    affectedTechnologies: affectedIds('technology'),
    affectedKPIs: affectedIds('kpi'),
    affectedRoadmapPhases: affectedIds('phase'),
    affectedRoutes: seed.affectedRoutes,
    unresolvedQuestions: seed.unresolvedQuestions,
    requests: [{
      id: requestId,
      label: `[INPUT REQUIRED FROM WORKSTREAM ${workstreamId}]`,
      requirement: seed.requirement,
      affectedRecords,
      evidenceIds,
      status: validated ? 'Validated' : inputReceived ? 'Received' : 'Missing',
    }],
    topics,
    metrics,
  }
}
