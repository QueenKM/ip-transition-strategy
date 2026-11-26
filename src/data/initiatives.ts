import type { Horizon, Initiative, Rating } from '../models/strategy'

const initiativeSpecs = [
  {
    id: 'refinery-efficiency',
    title: 'Refinery energy efficiency',
    description: 'Prioritise metering, operating optimisation and heat recovery at eligible refinery units.',
    link: 'Verify savings against refinery throughput and operating conditions. Feed the resulting energy-cost and carbon evidence into fuel sourcing and product-mix decisions for distribution.',
    assets: 'Falconara and Trecate are screening candidates. Unit metering and retrofit opportunities require confirmation.',
    driver: 'Energy and carbon-cost exposure under the EU ETS, together with asset reliability.',
    decision: 'Advance individually when the site baseline, measurement plan, safety review and investment case are verified.',
    owner: 'Refining operations',
    evidenceIds: ['E03', 'E05', 'E10', 'E12'],
    teamIds: ['ws2-input', 'ws3-input', 'ws6-input'],
    riskIds: ['baseline-boundary', 'process-integration'],
    kpiIds: ['energy-intensity', 'operational-emissions-scope1'],
  },
  {
    id: 'renewable-power',
    title: 'Renewable electricity procurement',
    description: 'Compare supply contracts, PPAs and on-site generation against verified loads and procurement constraints.',
    link: 'Refinery electric loads and public or depot charging inform a common procurement view. Contracts and emissions attributes need a defined entity and metering boundary.',
    assets: 'Existing refinery and network loads are candidates for a joint procurement screen, subject to contract and meter access.',
    driver: 'Industrial electricity cost and exposure, and demand from charging services.',
    decision: 'Proceed where load profile, connection, attributable power, price exposure and contract terms support the case.',
    owner: 'Energy procurement',
    evidenceIds: ['E08', 'E13', 'E14'],
    teamIds: ['ws2-input', 'ws4-input', 'ws6-input'],
    riskIds: ['energy-price', 'grid-connection'],
    kpiIds: ['operational-emissions-scope2', 'financial-sustainability'],
  },
  {
    id: 'process-electrification',
    title: 'Selective process electrification',
    description: 'Assess suitable motors, steam or lower-temperature process duties against efficiency and electrification alternatives.',
    link: 'Compare site energy balances and power demand with distribution load planning. Carry any attributable emissions changes into the evidence for affected liquid products.',
    assets: 'Use site-specific process, steam and utility data at Falconara or Trecate once verified.',
    driver: 'Refinery operational emissions and energy-cost exposure.',
    decision: 'Pilot only with a verified duty profile, utility capacity and emissions and operating-cost comparison.',
    owner: 'Refining engineering',
    evidenceIds: ['E05', 'E10', 'E12', 'E13'],
    teamIds: ['ws2-input', 'ws3-input', 'ws6-input'],
    riskIds: ['process-integration', 'grid-connection', 'energy-price'],
    kpiIds: ['energy-intensity', 'operational-emissions-scope1', 'operational-emissions-scope2'],
  },
  {
    id: 'carbon-capture',
    title: 'Carbon capture and storage',
    description: 'Monitor capture of residual emissions from suitable streams after screening efficiency and electrification.',
    link: 'If verified capture changes supply costs or lifecycle values, reflect those changes in contract and product evidence. Forecourt demand by itself provides no case for capture.',
    assets: 'Potentially use existing refinery emissions sources if a stream study and transport and storage agreements establish suitability.',
    driver: 'Carbon-cost exposure and residual emissions from hard-to-abate process streams.',
    decision: 'Revisit only with suitable streams, credible transport and permanent storage, permits and a defensible cost per tonne.',
    owner: 'Refining engineering',
    evidenceIds: ['E03', 'E10', 'E12'],
    teamIds: ['ws1-input', 'ws3-input', 'ws6-input'],
    riskIds: ['process-integration', 'infrastructure-safety', 'offtake-counterparty'],
    kpiIds: ['operational-emissions-scope1', 'financial-sustainability'],
  },
  {
    id: 'feedstock-coprocessing',
    title: 'Certified feedstocks and co-processing',
    description: 'Assess incremental eligible feedstock and co-processing or external supply for road and contracted aviation and marine products.',
    link: 'Connect qualified processing and procurement to lot-level attribution, channel-specific supply and fleet, aviation or marine demand. Allocate volumes only with traceable evidence.',
    assets: 'IP reported co-processing at Falconara and Trecate, plus aviation and marine supply routes. Verify current unit limits, yields and approvals.',
    driver: 'Renewable transport obligations and evidenced demand from counterparties in each channel.',
    decision: 'Advance after qualified feedstock supply, technical fit, independently verifiable chain of custody and contracted outlets are demonstrated.',
    owner: 'Refining and fuels supply',
    evidenceIds: ['E02', 'E03', 'E05', 'E06'],
    teamIds: ['ws1-input', 'ws3-input', 'ws5-input', 'ws6-input'],
    riskIds: ['feedstock-traceability', 'process-integration', 'offtake-counterparty'],
    kpiIds: ['eligible-product-share', 'financial-sustainability'],
  },
  {
    id: 'road-hvo-pilot',
    title: 'Certified HVO fleet supply extension',
    description: 'Test incremental availability of compatible renewable diesel for a defined road-fleet cohort and authorised sites.',
    link: 'Link traceable, specification-compliant supply to storage and dispensing at selected sites, then reconcile fleet demand and delivered volumes with future sourcing.',
    assets: 'IP discloses a road HVO offer. Candidate sites, supply rights, vehicle compatibility and commercial terms require confirmation.',
    driver: 'Compatible diesel fleet demand and a verified buyer case for certified fuel.',
    decision: 'Require accepted vehicle compatibility, certified lots, supply and station permissions and a viable bounded fleet test before launch.',
    owner: 'Fuels supply and fleet services',
    evidenceIds: ['E02', 'E06', 'E08'],
    teamIds: ['ws1-input', 'ws3-input', 'ws5-input', 'ws6-input'],
    riskIds: ['feedstock-traceability', 'offtake-counterparty', 'infrastructure-safety'],
    kpiIds: ['eligible-product-share', 'fleet-adoption', 'service-availability'],
  },
  {
    id: 'refinery-hydrogen',
    title: 'Renewable hydrogen for refinery processes',
    description: 'Assess substantiated substitution of existing process hydrogen at the refinery and learn from the disclosed Trecate project.',
    link: 'Any eligible fuel claim requires documented hydrogen sourcing, product attribution and lifecycle accounting. The project creates no inference about road hydrogen availability.',
    assets: 'IP has disclosed a renewable hydrogen project at Trecate. Confirm project stage, power terms and verified process demand.',
    driver: 'Replacement of existing process hydrogen and applicable renewable-fuel criteria.',
    decision: 'Review scope, supply, metered process demand, certification and economics before any incremental commitment.',
    owner: 'Refining engineering',
    evidenceIds: ['E02', 'E07', 'E13'],
    teamIds: ['ws1-input', 'ws2-input', 'ws3-input', 'ws6-input'],
    riskIds: ['energy-price', 'process-integration', 'infrastructure-safety'],
    kpiIds: ['operational-emissions-scope1', 'eligible-product-share', 'investment-progress'],
  },
  {
    id: 'road-hydrogen',
    title: 'Road hydrogen refuelling',
    description: 'Keep a selective corridor option for validated specialist fleets, subject to comparison with battery-electric alternatives.',
    link: 'Assess sourcing, transport, storage and dispensing as a distinct supply chain. Match that chain to contracted vehicle deployment and utilisation.',
    assets: 'Use disclosed project context as a lead only. A corridor, site rights, equipment and fleet demand require confirmation.',
    driver: 'Binding offtake from an identifiable duty cycle and applicable infrastructure policy.',
    decision: 'Revisit when vehicles, permits, low-emissions supply and adequate contracted demand are credible at a specific site.',
    owner: 'Distribution development',
    evidenceIds: ['E03', 'E04', 'E07'],
    teamIds: ['ws1-input', 'ws4-input', 'ws5-input', 'ws6-input'],
    riskIds: ['infrastructure-safety', 'utilisation-risk', 'offtake-counterparty'],
    kpiIds: ['financial-sustainability', 'fleet-adoption'],
  },
  {
    id: 'e-fuels',
    title: 'Synthetic fuels for contracted markets',
    description: 'Monitor targeted synthetic aviation or marine supply pathways where regulation and advance offtake may support them.',
    link: 'Assess how qualified external supply or a future refinery-linked route would enter separately evidenced aviation and marine logistics.',
    assets: 'IP discloses aviation and marine supply routes. Eligible upstream electricity, hydrogen and carbon sourcing require confirmation.',
    driver: 'Aviation or marine buyer demand backed by eligible fuel obligations and price commitments.',
    decision: 'Defer commercial commitment until qualifying inputs, an eligible route, offtake and downside economics can be evidenced.',
    owner: 'Fuels supply and strategy',
    evidenceIds: ['E02', 'E03', 'E06', 'E12'],
    teamIds: ['ws1-input', 'ws3-input', 'ws5-input', 'ws6-input'],
    riskIds: ['energy-price', 'feedstock-traceability', 'offtake-counterparty'],
    kpiIds: ['eligible-product-share', 'financial-sustainability'],
  },
  {
    id: 'public-charging',
    title: 'Selective public charging expansion',
    description: 'Pilot incremental charging capacity or service upgrades at a validated forecourt or corridor where utilisation can be measured.',
    link: 'Use IP’s site network for delivery and customer access to charging alongside relevant fuels. Feed the change in demand by carrier back into network and refinery product planning.',
    assets: 'Existing IP and IPlanet charging and sites provide starting evidence. Site selection, ownership, capacity and operator terms require confirmation.',
    driver: 'Local EV traffic, repeat visitors, charging gaps and site dwell patterns.',
    decision: 'Require site consent, grid capacity, permits, compliant guest access and a credible local utilisation and margin case.',
    owner: 'Distribution and charging operations',
    evidenceIds: ['E03', 'E04', 'E08', 'E13'],
    teamIds: ['ws1-input', 'ws4-input', 'ws5-input', 'ws6-input'],
    riskIds: ['grid-connection', 'utilisation-risk', 'payment-operations'],
    kpiIds: ['station-conversion', 'charger-utilisation', 'service-availability', 'financial-sustainability'],
  },
  {
    id: 'fleet-charging',
    title: 'Fleet depot and route charging',
    description: 'Compare managed depot charging with shared route charging for a defined fleet duty cycle.',
    link: 'Fleet duty cycles reveal which vehicles can electrify and where compatible liquid fuels may retain demand. Use contracted volumes to plan supply and power capacity.',
    assets: 'Relevant existing charging locations and fleet relationships may support a bounded trial, subject to operator and customer agreements.',
    driver: 'Fleet operating schedules, depot dwell, vehicle plans and total cost of ownership.',
    decision: 'Pilot with a committed fleet, observed duty cycle, site and grid agreement, service terms and workable total cost.',
    owner: 'Fleet services and charging operations',
    evidenceIds: ['E04', 'E08', 'E09', 'E13', 'E14'],
    teamIds: ['ws4-input', 'ws5-input', 'ws6-input'],
    riskIds: ['grid-connection', 'utilisation-risk', 'offtake-counterparty'],
    kpiIds: ['fleet-adoption', 'charger-utilisation', 'service-availability', 'financial-sustainability'],
  },
  {
    id: 'biomethane',
    title: 'Biomethane for compatible fleets',
    description: 'Assess contracted renewable gas supply using compatible infrastructure and identified fleet demand.',
    link: 'Procure eligible supply with auditable attribution. Fleet demand and differences in compressed or liquefied delivery determine the channel and sizing.',
    assets: 'Screen existing publicly disclosed gas-service categories. Confirm individual equipment, permits, supply form and fleet compatibility.',
    driver: 'Eligible fuel obligations and demand from existing compatible fleets.',
    decision: 'Pilot only if supply, compatibility, methane control, certification, fleet offtake and alternative economics are confirmed.',
    owner: 'Fuels supply and distribution',
    evidenceIds: ['E02', 'E06', 'E08'],
    teamIds: ['ws1-input', 'ws4-input', 'ws5-input', 'ws6-input'],
    riskIds: ['feedstock-traceability', 'infrastructure-safety', 'offtake-counterparty'],
    kpiIds: ['eligible-product-share', 'fleet-adoption', 'financial-sustainability'],
  },
  {
    id: 'station-services',
    title: 'Energy and convenience services',
    description: 'Test accessible convenience, dwell and service formats suited to each station type.',
    link: 'A station can offer fuels, charging and convenience according to customer need. Measure demand and contribution separately so convenience revenue does not obscure carrier economics.',
    assets: 'Use eligible station footprints and service formats only where commercial rights and space can be confirmed.',
    driver: 'Dwell time, station convenience demand and repeat visits from retail and fleet customers.',
    decision: 'Test a bounded concept with a matched comparison and evidence of incremental site contribution and service quality.',
    owner: 'Distribution retail',
    evidenceIds: ['E04', 'E08', 'E09'],
    teamIds: ['ws4-input', 'ws5-input', 'ws6-input'],
    riskIds: ['convenience-economics', 'utilisation-risk'],
    kpiIds: ['customer-adoption', 'service-availability', 'financial-sustainability'],
  },
  {
    id: 'linked-mobility',
    title: 'Linked customer and fleet services',
    description: 'Test a shared service catalogue, fleet reporting and payment or loyalty handoffs that build on existing channels.',
    link: 'Use aggregated product selections, charging demand and service outcomes to guide supply forecasts, station upgrades and management decisions.',
    assets: 'Stazioni IP, IP Pay, IPiù and existing fleet channels are starting points. System access, partner permissions and data sharing require confirmation.',
    driver: 'An easier multi-energy experience for drivers and consolidated service information for fleet managers.',
    decision: 'Pilot a bounded service journey with data rights, accessibility, payment reconciliation and a clear owner for service status.',
    owner: 'Digital product and fleet services',
    evidenceIds: ['E03', 'E08', 'E09'],
    teamIds: ['ws4-input', 'ws5-input', 'ws7-input'],
    riskIds: ['data-availability', 'payment-operations'],
    kpiIds: ['customer-adoption', 'fleet-adoption', 'service-availability', 'data-quality'],
  },
] as const

type InitiativeId = (typeof initiativeSpecs)[number]['id']

interface Placement {
  status: Initiative['status']
  horizon: Horizon
  intensity: Rating
  pillarIds: readonly string[]
  gateStages: readonly ('watch' | 'pilot' | 'scale')[]
}

const portfolioPlacement: Record<InitiativeId, Placement> = {
  'refinery-efficiency': {
    status: 'Proposed', horizon: '0–3 years', intensity: 'Medium',
    pillarIds: ['efficient-refining', 'evidence-led-investment'], gateStages: ['pilot'],
  },
  'renewable-power': {
    status: 'Proposed', horizon: '0–3 years', intensity: 'Medium',
    pillarIds: ['efficient-refining', 'selective-stations'], gateStages: ['pilot'],
  },
  'process-electrification': {
    status: 'Under assessment', horizon: '3–7 years', intensity: 'High',
    pillarIds: ['efficient-refining', 'evidence-led-investment'], gateStages: ['pilot'],
  },
  'carbon-capture': {
    status: 'Deferred', horizon: '7–15+ years', intensity: 'High',
    pillarIds: ['efficient-refining', 'evidence-led-investment'], gateStages: ['watch'],
  },
  'feedstock-coprocessing': {
    status: 'Proposed', horizon: '0–3 years', intensity: 'Medium',
    pillarIds: ['efficient-refining', 'selective-stations'], gateStages: ['pilot'],
  },
  'road-hvo-pilot': {
    status: 'Proposed', horizon: '0–3 years', intensity: 'Medium',
    pillarIds: ['efficient-refining', 'customer-fleet-services'], gateStages: ['pilot', 'scale'],
  },
  'refinery-hydrogen': {
    status: 'Under assessment', horizon: '3–7 years', intensity: 'High',
    pillarIds: ['efficient-refining', 'evidence-led-investment'], gateStages: ['watch'],
  },
  'road-hydrogen': {
    status: 'Deferred', horizon: '7–15+ years', intensity: 'High',
    pillarIds: ['selective-stations', 'evidence-led-investment'], gateStages: ['watch'],
  },
  'e-fuels': {
    status: 'Deferred', horizon: '7–15+ years', intensity: 'High',
    pillarIds: ['efficient-refining', 'evidence-led-investment'], gateStages: ['watch'],
  },
  'public-charging': {
    status: 'Proposed', horizon: '0–3 years', intensity: 'High',
    pillarIds: ['selective-stations', 'evidence-led-investment'], gateStages: ['pilot', 'scale'],
  },
  'fleet-charging': {
    status: 'Proposed', horizon: '0–3 years', intensity: 'High',
    pillarIds: ['selective-stations', 'customer-fleet-services'], gateStages: ['pilot'],
  },
  biomethane: {
    status: 'Under assessment', horizon: '3–7 years', intensity: 'Medium',
    pillarIds: ['selective-stations', 'customer-fleet-services'], gateStages: ['watch'],
  },
  'station-services': {
    status: 'Proposed', horizon: '0–3 years', intensity: 'Medium',
    pillarIds: ['selective-stations', 'customer-fleet-services'], gateStages: ['pilot'],
  },
  'linked-mobility': {
    status: 'Proposed', horizon: '0–3 years', intensity: 'Medium',
    pillarIds: ['customer-fleet-services', 'evidence-led-investment'], gateStages: ['pilot'],
  },
}

const prerequisiteInitiatives: Partial<Record<InitiativeId, readonly InitiativeId[]>> = {
  'carbon-capture': ['refinery-efficiency', 'process-electrification'],
  'e-fuels': ['renewable-power'],
  'fleet-charging': ['renewable-power'],
  'linked-mobility': ['road-hvo-pilot', 'public-charging'],
  'process-electrification': ['refinery-efficiency', 'renewable-power'],
  'refinery-hydrogen': ['renewable-power'],
}

const businessRationales: Record<InitiativeId, string> = {
  'refinery-efficiency': 'Screen reversible and proven measures first to limit capital exposure and improve resilience to energy and carbon costs.',
  'renewable-power': 'Match contracted supply to the load profile and compare fixed and variable cost exposure before committing.',
  'process-electrification': 'Target a duty where controllability, downtime and cost per tonne of emissions avoided can beat the best retained thermal option.',
  'carbon-capture': 'Keep a route for residual industrial emissions when retrofit alternatives are exhausted and storage access is bankable.',
  'feedstock-coprocessing': 'Compare incremental co-processing with qualified sourcing to meet customer and compliance needs without assuming a dedicated conversion.',
  'road-hvo-pilot': 'Test demand in a compatible fleet before committing to incremental dispensing, inventory and supply across multiple sites.',
  'refinery-hydrogen': 'Assess the existing industrial use case first so any change in hydrogen supply is tied to measured demand and product qualification.',
  'road-hydrogen': 'Keep site capital flexible until enough compatible vehicles and affordable low-emissions supply are committed.',
  'e-fuels': 'Preserve the option of contracted supply through established commercial channels while upstream cost and eligibility remain uncertain.',
  'public-charging': 'Use existing forecourt and operator capabilities where available. Validate demand and connection cost separately for each site.',
  'fleet-charging': 'A committed fleet and scheduled charging may reduce demand uncertainty and shape power requirements before capital is committed.',
  biomethane: 'Test existing compatible infrastructure and contracted demand before considering additional gas capacity.',
  'station-services': 'Test whether additional services earn their own contribution and meet customer needs within existing space and staffing constraints.',
  'linked-mobility': 'Reuse established channels where feasible and gain decision-quality signals from a bounded service journey before complex systems integration.',
}

export const initiatives: readonly Initiative[] = initiativeSpecs.map((spec) => {
  const placement = portfolioPlacement[spec.id]
  const technologyIds = [`${spec.id}-technology`]
  if (spec.id === 'feedstock-coprocessing') technologyIds.push('advanced-biofuels-technology')
  if (spec.id === 'biomethane') technologyIds.push('speculative-fossil-gas-technology')
  if (spec.id === 'linked-mobility') technologyIds.push('fleet-management-technology')

  return {
    id: spec.id,
    title: spec.title,
    description: spec.description,
    status: placement.status,
    evidenceType: 'STRATEGIC RECOMMENDATION',
    source: [],
    evidenceIds: spec.evidenceIds,
    owner: spec.owner,
    timeHorizon: placement.horizon,
    dependencies: [
      ...(prerequisiteInitiatives[spec.id] ?? []).map((id) => ({ kind: 'initiative' as const, id })),
      ...spec.teamIds.map((id) => ({ kind: 'team' as const, id: `workstream-${id.charAt(2)}` })),
    ],
    assumptions: [],
    lastUpdated: '2026-11-26',
    pillarIds: placement.pillarIds,
    technologyIds,
    demandDriver: spec.driver,
    assetFit: spec.assets,
    businessRationale: businessRationales[spec.id],
    integration: spec.link,
    investmentIntensity: {
      value: placement.intensity,
      evidenceType: 'STRATEGIC RECOMMENDATION',
      evidenceIds: spec.evidenceIds,
      scope: 'Indicative intensity of the incremental intervention. IP cost and authorised budget require evidence.',
      period: null,
      lastUpdated: '2026-11-26',
    },
    riskIds: spec.riskIds,
    kpiIds: spec.kpiIds,
    gateIds: placement.gateStages.map((stage) => `${spec.id}-${stage}`),
  }
})

export const initiativeInputRequests: Readonly<Record<string, readonly string[]>> = Object.fromEntries(
  initiativeSpecs.map((spec) => [spec.id, spec.teamIds]),
)

export const initiativeDecisionTriggers: Readonly<Record<string, string>> = Object.fromEntries(
  initiativeSpecs.map((spec) => [spec.id, spec.decision]),
)
