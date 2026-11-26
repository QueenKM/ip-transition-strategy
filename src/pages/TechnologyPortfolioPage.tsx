import { ArrowUpRight, ChevronDown, LayoutGrid, List, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { routes, workstreamPath } from '../app/routes'
import { DatumValue, EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import styles from '../components/strategy/PortfolioRoadmap.module.css'
import { StrategyRecordLinks } from '../components/strategy/StrategyRecordLinks'
import { initiatives } from '../data/initiatives'
import { gates } from '../data/gates'
import { risks } from '../data/risks'
import { technologies } from '../data/technologies'
import { workstreams } from '../data/workstreams'
import type { AssessmentDimension, Horizon, PortfolioPriority, TechnologyOption, WorkstreamId } from '../models/strategy'

const priorities: readonly PortfolioPriority[] = ['Start now', 'Pilot', 'Monitor', 'Defer', 'Exclude']
const horizons: readonly Horizon[] = ['0–3 years', '3–7 years', '7–15+ years']
const investmentOptions = ['Low', 'Medium', 'High', 'No data'] as const
const filterKeys = ['q', 'priority', 'horizon', 'investment'] as const
const ratingLabels: readonly [AssessmentDimension, string][] = [
  ['strategicFit', 'Strategic fit'],
  ['demandVisibility', 'Demand visibility'],
  ['infrastructureDependency', 'Infrastructure dependency'],
  ['regulatorySupport', 'Regulatory support'],
  ['existingAssetUse', 'Potential use of existing assets'],
  ['integration', 'Refining–Distribution integration'],
  ['implementationRisk', 'Implementation risk'],
]

function PriorityChip({ priority }: { priority: PortfolioPriority }) {
  return <span className={styles.priorityChip} data-priority={priority}>{priority}</span>
}

function teamContext(technology: TechnologyOption, workstreamIds: readonly WorkstreamId[]) {
  return workstreams.filter((stream) => workstreamIds.includes(stream.workstreamId)).map((stream) => {
    const topics = stream.topics.filter((topic) => topic.affectedRecords.some((record) => (
      record.kind === 'technology' && record.id === technology.id
    )))
    return { stream, topics: stream.validated ? topics : [], relevant: topics.length > 0 }
  })
}

function PortfolioInputs({ technology }: { technology: TechnologyOption }) {
  const contributors = teamContext(technology, [3, 5]).filter((item) => item.relevant)
  const economics = teamContext(technology, [6])[0]
  const integration = teamContext(technology, [7])[0]
  const caseEconomics = economics?.topics.find((topic) => topic.finding)
  const readyTiming = caseEconomics && contributors.every(({ topics }) => topics.some((topic) => topic.finding || topic.timing))
    ? integration?.topics.find((topic) => topic.timing)?.timing
    : undefined
  const participants = [...contributors.map(({ stream }) => `W${stream.workstreamId}`), 'W6', 'W7'].join(' + ')
  return (
    <dl className={styles.teamAssessment}>
      <div>
        <dt>Team recommendation</dt>
        <dd>{contributors.map(({ stream, topics }) => {
          const findings = topics.filter((topic) => topic.finding || topic.priority || topic.rationale)
          return <p key={stream.id}><Link to={workstreamPath(stream.workstreamId)}>W{stream.workstreamId}</Link> · {findings.length ? findings.map((topic) => topic.finding ?? topic.priority ?? topic.rationale).join(' / ') : 'No data · awaiting validated input'}</p>
        })}</dd>
      </div>
      <div>
        <dt>Investment economics</dt>
        <dd><Link to={workstreamPath(6)}>W6</Link> · {caseEconomics?.finding ?? 'No data'}</dd>
      </div>
      <div>
        <dt>Integrated timing</dt>
        <dd>{readyTiming ?? `No data · pending ${participants}`} <Link to={workstreamPath(7)} aria-label="Review Workstream 7 integration">↗</Link></dd>
      </div>
    </dl>
  )
}

function IndustryContext({ technology }: { technology: TechnologyOption }) {
  const documented = gates.flatMap((gate) => technology.initiativeIds.includes(gate.initiativeId) ? gate.checks : [])
    .find((check) => check.id === 'technologyMaturity' && check.finding.evidenceType === 'VERIFIED FACT')
  return (
    <div className={styles.industryContext}>
      <strong>Market / technical context</strong>
      {documented?.finding.evidenceType === 'VERIFIED FACT' ? (
        <><EvidenceBadge type="VERIFIED FACT" /><p>{documented.rationale}</p><RecordSources record={{ source: [], evidenceIds: documented.finding.evidenceIds }} /></>
      ) : (
        <p>Verified industry maturity · No data. See the disclosed Part 7 assessment and its source references.</p>
      )}
    </div>
  )
}

function TechnologyCard({ technology }: { technology: TechnologyOption }) {
  const relatedInitiatives = initiatives.filter(({ id }) => technology.initiativeIds.includes(id))
  const relatedRisks = risks.filter(({ id }) => technology.riskIds.includes(id))
  const demandVisibility = technology.ratings.demandVisibility

  return (
    <article className={`panel ${styles.technologyCard}`} data-priority={technology.status} aria-labelledby={`${technology.id}-title`}>
      <header className={styles.technologyIntro}>
        <div className={styles.cardHeader}>
          <span className="tag">Assessment area</span>
        </div>
        <h2 id={`${technology.id}-title`}>{technology.title}</h2>
      </header>
      <IndustryContext technology={technology} />
      <PortfolioInputs technology={technology} />
      <p className={styles.rationale}><strong>IP deployment readiness</strong> <DatumValue datum={technology.ipReadiness} /></p>
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
      <details className={styles.assessment}>
        <summary aria-label="Part 7 draft assessment and evidence" aria-describedby={technology.dependencies.length ? `${technology.id}-dependency-count` : undefined}>
          <span>Part 7 draft assessment and evidence</span>
          <span className={styles.assessmentMeta}>
            {technology.dependencies.length > 0 && <span id={`${technology.id}-dependency-count`}>{technology.dependencies.length} dependencies</span>}
            <ChevronDown size={17} aria-hidden="true" />
          </span>
        </summary>
        <div className={styles.cardHeader}><PriorityChip priority={technology.status} /><EvidenceBadge type={technology.evidenceType} /></div>
        <dl className={styles.detailGrid}>
          <div><dt>Draft horizon</dt><dd>{technology.timeHorizon ?? 'No data'}</dd></div>
          <div><dt>Indicative intensity</dt><dd><DatumValue datum={technology.investmentIntensity} /></dd></div>
          <div><dt>Draft industry assessment</dt><dd><DatumValue datum={technology.industryMaturity} /></dd></div>
          <div><dt>Demand driver</dt><dd>{relatedInitiatives.map((initiative) => <p key={initiative.id}>{initiative.demandDriver}</p>)}</dd></div>
          <div><dt>Demand visibility</dt><dd>{demandVisibility ? <DatumValue datum={demandVisibility} /> : 'No data'}</dd></div>
          <div><dt>Proposed next action</dt><dd>{technology.rationale}</dd></div>
        </dl>
        <p className={styles.assessmentDescription}>{technology.description}</p>
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
            <div><dt>Potential asset fit</dt><dd>{initiative.assetFit}</dd></div>
            <div><dt>Investment logic</dt><dd>{initiative.businessRationale}</dd></div>
            <div><dt>Refining–Distribution link</dt><dd>{initiative.integration}</dd></div>
          </dl>
        ))}
        <RecordSources record={technology} />
      </details>
    </article>
  )
}

function PortfolioComparison({ options }: { options: readonly TechnologyOption[] }) {
  return (
    <div className={styles.comparison} tabIndex={0} role="region" aria-label="Technology comparison table">
      <table>
        <caption className="sr-only">Compare filtered options and Part 7 draft assessments</caption>
        <thead>
          <tr>
            <th scope="col">Technology</th>
            <th scope="col">Part 7 draft priority</th>
            <th scope="col">Part 7 draft horizon</th>
            <th scope="col">Part 7 indicative intensity</th>
            <th scope="col">Market / technical context</th>
            <th scope="col">IP readiness</th>
            <th scope="col">Validated team inputs</th>
            <th scope="col">Dependencies and risk</th>
            <th scope="col">Investment gate</th>
          </tr>
        </thead>
        <tbody>
          {options.map((technology) => {
            const relatedInitiatives = initiatives.filter(({ id }) => technology.initiativeIds.includes(id))

            return (
              <tr key={technology.id}>
                <th scope="row">
                  {technology.title}
                  <div className={styles.tableEvidence}><EvidenceBadge type={technology.evidenceType} /></div>
                </th>
                <td><PriorityChip priority={technology.status} /></td>
                <td>{technology.timeHorizon ?? 'No data'}</td>
                <td><DatumValue datum={technology.investmentIntensity} /></td>
                <td><IndustryContext technology={technology} /></td>
                <td><DatumValue datum={technology.ipReadiness} /></td>
                <td><PortfolioInputs technology={technology} /></td>
                <td>
                  <p>
                    <span className="muted">Implementation risk · </span>
                    {technology.ratings.implementationRisk ? <DatumValue datum={technology.ratings.implementationRisk} /> : 'No data'}
                  </p>
                  {technology.dependencies.length > 0 && (
                    <details className={styles.tableDependencies}>
                      <summary>{technology.dependencies.length} dependencies</summary>
                      <StrategyRecordLinks records={technology.dependencies} />
                    </details>
                  )}
                </td>
                <td>
                  {relatedInitiatives.map((initiative) => (
                    <Link
                      className={styles.tableAction}
                      key={initiative.id}
                      to={`${routes.gate}?initiative=${encodeURIComponent(initiative.id)}`}
                      aria-label={`Review investment gate for ${initiative.title}`}
                    >
                      Review <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  ))}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function TechnologyPortfolioPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const priority = priorities.find((option) => option === searchParams.get('priority')) ?? ''
  const horizon = horizons.find((option) => option === searchParams.get('horizon')) ?? ''
  const investment = investmentOptions.find((option) => option === searchParams.get('investment')) ?? ''
  const isComparing = searchParams.get('view') === 'compare'
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

  function clearFilters() {
    const updated = new URLSearchParams(searchParams)
    filterKeys.forEach((key) => updated.delete(key))
    setSearchParams(updated, { replace: true })
  }

  return (
    <div className={`page stack ${styles.portfolioPage}`}>
      <PageHeading
        eyebrow="Strategy control"
        title="Technology Portfolio"
        description="Compare assessment areas, published technical context and validated team inputs. Draft filters refer to the Part 7 framework."
      >
        <Link className="button button-secondary" to={`${routes.evidence}?tab=evidence`}>
          Open evidence register <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </PageHeading>

      <section className={`panel ${styles.filters}`} aria-label="Filter technology options">
        <label className={styles.field}>
          Search options
          <span className={styles.searchField}>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="e.g. charging, heat recovery"
              value={query}
              onChange={(event) => updateFilter('q', event.target.value)}
            />
          </span>
        </label>
        <label className={styles.field}>
          Draft priority
          <select value={priority} onChange={(event) => updateFilter('priority', event.target.value)}>
            <option value="">All priorities</option>
            {priorities.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          Draft horizon
          <select value={horizon} onChange={(event) => updateFilter('horizon', event.target.value)}>
            <option value="">All horizons</option>
            {horizons.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          Draft investment intensity
          <select value={investment} onChange={(event) => updateFilter('investment', event.target.value)}>
            <option value="">All levels</option>
            {investmentOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </section>

      <div className={styles.resultBar}>
        <div className={styles.resultSummary}>
          <p role="status" className="muted">{filtered.length} of {technologies.length} options shown</p>
          {(query || horizon || priority || investment) && (
            <button type="button" className={styles.clearButton} onClick={clearFilters}>Clear filters</button>
          )}
        </div>
        <div className={styles.viewSwitch} role="group" aria-label="Portfolio view">
          <button type="button" aria-pressed={!isComparing} onClick={() => updateFilter('view', '')}>
            <LayoutGrid size={16} aria-hidden="true" /> Cards
          </button>
          <button type="button" aria-pressed={isComparing} onClick={() => updateFilter('view', 'compare')}>
            <List size={17} aria-hidden="true" /> Compare
          </button>
        </div>
      </div>

      {filtered.length === 0 && <p className="panel">No options match the selected filters.</p>}
      {filtered.length > 0 && isComparing && <PortfolioComparison options={filtered} />}
      {filtered.length > 0 && !isComparing && (
        <div className={styles.portfolioGrid}>
          {filtered.map((technology) => <TechnologyCard key={technology.id} technology={technology} />)}
        </div>
      )}
    </div>
  )
}
