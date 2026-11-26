import type { DecisionGate, DecisionResult, GateCheck } from '../models/strategy'

function caseFinding(check: GateCheck, stage: DecisionGate['stage']): GateCheck['finding']['value'] {
  const { finding } = check
  if (finding.evidenceType !== 'VERIFIED FACT' && finding.evidenceType !== 'TEAM INPUT') return null
  if (finding.evidenceIds.length === 0 || finding.scope.trim() === '') return null
  if (stage === 'Scale' && check.id === 'operatingPerformance' && finding.value === 'Met'
    && finding.evidenceType !== 'VERIFIED FACT') return null
  return finding.value
}

export function evaluateGate(gate: DecisionGate): DecisionResult {
  const blocked = gate.checks.filter((check) => check.blockingIfUnmet && caseFinding(check, gate.stage) === 'Unmet')
  if (blocked.length > 0) {
    return {
      recommendation: 'Defer',
      reason: 'A documented blocking requirement is unmet for this stage.',
      decisiveCheckIds: blocked.map((check) => check.id),
      nextAction: blocked[0].nextAction,
    }
  }

  const required = gate.checks.filter((check) => check.required)
  const missing = required.filter((check) => caseFinding(check, gate.stage) === null)
  if (missing.length > 0 || (gate.stage !== 'Watch' && required.length === 0)) {
    return {
      recommendation: 'Insufficient evidence',
      reason: 'At least one decision-critical check lacks case evidence for this stage.',
      decisiveCheckIds: missing.map((check) => check.id),
      nextAction: missing[0]?.nextAction ?? 'Define the required case evidence before bringing the stage to review.',
    }
  }

  const unmet = required.filter((check) => caseFinding(check, gate.stage) === 'Unmet')
  if (gate.stage === 'Watch' || unmet.length > 0) {
    return {
      recommendation: 'Monitor',
      reason: unmet.length > 0
        ? 'A requirement needs further work before this stage can advance.'
        : 'The proposed scope is for monitoring and review of defined triggers.',
      decisiveCheckIds: unmet.map((check) => check.id),
      nextAction: unmet[0]?.nextAction ?? gate.reviewTrigger,
    }
  }

  const isScale = gate.stage === 'Scale'
  return {
    recommendation: isScale ? 'Scale' : 'Pilot',
    reason: isScale
      ? 'The required evidence supports human review of a scale decision.'
      : 'The required evidence supports human review of a bounded pilot.',
    decisiveCheckIds: required.map((check) => check.id),
    nextAction: isScale
      ? 'Submit the scope, validated performance and downside case to the approving roles.'
      : 'Submit the test scope, budget, owner and exit criteria to the approving roles.',
  }
}
