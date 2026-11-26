import { useSyncExternalStore } from 'react'
import { demoEventActions } from '../data/demo'
import { stationServices } from '../data/services'
import type { DemoEvent, StationService } from '../models/strategy'

const storageKey = 'ip-transition-academic-demo-v1'
const emptyEvents: readonly DemoEvent[] = []
const listeners = new Set<() => void>()

function isDemoEvent(value: unknown): value is DemoEvent {
  if (!value || typeof value !== 'object') return false
  const event = value as Partial<DemoEvent>
  const service = stationServices.find((item) => item.id === event.stationServiceId)

  return (
    typeof event.id === 'string' &&
    event.evidenceType === 'ILLUSTRATIVE OR MODELLED VALUE' &&
    Boolean(service && service.initiativeId === event.initiativeId) &&
    Boolean(event.action && demoEventActions.includes(event.action)) &&
    typeof event.createdAt === 'string' &&
    Number.isFinite(Date.parse(event.createdAt))
  )
}

function readSession(): readonly DemoEvent[] {
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? '[]')
    return Array.isArray(stored) ? stored.filter(isDemoEvent) : emptyEvents
  } catch {
    return emptyEvents
  }
}

let events = readSession()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getEvents() {
  return events
}

function getEmptyEvents() {
  return emptyEvents
}

function notify(next: readonly DemoEvent[]) {
  events = next
  try {
    if (next.length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(next))
    } else {
      sessionStorage.removeItem(storageKey)
    }
  } catch {
    // The current tab can still run the demo when storage is unavailable.
  }
  listeners.forEach((listener) => listener())
}

function addEvent(service: StationService, action: DemoEvent['action']): DemoEvent {
  const existing = events.find(
    (event) => event.stationServiceId === service.id && event.action === action,
  )
  if (existing) return existing

  const event: DemoEvent = {
    id: `${service.id}:${action}`,
    evidenceType: 'ILLUSTRATIVE OR MODELLED VALUE',
    initiativeId: service.initiativeId,
    stationServiceId: service.id,
    action,
    createdAt: new Date().toISOString(),
  }
  notify([...events, event])
  return event
}

function resetDemo() {
  notify(emptyEvents)
}

export function useDemoSession() {
  const sessionEvents = useSyncExternalStore(subscribe, getEvents, getEmptyEvents)
  return { events: sessionEvents, addEvent, resetDemo }
}
