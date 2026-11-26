export const routes = {
  home: '/',
  workstreams: '/workstreams',
  strategy: '/strategy',
  valueChain: '/strategy/value-chain',
  portfolio: '/strategy/portfolio',
  roadmap: '/strategy/roadmap',
  evidence: '/strategy/evidence',
  gate: '/strategy/gate',
  architecture: '/strategy/architecture',
  governance: '/strategy/governance',
  explore: '/mobility/explore',
  journey: '/mobility/journey',
  about: '/about',
} as const

export function workstreamPath(workstream: number) {
  return `${routes.workstreams}/w${workstream}`
}
