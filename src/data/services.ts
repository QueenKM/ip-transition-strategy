import type { Datum, StationArchetype, StationService } from '../models/strategy'

const illustrative = 'ILLUSTRATIVE OR MODELLED VALUE' as const

const demoStation = {
  status: 'Fictional archetype',
  evidenceType: illustrative,
  source: [{ sourceId: 'brief', locator: 'Part 7 prototype scope' }],
  evidenceIds: ['fictional-scenario'],
  owner: 'Part 7 · Demo design',
  timeHorizon: '0–3 years',
  dependencies: [],
  assumptions: [],
  lastUpdated: '2026-11-26',
} as const satisfies Omit<StationArchetype, 'id' | 'title' | 'description' | 'archetype'>

const demoService = {
  evidenceType: illustrative,
  source: [{ sourceId: 'brief', locator: 'Part 7 prototype scope' }],
  evidenceIds: ['fictional-scenario'],
  owner: 'Part 7 · Demo design',
  dependencies: [],
  assumptions: [],
  lastUpdated: '2026-11-26',
} as const satisfies Omit<StationService, 'id' | 'title' | 'description' | 'status'
  | 'timeHorizon' | 'stationId' | 'initiativeId' | 'carrier' | 'audience'
  | 'compatibility' | 'journeyMode' | 'priceBasis' | 'chargerPowerKw'>

export const stations: readonly StationArchetype[] = [
  {
    ...demoStation,
    id: 'corridor-demo',
    title: 'Corridor forecourt',
    archetype: 'Through-route stop',
    description: 'A fictional roadside site where compatible fleets and public EV drivers share the forecourt.',
  },
  {
    ...demoStation,
    id: 'depot-demo',
    title: 'Return-to-base depot',
    archetype: 'Contracted fleet depot',
    description: 'A fictional base for vehicles with predictable return times and overnight dwell.',
  },
  {
    ...demoStation,
    id: 'neighbourhood-demo',
    title: 'Local service site',
    archetype: 'Neighbourhood stop',
    description: 'A fictional local site used to show how an unverified offer appears in the catalogue.',
  },
]

const quoteUnavailable: Datum<string> = {
  value: null,
  evidenceType: 'NO DATA',
  inputRequestIds: ['ws6-input'],
}

export const stationServices: readonly StationService[] = [
  {
    ...demoService,
    id: 'corridor-demo-hvo',
    stationId: 'corridor-demo',
    initiativeId: 'road-hvo-pilot',
    title: 'XTL-HVO fleet request',
    description: 'Request a sample volume for an approved vehicle and review the fulfilment conditions.',
    carrier: 'Liquid fuel',
    audience: 'Fleet',
    status: 'Pilot',
    timeHorizon: '0–3 years',
    compatibility: 'Fictional fleet preset with vehicle manufacturer approval for XTL fuel.',
    journeyMode: 'Request',
    priceBasis: quoteUnavailable,
    chargerPowerKw: null,
  },
  {
    ...demoService,
    id: 'corridor-demo-ev',
    stationId: 'corridor-demo',
    initiativeId: 'public-charging',
    title: 'Public DC charging',
    description: 'Compare an illustrative charging offer, hold a sample session and preview payment.',
    carrier: 'Electricity',
    audience: 'Both',
    status: 'Available',
    timeHorizon: '0–3 years',
    compatibility: 'Fictional vehicle preset with a CCS connector.',
    journeyMode: 'Reservation',
    priceBasis: {
      value: 'Per kWh delivered',
      evidenceType: illustrative,
      evidenceIds: ['fictional-scenario'],
      scope: 'Fictional charging scenario',
      period: null,
      lastUpdated: '2026-11-26',
    },
    chargerPowerKw: {
      value: 150,
      evidenceType: illustrative,
      evidenceIds: ['fictional-scenario'],
      scope: 'Single fictional connector nameplate power',
      period: null,
      lastUpdated: '2026-11-26',
    },
  },
  {
    ...demoService,
    id: 'depot-demo-ev',
    stationId: 'depot-demo',
    initiativeId: 'fleet-charging',
    title: 'Managed depot charging',
    description: 'A depot charging concept that depends on vehicle schedules, grid capacity and tariff evidence.',
    carrier: 'Electricity',
    audience: 'Fleet',
    status: 'Planned',
    timeHorizon: '0–3 years',
    compatibility: 'Illustrative return-to-base fleet with overnight dwell.',
    journeyMode: 'Explore only',
    priceBasis: quoteUnavailable,
    chargerPowerKw: {
      value: null,
      evidenceType: 'NO DATA',
      inputRequestIds: ['ws4-input', 'ws5-input'],
    },
  },
  {
    ...demoService,
    id: 'corridor-demo-hydrogen',
    stationId: 'corridor-demo',
    initiativeId: 'road-hydrogen',
    title: 'Fleet hydrogen refuelling',
    description: 'Assess a possible road supply route for a compatible, contracted fleet.',
    carrier: 'Hydrogen',
    audience: 'Fleet',
    status: 'Under assessment',
    timeHorizon: '3–7 years',
    compatibility: 'Requires a compatible fuel-cell vehicle and an evidenced delivery specification.',
    journeyMode: 'Explore only',
    priceBasis: quoteUnavailable,
    chargerPowerKw: null,
  },
  {
    ...demoService,
    id: 'neighbourhood-demo-biomethane',
    stationId: 'neighbourhood-demo',
    initiativeId: 'biomethane',
    title: 'Biomethane service information',
    description: 'Workstream 4 supplies site availability evidence. Workstream 5 supplies vehicle compatibility and the proposed service model.',
    carrier: 'Biomethane',
    audience: 'Fleet',
    status: 'No data',
    timeHorizon: '3–7 years',
    compatibility: 'No data',
    journeyMode: 'Explore only',
    priceBasis: quoteUnavailable,
    chargerPowerKw: null,
  },
]

export const serviceCarriers: readonly StationService['carrier'][] = [
  'Liquid fuel', 'Electricity', 'Hydrogen', 'Biomethane',
]

export const serviceStatuses: readonly StationService['status'][] = [
  'Available', 'Pilot', 'Planned', 'Under assessment', 'No data',
]
