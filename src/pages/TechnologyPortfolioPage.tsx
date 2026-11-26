import { ArrowUpRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { routes } from '../app/routes'
import { DatumValue, EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import styles from '../components/strategy/PortfolioRoadmap.module.css'
import { StrategyRecordLinks } from '../components/strategy/StrategyRecordLinks'
import { initiatives } from '../data/initiatives'
import { risks } from '../data/risks'
import { technologies } from '../data/technologies'
import type { AssessmentDimension, Horizon, PortfolioPriority, TechnologyOption } from '../models/strategy'

const priorities: readonly PortfolioPriority[] = ['Start now', 'Pilot', 'Monitor', 'Defer', 'Exclude']
const horizons: readonly Horizon[] = ['0–3 years', '3–7 years', '7–15+ years']
const investmentOptions = ['Low', 'Medium', 'High', 'No data'] as const
const ratingLabels: readonly [AssessmentDimension, string][] = [
  ['strategicFit', 'Strategic fit'],
  ['demandVisibility', 'Demand visibility'],
  ['infrastructureDependency', 'Infrastructure dependency'],
  ['regulatorySupport', 'Regulatory support'],
  ['existingAssetUse', 'Potential use of existing assets'],
  ['integration', 'Refining–Distribution integration'],
  ['implementationRisk', 'Implementation risk'],
]

function TechnologyCard({ technology }: { technology: TechnologyOption }) {
  const relatedInitiatives = initiatives.filter(({ id }) => technology.initiativeIds.includes(id))
  const relatedRisks = risks.filter(({ id }) => technology.riskIds.includes(id))

  return (
    <article className={`panel ${styles.technologyCard}`} aria-labelledby={`${technology.id}-title`}>
      <div className={styles.cardHeader}>
        <span className="tag">{technology.status}</span>
        <EvidenceBadge type={technology.evidenceType} />
      </div>
      <h2 id={`${technology.id}-title`}>{technology.title}</h2>
      <p>{technology.description}</p>
      <dl className={styles.metricGrid}>
        <div>
          <dt>Industry maturity</dt>
          <dd><DatumValue datum={technology.industryMaturity} /></dd>
        </div>
        <div>
          <dt>IP readiness</dt>
          <dd><DatumValue datum={technology.ipReadiness} /></dd>
        </div>
        <div>
          <dt>Proposed horizon</dt>
          <dd>{technology.timeHorizon ?? 'No data'}</dd>
        </div>
        <div>
          <dt>Indicative investment intensity</dt>
          <dd><DatumValue datum={technology.investmentIntensity} /></dd>
        </div>
      </dl>
      <p>{technology.rationale}</p>
      <dl className={styles.cardContext}>
        <div>
          <dt>Dependencies</dt>
          <dd><StrategyRecordLinks records={technology.dependencies} /></dd>
        </div>
        <div>
          <dt>Key risks</dt>
          <dd>
            {relatedRisks.length ? (
              <ul className={styles.list}>
                {relatedRisks.map((risk) => <li key={risk.id}>{risk.title}</li>)}
              </ul>
            ) : 'No data'}
          </dd>
        </div>
      </dl>
      <details>
        <summary>Assessment and evidence</summary>
        <dl className={styles.detailGrid}>
          {ratingLabels.map(([key, label]) => {
            const rating = technology.ratings[key]

            return (
              <div key={key}>
                <dt>{label}</dt>
                <dd>{rating ? <DatumValue datum={rating} /> : 'No data'}</dd>
              </div>
            )
          })}
          <div>
            <dt>Proposed owner</dt>
            <dd>{technology.owner ?? 'No data'}</dd>
          </div>
        </dl>
        {relatedInitiatives.map((initiative) => (
          <dl className={styles.initiativeContext} key={initiative.id}>
            <div><dt>Demand driver</dt><dd>{initiative.demandDriver}</dd></div>
            <div><dt>Potential asset fit</dt><dd>{initiative.assetFit}</dd></div>
            <div><dt>Investment logic</dt><dd>{initiative.businessRationale}</dd></div>
            <div><dt>Refining–Distribution link</dt><dd>{initiative.integration}</dd></div>
          </dl>
        ))}
        <RecordSources record={technology} />
      </details>
      {relatedInitiatives.length > 0 && (
        <div className={styles.cardAction}>
          {relatedInitiatives.map((initiative) => (
            <Link
              className="button button-secondary"
              key={initiative.id}
              to={`${routes.gate}?initiative=${encodeURIComponent(initiative.id)}`}
              aria-label={`Review investment gate for ${initiative.title}`}
            >
              {relatedInitiatives.length > 1 ? initiative.title : 'Review investment gate'}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}

export default function TechnologyPortfolioPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const priority = priorities.find((option) => option === searchParams.get('priority')) ?? ''
  const horizon = horizons.find((option) => option === searchParams.get('horizon')) ?? ''
  const investment = investmentOptions.find((option) => option === searchParams.get('investment')) ?? ''
  const searchTerm = query.trim().toLowerCase()
  const filtered = technologies.filter((technology) => {
    const searchableText = `${technology.title} ${technology.description} ${technology.rationale}`.toLowerCase()

    return searchableText.includes(searchTerm)
      && (!priority || technology.status === priority)
      && (!horizon || technology.timeHorizon === horizon)
      && (!investment || (technology.investmentIntensity.value ?? 'No data') === investment)
  })

  function updateFilter(key: string, value: string) {
    const updated = new URLSearchParams(searchParams)
    if (value) updated.set(key, value)
    else updated.delete(key)
    setSearchParams(updated, { replace: true })
  }

  return (
    <div className="page stack">
      <PageHeading
        eyebrow="Strategy control"
        title="Technology Portfolio"
        description="Compare proposed priorities with industry maturity, IP readiness and the conditions for investment."
      >
        <Link className="button button-secondary" to={`${routes.evidence}?tab=evidence`}>Open evidence register</Link>
      </PageHeading>

      <section className={`panel ${styles.filters}`} aria-label="Filter technology options">
        <label className={styles.field}>
          Search options
          <input
            type="search"
            placeholder="e.g. charging, heat recovery"
            value={query}
            onChange={(event) => updateFilter('q', event.target.value)}
          />
        </label>
        <label className={styles.field}>
          Priority
          <select value={priority} onChange={(event) => updateFilter('priority', event.target.value)}>
            <option value="">All priorities</option>
            {priorities.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          Horizon
          <select value={horizon} onChange={(event) => updateFilter('horizon', event.target.value)}>
            <option value="">All horizons</option>
            {horizons.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          Investment intensity
          <select value={investment} onChange={(event) => updateFilter('investment', event.target.value)}>
            <option value="">All levels</option>
            {investmentOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </section>

      <div className={styles.resultBar}>
        <p role="status" className="muted">{filtered.length} of {technologies.length} options shown</p>
        {(query || horizon || priority || investment) && (
          <button type="button" className="button button-secondary" onClick={() => setSearchParams({}, { replace: true })}>
            Clear filters
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className={styles.portfolioGrid}>
          {filtered.map((technology) => <TechnologyCard key={technology.id} technology={technology} />)}
        </div>
      ) : (
        <p className="panel">No options match the selected filters.</p>
      )}
    </div>
  )
}
