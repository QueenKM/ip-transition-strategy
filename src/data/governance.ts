import type { WorkstreamId } from '../models/strategy'

export const governanceRoles: readonly { role: string; responsibility: string; workstreams: readonly WorkstreamId[] }[] = [
  { role: 'Strategy sponsor', responsibility: 'Own the common investment priorities, cross-workstream dependencies and review thresholds.', workstreams: [6, 7, 8] },
  { role: 'Refining owner', responsibility: 'Validate asset scope, site baselines, process changes and eligible product supply.', workstreams: [2, 3] },
  { role: 'Distribution owner', responsibility: 'Validate site rights, fleet demand, service viability and operating data.', workstreams: [4, 5] },
  { role: 'Digital product owner', responsibility: 'Test customer journeys and document service, reconciliation and support requirements.', workstreams: [5, 7] },
  { role: 'Data owner', responsibility: 'Maintain data definitions, quality thresholds, provenance and access permissions.', workstreams: [2, 4, 7] },
  { role: 'Sustainability and compliance', responsibility: 'Review regulatory applicability, reporting boundaries and customer claims.', workstreams: [1, 3, 5] },
  { role: 'Investment committee', responsibility: 'Approve, defer or stop capital commitments after operating, compliance and finance review.', workstreams: [6, 7] },
]

export const governanceCycle = [
  { title: 'Define the case', description: 'Confirm the scope, evidence owner and required decision stage.' },
  { title: 'Review evidence', description: 'Review KPIs in the proposed quarterly cycle and at each pilot or scale decision.' },
  { title: 'Decide and record', description: 'Record the human decision, its rationale, ownership and follow-up conditions.' },
] as const
