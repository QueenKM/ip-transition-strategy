import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ClipboardList, CreditCard, Truck, Zap } from 'lucide-react'
import { DatumValue, EvidenceBadge, ServiceStatusChip } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import { demoJourneys } from '../data/demo'
import { stationServices, stations } from '../data/services'
import { useDemoSession } from '../hooks/useDemoSession'
import type { DemoEvent } from '../models/strategy'
import styles from '../components/mobility/Mobility.module.css'

const currency = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })

export default function JourneyPage() {
  const [params] = useSearchParams()
  const { events, addEvent, resetDemo } = useDemoSession()
  const outcome = useRef<HTMLDivElement>(null)
  const serviceId = params.get('service') ?? demoJourneys[0]?.serviceId
  const service = stationServices.find((item) => item.id === serviceId)
  const journey = demoJourneys.find((item) => item.serviceId === serviceId)

  if (!service) {
    return (
      <div className="page">
        <PageHeading eyebrow="Customer & fleet" title="Customer and Fleet Journey" />
        <section className={styles.empty}>
          <h2>Service unavailable in this demo catalogue</h2>
          <p>Choose a service from the fictional station catalogue.</p>
          <Link className="button" to="/mobility/explore">Open Explorer</Link>
        </section>
      </div>
    )
  }

  const station = stations.find((item) => item.id === service.stationId)
  const quantity = journey?.quantity.value ?? null
  const unitPrice = journey?.unitPriceEur.value ?? null
  const total = quantity !== null && unitPrice !== null ? quantity * unitPrice : null
  const serviceEvents = events.filter((event) => event.stationServiceId === service.id)
  const requestDone = serviceEvents.some((event) => event.action === 'Fleet request simulated')
  const reservationDone = serviceEvents.some((event) => event.action === 'Reservation simulated')
  const paymentDone = serviceEvents.some((event) => event.action === 'Payment simulated')
  const isFleetRequest = service.journeyMode === 'Request'
  const currentStep = requestDone || paymentDone || reservationDone ? 3 : 2
  const JourneyIcon = isFleetRequest ? Truck : Zap
  const canSimulate = Boolean(journey && (
    (isFleetRequest && service.status === 'Pilot') ||
    (service.journeyMode === 'Reservation' && service.status === 'Available')
  ))

  const initiativeLink = `/strategy/gate?initiative=${service.initiativeId}`
  const activeAction: DemoEvent['action'] | null = canSimulate
    ? isFleetRequest
      ? requestDone ? null : 'Fleet request simulated'
      : paymentDone
        ? null
        : reservationDone ? 'Payment simulated' : 'Reservation simulated'
    : null

  const actionLabel = activeAction === 'Fleet request simulated'
    ? 'Simulate fleet request'
    : activeAction === 'Payment simulated' ? 'Simulate payment' : 'Simulate reservation'

  const stageMessage = requestDone
    ? 'Fleet request simulated. Invoice preview ready.'
    : paymentDone
      ? 'Payment simulated. Receipt preview ready.'
      : reservationDone ? 'Reservation simulated. Payment preview ready.' : ''

  function runAction() {
    if (!service || !activeAction) return
    addEvent(service, activeAction)
    requestAnimationFrame(() => outcome.current?.focus())
  }

  return (
    <div className="page">
      <PageHeading
        eyebrow="Customer & fleet"
        title="Customer and Fleet Journey"
        description="Follow an offer from discovery to a simulated action and see the signal it creates for strategy review."
      />

      <div className={styles.journeyLead}>
        <div className={styles.journeyBadge}><JourneyIcon size={26} aria-hidden="true" /></div>
        <div>
          <p className={styles.locationKind}>Illustrative scenario · {station?.title ?? 'Fictional location'}</p>
          <h2>{service.title}</h2>
          <p>{journey?.useCase ?? service.description}</p>
        </div>
        <ServiceStatusChip status={service.status} />
      </div>

      {journey && (
        <ol className={styles.journeySteps} aria-label="Journey stages">
          {journey.steps.map((step, index) => (
            <li key={step} aria-current={currentStep === index ? 'step' : undefined}>
              <span className={styles.stepMarker} aria-hidden="true">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      )}

      <div className={styles.journeyGrid}>
        <section className={styles.journeyPanel} aria-labelledby="service-review-title">
          <h2 id="service-review-title">Review service</h2>
          <EvidenceBadge type={service.evidenceType} />
          <dl className={styles.journeyFacts}>
            <div><dt>Vehicle fit</dt><dd>{service.compatibility}</dd></div>
            <div><dt>Energy carrier</dt><dd>{service.carrier}</dd></div>
            {journey && <div><dt>Scenario role</dt><dd>{journey.persona}</dd></div>}
            <div><dt>Price basis</dt><dd><DatumValue datum={service.priceBasis} /></dd></div>
            {service.chargerPowerKw && (
              <div><dt>Connector power</dt><dd><DatumValue datum={service.chargerPowerKw} unit="kW" /></dd></div>
            )}
          </dl>
          <Link className="button button-secondary" to="/mobility/explore">Back to Explorer</Link>
        </section>

        <section className={styles.journeyPanel} aria-labelledby="action-title">
          <div className={styles.receiptHeading}>
            <ClipboardList size={21} aria-hidden="true" />
            <h2 id="action-title">{journey?.summaryTitle ?? 'Service readiness'}</h2>
          </div>
          {journey ? (
            <>
              <p className={styles.simulationNote}>Simulation only. Actions stay in this browser session.</p>
              <dl className={styles.journeyFacts}>
                <div>
                  <dt>{isFleetRequest ? 'Requested volume' : 'Example energy delivered'}</dt>
                  <dd>
                    {quantity === null ? 'No data'
                      : <>{quantity} {journey.unit} <span className={styles.sample}>Illustrative</span></>}
                  </dd>
                </div>
                <div>
                  <dt>Unit price</dt>
                  <dd>
                    {unitPrice === null ? <DatumValue datum={journey.unitPriceEur} />
                      : <>{currency.format(unitPrice)}/{journey.unit} <span className={styles.sample}>Illustrative</span></>}
                  </dd>
                </div>
                <div>
                  <dt>{isFleetRequest ? 'Invoice total' : 'Payment preview'}</dt>
                  <dd>
                    {total === null ? 'No data'
                      : <>{currency.format(total)} <span className={styles.sample}>Illustrative</span></>}
                  </dd>
                </div>
              </dl>
              <p>{journey.fallbackMessage}</p>
            </>
          ) : (
            <p>Review this service concept and its delivery prerequisites in Strategy Control.</p>
          )}

          <div
            aria-live="polite"
            className={stageMessage ? styles.outcome : undefined}
            ref={outcome}
            tabIndex={-1}
          >
            {stageMessage && <strong>{stageMessage}</strong>}
          </div>

          <div className={styles.journeyActions}>
            {activeAction && (
              <button className="button" type="button" onClick={runAction}>
                {activeAction === 'Payment simulated' && <CreditCard size={17} aria-hidden="true" />}
                {actionLabel}
              </button>
            )}
            <Link
              className={stageMessage || !activeAction ? 'button' : 'button button-secondary'}
              to={initiativeLink}
            >
              View matching investment gate
            </Link>
            {events.length > 0 && (
              <button className="button button-secondary" type="button" onClick={resetDemo}>
                Reset demo
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
