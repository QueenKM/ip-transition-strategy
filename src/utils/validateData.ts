import { architectureConnections, architectureNodes } from '../data/architecture'
import { demoJourneys } from '../data/demo'
import { evidence } from '../data/evidence'
import { gates } from '../data/gates'
import { initiatives } from '../data/initiatives'
import { kpis } from '../data/kpis'
import { project } from '../data/project'
import { risks } from '../data/risks'
import { roadmap } from '../data/roadmap'
import { stationServices, stations } from '../data/services'
import { sources } from '../data/sources'
import { pillars, valueChains } from '../data/strategy'
import { teamContributions } from '../data/team'
import { technologies } from '../data/technologies'
import type { Datum, RecordMeta } from '../models/strategy'
import { recordsByKind } from './selectRecords'

export function validateData(): string[] {
  const issues: string[] = []
  const sourceIds = new Set(sources.map(({ id }) => id))
  const evidenceIds = new Set(evidence.map(({ id }) => id))
  const assumptionIds = new Set(evidence.filter(({ evidenceType }) => evidenceType === 'ASSUMPTION').map(({ id }) => id))
  const requests = teamContributions.flatMap(({ requests }) => requests)
  const requestIds = new Set(requests.map(({ id }) => id))

  function unique(label: string, records: readonly { id: string }[]) {
    if (new Set(records.map(({ id }) => id)).size !== records.length) issues.push(`${label} has duplicate identifiers.`)
  }

  function references(label: string, ids: readonly string[], known: ReadonlySet<string>) {
    for (const id of ids) {
      if (!known.has(id)) issues.push(`${label} references missing record ${id}.`)
    }
  }

  function datum(label: string, item: Datum<string | number>) {
    if (item.value === null) {
      references(label, item.inputRequestIds, requestIds)
      return
    }
    if (!item.scope.trim()) issues.push(`${label} has a value without a scope.`)
    if (item.evidenceType === 'VERIFIED FACT' && !item.evidenceIds.length) {
      issues.push(`${label} has a verified value without evidence.`)
    }
    references(label, item.evidenceIds, evidenceIds)
  }

  unique('Sources', sources)
  unique('Team requests', requests)
  for (const [kind, records] of Object.entries(recordsByKind)) unique(kind, records)

  const records: readonly RecordMeta<string>[] = [
    ...architectureConnections, ...architectureNodes, ...evidence, ...gates, ...initiatives,
    ...kpis, ...pillars, ...risks, ...roadmap, ...stations, ...stationServices,
    ...teamContributions, ...technologies,
  ]

  for (const record of records) {
    references(record.id, record.source.map(({ sourceId }) => sourceId), sourceIds)
    references(record.id, record.evidenceIds, evidenceIds)
    references(record.id, record.assumptions, assumptionIds)
    for (const dependency of record.dependencies) {
      const known = recordsByKind[dependency.kind].some(({ id }) => id === dependency.id)
      if (!known) issues.push(`${record.id} has missing ${dependency.kind} dependency ${dependency.id}.`)
    }
    if (record.evidenceType === 'VERIFIED FACT' && !record.source.length && !record.evidenceIds.length) {
      issues.push(`${record.id} has no source for its verified claim.`)
    }
  }

  const initiativeIds = new Set(initiatives.map(({ id }) => id))
  const technologyIds = new Set(technologies.map(({ id }) => id))
  const pillarIds = new Set(pillars.map(({ id }) => id))
  const kpiIds = new Set(kpis.map(({ id }) => id))
  const riskIds = new Set(risks.map(({ id }) => id))
  const gateIds = new Set(gates.map(({ id }) => id))
  const stationIds = new Set(stations.map(({ id }) => id))
  const serviceIds = new Set(stationServices.map(({ id }) => id))
  const nodeIds = new Set(architectureNodes.map(({ id }) => id))

  references('Project default initiative', [project.defaultInitiativeId], initiativeIds)
  for (const item of evidence) references(item.id, item.inputRequestIds, requestIds)
  for (const request of requests) {
    references(request.id, request.evidenceIds, evidenceIds)
    for (const ref of request.affectedRecords) {
      if (!recordsByKind[ref.kind].some(({ id }) => id === ref.id)) {
        issues.push(`${request.id} has an unavailable affected record ${ref.id}.`)
      }
    }
  }

  for (const pillar of pillars) {
    references(pillar.id, pillar.initiativeIds, initiativeIds)
    references(pillar.id, pillar.kpiIds, kpiIds)
    references(pillar.id, pillar.riskIds, riskIds)
  }
  for (const initiative of initiatives) {
    references(initiative.id, initiative.pillarIds, pillarIds)
    references(initiative.id, initiative.technologyIds, technologyIds)
    references(initiative.id, initiative.kpiIds, kpiIds)
    references(initiative.id, initiative.riskIds, riskIds)
    references(initiative.id, initiative.gateIds, gateIds)
    datum(`${initiative.id} investment intensity`, initiative.investmentIntensity)
  }
  for (const technology of technologies) {
    references(technology.id, technology.initiativeIds, initiativeIds)
    references(technology.id, technology.riskIds, riskIds)
    for (const [name, item] of Object.entries(technology.ratings)) datum(`${technology.id} ${name}`, item)
    datum(`${technology.id} industry maturity`, technology.industryMaturity)
    datum(`${technology.id} IP readiness`, technology.ipReadiness)
    datum(`${technology.id} investment intensity`, technology.investmentIntensity)
  }
  for (const phase of roadmap) {
    const actions = Object.values(phase.actions).flat()
    references(phase.id, [...actions.map(({ initiativeId }) => initiativeId), ...phase.pilotIds], initiativeIds)
    references(phase.id, phase.gateIds, gateIds)
    references(phase.id, phase.kpiIds, kpiIds)
  }
  for (const chain of valueChains) {
    for (const step of chain.steps) {
      if ('initiativeId' in step && step.initiativeId) references(chain.id, [step.initiativeId], initiativeIds)
    }
  }
  for (const kpi of kpis) {
    datum(`${kpi.id} current`, kpi.current)
    datum(`${kpi.id} baseline`, kpi.baseline)
    datum(`${kpi.id} target`, kpi.target)
  }
  for (const gate of gates) {
    references(gate.id, [gate.initiativeId], initiativeIds)
    references(gate.id, gate.riskIds, riskIds)
    unique(`${gate.id} checks`, gate.checks)
    datum(`${gate.id} approval`, gate.approval)
    for (const check of gate.checks) datum(`${gate.id} ${check.id}`, check.finding)
  }
  for (const risk of risks) {
    references(risk.id, risk.initiativeIds, initiativeIds)
    datum(`${risk.id} likelihood`, risk.likelihood)
    datum(`${risk.id} impact`, risk.impact)
  }
  for (const service of stationServices) {
    references(service.id, [service.stationId], stationIds)
    references(service.id, [service.initiativeId], initiativeIds)
    datum(`${service.id} price basis`, service.priceBasis)
    if (service.chargerPowerKw) datum(`${service.id} power`, service.chargerPowerKw)
  }
  for (const journey of demoJourneys) references('Demo journey', [journey.serviceId], serviceIds)
  for (const connection of architectureConnections) {
    references(connection.id, [connection.fromNodeId, connection.toNodeId], nodeIds)
    if (connection.status === 'Existing' && connection.evidenceType !== 'VERIFIED FACT') {
      issues.push(`${connection.id} needs verified evidence for an existing interface.`)
    }
  }

  if (teamContributions.length !== 8 || new Set(teamContributions.map(({ workstream }) => workstream)).size !== 8) {
    issues.push('The Team Input Register must contain all eight distinct workstreams.')
  }

  for (const team of teamContributions) {
    unique(`${team.id} topics`, team.topics)
    unique(`${team.id} metrics`, team.metrics)
    if (team.validated && (!team.inputReceived || !team.dateReceived || !team.lastValidated || !team.lastUpdated || !team.sources.length)) {
      issues.push(`${team.id} needs a dated, sourced submission before validation.`)
    }
    if (team.dateReceived && team.lastValidated && team.lastValidated < team.dateReceived) {
      issues.push(`${team.id} validation predates receipt.`)
    }
    references(`${team.id} team sources`, team.sources.map(({ sourceId }) => sourceId), sourceIds)
    references(team.id, team.affectedInitiatives, initiativeIds)
    references(team.id, team.affectedTechnologies, technologyIds)
    references(team.id, team.affectedKPIs, kpiIds)
    references(team.id, team.affectedRoadmapPhases, new Set(roadmap.map(({ id }) => id)))
    for (const topic of team.topics) {
      const label = `${team.id} ${topic.id}`
      references(label, topic.evidenceIds, evidenceIds)
      references(label, topic.findingEvidenceIds, evidenceIds)
      references(label, topic.inputRequestIds, requestIds)
      const delivered = Boolean(topic.finding || topic.priority || topic.timing || topic.rationale)
      if (delivered && !team.inputReceived) issues.push(`${label} has a finding without a submitted contribution.`)
      if (delivered && team.validated && !topic.findingEvidenceIds.length) {
        issues.push(`${label} needs evidence references for its validated finding.`)
      }
    }
    for (const metric of team.metrics) {
      datum(`${team.id} ${metric.id}`, metric.value)
      if (metric.value.value !== null && !team.inputReceived) issues.push(`${team.id} has a metric without a submitted contribution.`)
    }
  }

  return issues
}
