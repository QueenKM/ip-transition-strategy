import { routes } from '../app/routes'
import { architectureConnections, architectureNodes } from '../data/architecture'
import { evidence } from '../data/evidence'
import { gates } from '../data/gates'
import { initiatives } from '../data/initiatives'
import { kpis } from '../data/kpis'
import { risks } from '../data/risks'
import { roadmap } from '../data/roadmap'
import { stations, stationServices } from '../data/services'
import { pillars } from '../data/strategy'
import { teamContributions } from '../data/team'
import { technologies } from '../data/technologies'
import type { EntityKind, EntityRef } from '../models/strategy'

interface NamedRecord {
  id: string
  title: string
}

export const recordsByKind: Readonly<Record<EntityKind, readonly NamedRecord[]>> = {
  pillar: pillars,
  initiative: initiatives,
  technology: technologies,
  phase: roadmap,
  station: stations,
  service: stationServices,
  kpi: kpis,
  evidence,
  gate: gates,
  risk: risks,
  team: teamContributions,
  architecture: [...architectureNodes, ...architectureConnections],
}

export function describeEntity(ref: EntityRef): { title: string; href?: string } {
  const record = recordsByKind[ref.kind].find(({ id }) => id === ref.id)
  if (!record) return { title: 'No data' }

  const gate = ref.kind === 'gate' ? gates.find(({ id }) => id === ref.id) : undefined
  const riskInitiative = ref.kind === 'risk' ? risks.find(({ id }) => id === ref.id)?.initiativeIds[0] : undefined

  const links: Partial<Record<EntityKind, string>> = {
    pillar: routes.strategy,
    initiative: `${routes.gate}?initiative=${encodeURIComponent(ref.id)}`,
    technology: routes.portfolio,
    phase: routes.roadmap,
    station: routes.explore,
    service: `${routes.journey}?service=${encodeURIComponent(ref.id)}`,
    kpi: `${routes.evidence}?focus=${encodeURIComponent(ref.id)}`,
    evidence: `${routes.evidence}?tab=evidence&focus=${encodeURIComponent(ref.id)}`,
    gate: gate && `${routes.gate}?initiative=${encodeURIComponent(gate.initiativeId)}&stage=${gate.stage.toLowerCase()}`,
    risk: riskInitiative && `${routes.gate}?initiative=${encodeURIComponent(riskInitiative)}`,
    team: `${routes.evidence}?tab=team-inputs&focus=${encodeURIComponent(ref.id)}`,
    architecture: routes.architecture,
  }

  return { title: record.title, href: links[ref.kind] }
}
