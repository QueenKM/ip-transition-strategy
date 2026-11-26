import type { StrategicPillar } from '../models/strategy'
import { evidenceCheckedOn } from './sources'

const proposed = {
  status: 'Proposed',
  evidenceType: 'STRATEGIC RECOMMENDATION',
  timeHorizon: '0–3 years',
  assumptions: [],
  lastUpdated: evidenceCheckedOn,
} as const

export const pillars: readonly StrategicPillar[] = [
  {
    ...proposed,
    id: 'efficient-refining',
    title: 'Efficient refining and qualified product supply',
    description: 'Reduce refinery energy intensity and validate eligible fuel pathways for specific buyers and channels.',
    objective: 'Prioritise measurable energy savings and feasible product changes within refinery operating constraints.',
    refiningContribution: 'Baseline energy use and screen heat recovery, power procurement and safe operating improvements. Qualify bio-derived inputs and processing options by site.',
    distributionContribution: 'Define buyer demand, product compatibility, storage, transport and verified batch availability by channel.',
    digitalContribution: 'Expose verified eligibility and service information. Give managers matched records for commercial demand, volumes and production evidence.',
    customerSegments: ['Road fleets with compatible vehicles', 'Aviation fuel buyers', 'Marine fuel buyers'],
    businessRationale: 'Stage capital behind verified energy savings, certification, reliable feedstock availability and credible product margin.',
    owner: 'Refining and fuel portfolio leads',
    source: [
      { sourceId: 'ip-refining', locator: 'Asset perimeter' },
      { sourceId: 'ip-report-2025', locator: '§§9.1–9.3' },
      { sourceId: 'ip-aviation-marine', locator: 'Reported product channels' },
    ],
    evidenceIds: ['E02', 'E05', 'E06', 'E07', 'E10'],
    dependencies: [
      { kind: 'team', id: 'workstream-2' },
      { kind: 'team', id: 'workstream-3' },
      { kind: 'team', id: 'workstream-6' },
    ],
    initiativeIds: ['refinery-efficiency', 'renewable-power', 'process-electrification', 'carbon-capture', 'feedstock-coprocessing', 'refinery-hydrogen', 'e-fuels'],
    kpiIds: ['energy-intensity', 'operational-emissions-scope1', 'operational-emissions-scope2', 'eligible-product-share'],
    riskIds: ['baseline-boundary', 'feedstock-traceability', 'process-integration', 'energy-price'],
  },
  {
    ...proposed,
    id: 'selective-stations',
    title: 'Selective station transformation',
    description: 'Add services at sites with documented demand, site rights, infrastructure and viable economics.',
    objective: 'Use differentiated station archetypes to stage multi-energy investment.',
    refiningContribution: 'Plan reliable certified fuel supply and review power procurement across refinery and station operating loads.',
    distributionContribution: 'Screen forecourts and fleet locations for demand, access, grid connection, safety and service operations. Pilot only the energy options supported at each site.',
    digitalContribution: 'Show service availability and eligibility. Track fulfilled sessions, failed attempts and emerging fleet demand by service.',
    customerSegments: ['Corridor drivers', 'Urban drivers', 'Local and route-based fleets'],
    businessRationale: 'Direct conversion spending to locations likely to sustain use while testing capacity and reliability before expansion.',
    owner: 'Distribution programme lead',
    source: [
      { sourceId: 'ip-stations', locator: 'Reported network perimeter' },
      { sourceId: 'ip-report-2025', locator: '§9.4, IPlanet' },
      { sourceId: 'lecture-2', locator: 'pp. 24–29, 34–43' },
    ],
    evidenceIds: ['E03', 'E04', 'E08', 'E13', 'E14'],
    dependencies: [
      { kind: 'team', id: 'workstream-4' },
      { kind: 'team', id: 'workstream-5' },
      { kind: 'team', id: 'workstream-6' },
    ],
    initiativeIds: ['road-hvo-pilot', 'public-charging', 'fleet-charging', 'road-hydrogen', 'biomethane', 'station-services'],
    kpiIds: ['station-conversion', 'charger-utilisation', 'service-availability', 'financial-sustainability'],
    riskIds: ['grid-connection', 'utilisation-risk', 'infrastructure-safety', 'convenience-economics'],
  },
  {
    ...proposed,
    id: 'customer-fleet-services',
    title: 'Customer and fleet services',
    description: 'Give drivers and fleets a clear way to find, check and use eligible energy services.',
    objective: 'Make participating offers discoverable and turn service activity into reliable demand signals.',
    refiningContribution: 'Supply approved product descriptions and traceability references so eligible fuel offers reflect what can be supplied.',
    distributionContribution: 'Provide current operating status, eligibility, payment terms and support channels for participating locations.',
    digitalContribution: 'Test a linked journey for discovery, selection, reservation or request, and payment with permissioned partner interfaces.',
    customerSegments: ['Retail drivers', 'Mixed-powertrain fleets', 'Fleet operations managers'],
    businessRationale: 'Reduce friction in choosing a compatible service and measure completed use before making broader integration commitments.',
    owner: 'Digital product and fleet services leads',
    source: [
      { sourceId: 'ip-driv', locator: 'Retail service features' },
      { sourceId: 'iplanet-app', locator: 'Charging and reservation features' },
      { sourceId: 'ip-plus', locator: 'Fleet service issuer' },
    ],
    evidenceIds: ['E06', 'E08', 'E09'],
    dependencies: [
      { kind: 'team', id: 'workstream-5' },
      { kind: 'team', id: 'workstream-7' },
    ],
    assumptions: ['partner-data-access'],
    initiativeIds: ['linked-mobility', 'road-hvo-pilot', 'fleet-charging', 'station-services'],
    kpiIds: ['service-availability', 'customer-adoption', 'fleet-adoption', 'data-quality'],
    riskIds: ['data-availability', 'payment-operations', 'offtake-counterparty'],
  },
  {
    ...proposed,
    id: 'evidence-led-investment',
    title: 'Evidence-led investment',
    description: 'Use commercial and operating evidence to stage capital across both supply pathways.',
    objective: 'Make a designated investment owner accountable for advancing, reviewing or stopping each initiative.',
    refiningContribution: 'Supply baseline, technical approval, certification and operating performance evidence by site and product.',
    distributionContribution: 'Supply measured uptake, availability, commercial margin, infrastructure and customer commitments by cohort.',
    digitalContribution: 'Present comparable evidence, disclose gaps and preserve the records supporting human pilot and scale decisions.',
    customerSegments: ['IP management and investment reviewers', 'Refining and distribution owners', 'Operating and commercial partners'],
    businessRationale: 'Commit capital in stages as legal, demand, operating and economics evidence becomes available.',
    owner: 'Strategy sponsor and investment committee',
    source: [
      { sourceId: 'lecture-2', locator: 'pp. 5–6, 65–74' },
      { sourceId: 'ip-report-2025', locator: '§§9.1–9.4' },
    ],
    evidenceIds: ['E01', 'E10', 'E14', 'missing-pilot-inputs'],
    dependencies: [
      { kind: 'team', id: 'workstream-6' },
      { kind: 'team', id: 'workstream-7' },
    ],
    initiativeIds: ['refinery-efficiency', 'road-hvo-pilot', 'public-charging', 'linked-mobility'],
    kpiIds: ['investment-progress', 'financial-sustainability', 'data-quality'],
    riskIds: ['baseline-boundary', 'data-availability', 'offtake-counterparty'],
  },
]

export const valueChains = [
  {
    id: 'refinery-to-customer',
    title: 'Refinery and certified fuel pathway',
    description: 'Match certified fuel supply and refinery investment to demand from specific customer segments.',
    steps: [
      {
        title: 'Regulation and demand',
        description: 'Map eligible fuel rules, fleet compatibility and contracted offtake by transport segment.',
      },
      {
        title: 'Inputs and refinery transformation',
        description: 'Screen efficiency measures and candidate bio-derived feedstocks against site constraints and certification.',
        initiativeId: 'feedstock-coprocessing',
      },
      {
        title: 'Lower-carbon fuel products',
        description: 'Offer eligible batches with product-specific traceability. Evaluate refinery output and sourced fuels by channel.',
        initiativeId: 'road-hvo-pilot',
      },
      {
        title: 'Distribution network',
        description: 'Align terminals, compatible storage and delivery with the chosen road, aviation or marine outlet.',
        initiativeId: 'station-services',
      },
      {
        title: 'Customer and fleet services',
        description: 'Show location, product eligibility and availability where a service owner can confirm them.',
        initiativeId: 'linked-mobility',
      },
      {
        title: 'Operational and demand evidence',
        description: 'Review eligible volumes, delivery reliability, fleet uptake and contribution margin before expanding supply.',
      },
    ],
  },
  {
    id: 'grid-to-customer',
    title: 'Grid electricity and charging pathway',
    description: 'Concentrate charging investment at sites and fleet locations with evidenced demand and feasible power supply.',
    steps: [
      {
        title: 'Regulation and demand',
        description: 'Screen corridor coverage, local travel patterns and depot or route commitments.',
      },
      {
        title: 'Electricity supply and connection',
        description: 'Assess supply contracts, DSO connection capacity and hourly load. Evaluate on-site generation where feasible.',
        initiativeId: 'renewable-power',
      },
      {
        title: 'Charging offer',
        description: 'Size power and connectors to dwell time, projected use, service obligations and site economics.',
        initiativeId: 'public-charging',
      },
      {
        title: 'Distribution network',
        description: 'Use suitable forecourts or fleet depots where permissions and commercial roles are clear.',
        initiativeId: 'fleet-charging',
      },
      {
        title: 'Customer and fleet services',
        description: 'Bring charging and compatible fuel offers into a shared discovery and service experience.',
        initiativeId: 'linked-mobility',
      },
      {
        title: 'Operational and demand evidence',
        description: 'Review sessions, failed attempts, peak load and availability alongside fuel and fleet demand.',
      },
    ],
  },
] as const
