import type { Datum, DemoEvent } from '../models/strategy'

interface DemoJourney {
  serviceId: string
  persona: string
  useCase: string
  quantity: Datum<number>
  unit: 'L' | 'kWh'
  unitPriceEur: Datum<number>
  summaryTitle: string
  fallbackMessage: string
  steps: readonly string[]
}

function sampleValue(value: number, scope: string): Datum<number> {
  return {
    value,
    evidenceType: 'ILLUSTRATIVE OR MODELLED VALUE',
    evidenceIds: ['fictional-scenario'],
    scope,
    period: null,
    lastUpdated: '2026-11-26',
  }
}

export const demoJourneys: readonly DemoJourney[] = [
  {
    serviceId: 'corridor-demo-hvo',
    persona: 'Fleet dispatcher',
    useCase: 'Request fuel for a compatible vehicle on a recurring corridor.',
    quantity: sampleValue(120, 'Volume requested by the fictional road fleet'),
    unit: 'L',
    unitPriceEur: { value: null, evidenceType: 'NO DATA', inputRequestIds: ['ws6-input'] },
    summaryTitle: 'Fleet request preview',
    fallbackMessage: 'A quote, certified batch and committed delivery would be needed to confirm fulfilment.',
    steps: ['Discover', 'Review compatibility', 'Simulate request', 'Review invoice preview'],
  },
  {
    serviceId: 'corridor-demo-ev',
    persona: 'EV driver',
    useCase: 'Review a compatible connector and simulate a stop during a journey.',
    quantity: sampleValue(24, 'Energy in the fictional charging session'),
    unit: 'kWh',
    unitPriceEur: sampleValue(0.52, 'Example price in euros per kWh delivered'),
    summaryTitle: 'Charging session preview',
    fallbackMessage: 'A real charging service would require current connector status and a host tariff.',
    steps: ['Discover', 'Review service', 'Simulate reservation', 'Simulate payment'],
  },
]

export const demoEventActions: readonly DemoEvent['action'][] = [
  'Fleet request simulated', 'Reservation simulated', 'Payment simulated',
]
