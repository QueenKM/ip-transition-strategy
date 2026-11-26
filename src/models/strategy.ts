export type Id = string
export type DateStamp = string
export type WorkstreamId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type Horizon = '0–3 years' | '3–7 years' | '7–15+ years'
export type Rating = 'Low' | 'Medium' | 'High'

export type EvidenceType =
  | 'VERIFIED FACT'
  | 'TEAM INPUT'
  | 'STRATEGIC RECOMMENDATION'
  | 'ASSUMPTION'
  | 'ILLUSTRATIVE OR MODELLED VALUE'
  | 'NO DATA'

export type ServiceStatus = 'Available' | 'Pilot' | 'Planned' | 'Under assessment' | 'No data'
export type GateRecommendation = 'Scale' | 'Pilot' | 'Monitor' | 'Defer' | 'Insufficient evidence'

export type EntityKind =
  | 'pillar' | 'initiative' | 'technology' | 'phase' | 'station' | 'service'
  | 'kpi' | 'evidence' | 'gate' | 'risk' | 'team' | 'architecture'

export interface EntityRef {
  kind: EntityKind
  id: Id
}

export interface SourceDocument {
  id: Id
  title: string
  publisher: string
  kind: 'Lecture' | 'Law or regulator' | 'Company disclosure'
    | 'Market or technical reference' | 'Team submission' | 'Academic brief'
  url: string | null
  fileName: string | null
  publishedOn: DateStamp | null
  effectiveOn: DateStamp | null
  checkedOn: DateStamp | null
}

export interface SourceRef {
  sourceId: Id
  locator: string | null
}

export interface RecordMeta<S extends string> {
  id: Id
  title: string
  description: string
  status: S
  evidenceType: EvidenceType
  source: readonly SourceRef[]
  evidenceIds: readonly Id[]
  owner: string | null
  timeHorizon: Horizon | null
  dependencies: readonly EntityRef[]
  assumptions: readonly Id[]
  lastUpdated: DateStamp | null
}

export type Datum<T> =
  | {
      value: T
      evidenceType: Exclude<EvidenceType, 'NO DATA'>
      evidenceIds: readonly Id[]
      scope: string
      period: string | null
      lastUpdated: DateStamp | null
    }
  | {
      value: null
      evidenceType: 'NO DATA'
      inputRequestIds: readonly Id[]
    }

export interface EvidenceItem extends RecordMeta<'Available' | 'Pending' | 'Superseded'> {
  scope: string
  reportingPeriod: string | null
  caveat: string | null
  inputRequestIds: readonly Id[]
  impactOfGap: string | null
}

export interface StrategicPillar extends RecordMeta<'Proposed' | 'Adopted for the case'> {
  objective: string
  refiningContribution: string
  distributionContribution: string
  digitalContribution: string
  customerSegments: readonly string[]
  businessRationale: string
  initiativeIds: readonly Id[]
  kpiIds: readonly Id[]
  riskIds: readonly Id[]
}

export interface Initiative extends RecordMeta<'Proposed' | 'Under assessment' | 'Deferred' | 'Excluded'> {
  pillarIds: readonly Id[]
  technologyIds: readonly Id[]
  demandDriver: string
  assetFit: string
  businessRationale: string
  integration: string
  investmentIntensity: Datum<Rating>
  riskIds: readonly Id[]
  kpiIds: readonly Id[]
  gateIds: readonly Id[]
}

export type PortfolioPriority = 'Start now' | 'Pilot' | 'Monitor' | 'Defer' | 'Exclude'
export type AssessmentDimension =
  | 'strategicFit' | 'demandVisibility' | 'infrastructureDependency'
  | 'regulatorySupport' | 'existingAssetUse' | 'integration' | 'implementationRisk'

export interface TechnologyOption extends RecordMeta<PortfolioPriority> {
  industryMaturity: Datum<string>
  ipReadiness: Datum<string>
  investmentIntensity: Datum<Rating>
  ratings: Partial<Record<AssessmentDimension, Datum<Rating>>>
  rationale: string
  initiativeIds: readonly Id[]
  riskIds: readonly Id[]
}

export interface RoadmapPhase extends RecordMeta<'Proposed horizon'> {
  timeHorizon: Horizon
  objective: string
  actions: Readonly<Record<
    'refining' | 'distribution' | 'digital',
    readonly { initiativeId: Id; action: string }[]
  >>
  pilotIds: readonly Id[]
  scaleConditions: readonly string[]
  gateIds: readonly Id[]
  kpiIds: readonly Id[]
  reviewTriggers: readonly string[]
}

export type EnergyCarrier = 'Liquid fuel' | 'Electricity' | 'Hydrogen' | 'Biomethane'

export interface StationArchetype extends RecordMeta<'Fictional archetype'> {
  evidenceType: 'ILLUSTRATIVE OR MODELLED VALUE'
  archetype: string
}

export interface StationService extends RecordMeta<ServiceStatus> {
  evidenceType: 'ILLUSTRATIVE OR MODELLED VALUE'
  stationId: Id
  initiativeId: Id
  carrier: EnergyCarrier
  audience: 'Driver' | 'Fleet' | 'Both'
  compatibility: string
  journeyMode: 'Request' | 'Reservation' | 'Explore only'
  priceBasis: Datum<string>
  chargerPowerKw: Datum<number> | null
}

export interface KPI extends RecordMeta<'Proposed definition' | 'Historical reference'> {
  definition: string
  unit: string
  boundary: string
  expectedDataSource: string
  frequency: string
  current: Datum<number>
  baseline: Datum<number>
  target: Datum<number>
}

export type GateStage = 'Watch' | 'Pilot' | 'Scale'
export type GateCheckId =
  | 'strategicFit' | 'technologyMaturity' | 'demandReadiness'
  | 'regulatoryReadiness' | 'infrastructureReadiness'
  | 'investmentIntensity' | 'economics' | 'operatingPerformance'

export interface GateCheck {
  id: GateCheckId
  title: string
  required: boolean
  blockingIfUnmet: boolean
  finding: Datum<'Met' | 'Unmet' | 'Not applicable'>
  rationale: string
  nextAction: string
  owner: string
}

export interface DecisionGate extends RecordMeta<'Proposed decision rule'> {
  initiativeId: Id
  stage: GateStage
  checks: readonly GateCheck[]
  riskIds: readonly Id[]
  reviewTrigger: string
  approvalRole: string
  approval: Datum<'Under review' | 'Approved' | 'Rejected'>
}

export interface DecisionResult {
  recommendation: GateRecommendation
  reason: string
  decisiveCheckIds: readonly GateCheckId[]
  nextAction: string
}

export interface Risk extends RecordMeta<'Open' | 'Under review' | 'Closed'> {
  initiativeIds: readonly Id[]
  trigger: string
  consequence: string
  mitigation: string
  likelihood: Datum<Rating>
  impact: Datum<Rating>
}

export interface TeamInputRequest {
  id: Id
  label: string
  requirement: string
  affectedRecords: readonly EntityRef[]
  evidenceIds: readonly Id[]
  status: 'Missing' | 'Received' | 'Validated'
}

export interface TeamContribution extends RecordMeta<'Awaiting submission' | 'Received' | 'Reviewed'> {
  workstream: WorkstreamId
  inputReceived: boolean
  dateReceived: DateStamp | null
  affectedRoutes: readonly string[]
  unresolvedQuestions: readonly string[]
  requests: readonly TeamInputRequest[]
}

export interface ArchitectureNode extends RecordMeta<'Documented' | 'Required' | 'Future'> {
  kind: 'Refining' | 'Station' | 'Charging' | 'Customer' | 'Fleet' | 'Analytics' | 'Management'
}

export interface ArchitectureConnection extends RecordMeta<'Existing' | 'Required' | 'Future'> {
  fromNodeId: Id
  toNodeId: Id
  dataExchanged: string
}

export interface DemoEvent {
  id: Id
  evidenceType: 'ILLUSTRATIVE OR MODELLED VALUE'
  initiativeId: Id
  stationServiceId: Id
  action: 'Fleet request simulated' | 'Reservation simulated' | 'Payment simulated'
  createdAt: string
}
