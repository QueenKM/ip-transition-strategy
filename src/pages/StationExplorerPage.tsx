import { useSearchParams, Link } from 'react-router'
import { BatteryCharging, Filter, Fuel, MapPin, Route } from 'lucide-react'
import { DatumValue, EvidenceBadge, ServiceStatusChip } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import { serviceCarriers, serviceStatuses, stationServices, stations } from '../data/services'
import type { StationService } from '../models/strategy'
import styles from '../components/mobility/Mobility.module.css'

const audienceOptions = ['Driver', 'Fleet'] as const

function appliesToAudience(service: StationService, audience: string) {
  return !audience || service.audience === audience || service.audience === 'Both'
}

export default function StationExplorerPage() {
  const [filters, setFilters] = useSearchParams()
  const carrier = filters.get('carrier') ?? ''
  const status = filters.get('status') ?? ''
  const audience = filters.get('audience') ?? ''
  const selectedCarrier = serviceCarriers.find((value) => value === carrier) ?? ''
  const selectedStatus = serviceStatuses.find((value) => value === status) ?? ''
  const selectedAudience = audienceOptions.find((value) => value === audience) ?? ''

  const visible = stationServices.filter((service) =>
    (!selectedCarrier || service.carrier === selectedCarrier) &&
    (!selectedStatus || service.status === selectedStatus) &&
    appliesToAudience(service, selectedAudience),
  )

  function changeFilter(key: string, value: string) {
    const next = new URLSearchParams(filters)
    if (value) next.set(key, value)
    else next.delete(key)
    setFilters(next, { replace: true })
  }

  return (
    <div className="page">
      <PageHeading
        eyebrow="Customer & fleet"
        title="Station and Energy Services Explorer"
        description="Compare service concepts for a corridor stop, a fleet depot and a neighbourhood site."
      />

      <section className={styles.scenarioBar} aria-label="Catalogue scope">
        <Route size={23} aria-hidden="true" />
        <div>
          <strong>Illustrative scenario · Fictional locations</strong>
          <p>Availability, prices and vehicle profiles apply to this academic demo.</p>
        </div>
      </section>

      <section className={styles.finder} aria-labelledby="filter-heading">
        <div className={styles.filterHeading}>
          <Filter size={18} aria-hidden="true" />
          <h2 id="filter-heading">Filter services</h2>
        </div>
        <div className={styles.filters}>
          <label>
            Energy carrier
            <select value={selectedCarrier} onChange={(event) => changeFilter('carrier', event.target.value)}>
              <option value="">All carriers</option>
              {serviceCarriers.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Service status
            <select value={selectedStatus} onChange={(event) => changeFilter('status', event.target.value)}>
              <option value="">All statuses</option>
              {serviceStatuses.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Customer
            <select value={selectedAudience} onChange={(event) => changeFilter('audience', event.target.value)}>
              <option value="">All customers</option>
              {audienceOptions.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <button
            type="button"
            className="button button-secondary"
            disabled={!selectedCarrier && !selectedStatus && !selectedAudience}
            onClick={() => setFilters({}, { replace: true })}
          >
            Clear filters
          </button>
        </div>
      </section>

      <p className={styles.resultCount} role="status">
        {visible.length} {visible.length === 1 ? 'service' : 'services'} in this scenario
      </p>

      {visible.length === 0 && (
        <section className={styles.empty}>
          <h2>No matching services</h2>
          <p>Clear the filters or choose another carrier, status or customer.</p>
        </section>
      )}

      <div className={styles.locationList}>
        {stations.map((station) => {
          const stationOffers = visible.filter((service) => service.stationId === station.id)
          if (stationOffers.length === 0) return null

          return (
            <section className={styles.location} key={station.id} aria-labelledby={station.id}>
              <div className={styles.locationHead}>
                <MapPin size={20} aria-hidden="true" />
                <div>
                  <p className={styles.locationKind}>{station.archetype} · Fictional</p>
                  <h2 id={station.id}>{station.title}</h2>
                  <p>{station.description}</p>
                </div>
              </div>
              <div className={styles.offerGrid}>
                {stationOffers.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function ServiceCard({ service }: { service: StationService }) {
  const CarrierIcon = service.carrier === 'Electricity' ? BatteryCharging : Fuel
  const useCase = service.audience === 'Both' ? 'Drivers and fleets' : service.audience

  return (
    <article className={styles.offer}>
      <div className={styles.offerTop}>
        <span className={styles.offerIcon}><CarrierIcon size={20} aria-hidden="true" /></span>
        <ServiceStatusChip status={service.status} />
      </div>
      <p className={styles.offerCarrier}>{service.carrier} · {useCase}</p>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <dl className={styles.offerFacts}>
        <div><dt>Price basis</dt><dd><DatumValue datum={service.priceBasis} /></dd></div>
        {service.chargerPowerKw && (
          <div><dt>Connector power</dt><dd><DatumValue datum={service.chargerPowerKw} unit="kW" /></dd></div>
        )}
        <div><dt>Vehicle fit</dt><dd>{service.compatibility}</dd></div>
      </dl>
      <div className={styles.offerActions}>
        <EvidenceBadge type={service.evidenceType} />
        <Link
          className={service.journeyMode === 'Explore only' ? 'button button-secondary' : 'button'}
          to={`/mobility/journey?service=${service.id}`}
        >
          {service.journeyMode === 'Request' ? 'Open fleet demo'
            : service.journeyMode === 'Reservation' ? 'Open charging demo'
              : 'Review service'}
        </Link>
      </div>
    </article>
  )
}
