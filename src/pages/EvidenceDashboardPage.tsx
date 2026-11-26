import { useState } from 'react'
import { ClipboardList, Database, FileCheck, LibraryBig, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { routes, workstreamPath } from '../app/routes'
import { DatumValue, EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { WorkstreamInputs } from '../components/evidence/WorkstreamInputs'
import { PageHeading } from '../components/layout/PageHeading'
import { evidence } from '../data/evidence'
import { kpis } from '../data/kpis'
import { sources } from '../data/sources'
import { teamContributions } from '../data/team'
import type { EvidenceType, KPI, SourceRef, TeamContribution } from '../models/strategy'
import styles from './StrategyControlDetails.module.css'

const tabs = [
  { id: 'kpis', title: 'KPIs', icon: Database },
  { id: 'evidence', title: 'Evidence register', icon: LibraryBig },
  { id: 'team-inputs', title: 'Team input register', icon: ClipboardList },
] as const

type TabId = (typeof tabs)[number]['id']

const evidenceTypes: readonly EvidenceType[] = [
  'VERIFIED FACT',
  'TEAM INPUT',
  'STRATEGIC RECOMMENDATION',
  'ASSUMPTION',
  'ILLUSTRATIVE OR MODELLED VALUE',
  'NO DATA',
]

function dataType(value: string): EvidenceType | 'all' {
  return evidenceTypes.find((item) => item === value) ?? 'all'
}

function ProvenanceLinks({ ids, onNavigate }: { ids: readonly string[]; onNavigate: () => void }) {
  if (!ids.length) {
    return <span className="muted">No data</span>
  }

  return (
    <ul className={styles.referenceList}>
      {ids.map((id) => (
        <li key={id}>
          <Link to={`/strategy/evidence?tab=evidence&focus=${encodeURIComponent(id)}`} onClick={onNavigate}>
            {id} · {evidence.find((item) => item.id === id)?.title ?? id}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function LeadSource({ reference }: { reference: SourceRef | undefined }) {
  const source = sources.find((entry) => entry.id === reference?.sourceId)
  if (!source) return null

  return (
    <p className={styles.leadSource}>
      {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> : source.title}
      {reference?.locator && <span> · {reference.locator}</span>}
    </p>
  )
}

function KpiCard({ item, onNavigate }: { item: KPI; onNavigate: () => void }) {
  const period = item.current.value === null ? null : item.current.period
  const lastUpdated = item.current.value === null ? null : item.current.lastUpdated
  const inputRequestIds = [item.current, item.baseline, item.target].flatMap(
    (datum) => datum.value === null ? datum.inputRequestIds : [],
  )

  return (
    <article className={`panel ${styles.kpiCard}`} data-evidence={item.current.evidenceType}>
      <div className={styles.cardHeader}>
        <h2>{item.title}</h2>
        <EvidenceBadge type={item.current.evidenceType} />
      </div>
      <p>{item.definition}</p>
      <dl className={styles.measurements}>
        <div className={styles.primaryMeasurement}><dt>Current value</dt><dd><DatumValue datum={item.current} unit={item.unit} /></dd></div>
        <div><dt>Baseline</dt><dd><DatumValue datum={item.baseline} unit={item.unit} /></dd></div>
        <div><dt>Target</dt><dd><DatumValue datum={item.target} unit={item.unit} /></dd></div>
      </dl>
      <div className={styles.provenanceBlock}>
        <h3><FileCheck size={16} aria-hidden="true" /> Measurement source</h3>
        <p>{item.expectedDataSource}</p>
        <div>
          <p className={styles.provenanceLabel}>Current value provenance</p>
          <ProvenanceLinks ids={item.current.value === null ? [] : item.current.evidenceIds} onNavigate={onNavigate} />
        </div>
        {inputRequestIds.length > 0 && (
          <div className={styles.provenanceGap}>
            <p className={styles.provenanceLabel}>Input needed</p>
            <WorkstreamInputs requestIds={inputRequestIds} className={styles.referenceList} />
          </div>
        )}
      </div>
      <details className={styles.disclosure}>
        <summary>Measurement and provenance</summary>
        <dl className={styles.factList}>
          <div><dt>Definition status</dt><dd>{item.status}</dd></div>
          <div><dt>Unit</dt><dd>{item.unit}</dd></div>
          <div><dt>Boundary</dt><dd>{item.boundary}</dd></div>
          <div><dt>Owner</dt><dd>{item.owner ?? 'No data'}</dd></div>
          <div><dt>Frequency</dt><dd>{item.frequency}</dd></div>
          <div><dt>Reporting period</dt><dd>{period ?? 'No data'}</dd></div>
          <div><dt>Last updated</dt><dd>{lastUpdated ?? 'No data'}</dd></div>
        </dl>
        <RecordSources record={item} />
      </details>
    </article>
  )
}

function TeamCard({ item, onNavigate }: { item: TeamContribution; onNavigate: () => void }) {
  const openRequests = item.requests.filter((request) => request.status === 'Missing')
  const receivedRequests = item.requests.filter((request) => request.status !== 'Missing')

  return (
    <article className={`panel ${styles.recordCard}`} data-evidence={item.evidenceType}>
      <div className={styles.cardHeader}>
        <div>
          <p className="eyebrow">Workstream {item.workstream}</p>
          <h2>{item.title.replace(/^Workstream\s+\d+\s*(?:[·:–—-])\s*/i, '')}</h2>
        </div>
        <EvidenceBadge type={item.evidenceType} />
      </div>
      <p>{item.summary}</p>
      {openRequests.length > 0 && (
        <div className={styles.openInput}>
          <strong>[INPUT REQUIRED FROM WORKSTREAM {item.workstream}]</strong>
          <ul>
            {openRequests.map((request) => <li key={request.id}>{request.requirement}</li>)}
          </ul>
        </div>
      )}
      <dl className={styles.factList}>
        <div><dt>Owner</dt><dd>{item.owner ?? '[OWNER TBD]'}</dd></div>
        <div><dt>Input received</dt><dd>{item.inputReceived ? 'Yes' : 'No'}</dd></div>
        <div><dt>Last validated</dt><dd>{item.lastValidated ?? 'No data'}</dd></div>
        <div><dt>Date received</dt><dd>{item.dateReceived ?? 'No data'}</dd></div>
        <div><dt>Status</dt><dd>{item.status}</dd></div>
      </dl>
      <Link to={workstreamPath(item.workstreamId)}>Open Workstream {item.workstreamId}</Link>
      {receivedRequests.length > 0 && <details className={styles.disclosure}>
        <summary>Submitted inputs</summary>
        <dl className={styles.factList}>
          {receivedRequests.map((request) => <div key={request.id}>
            <dt>{request.label}</dt>
            <dd>
              <p>{request.status}</p>
              <ProvenanceLinks ids={request.evidenceIds} onNavigate={onNavigate} />
            </dd>
          </div>)}
        </dl>
      </details>}
      <details className={styles.disclosure}>
        <summary>Affected screens and open questions</summary>
        {item.affectedRoutes.length > 0 && <ul className={styles.referenceList}>
          {item.affectedRoutes.map((route) => <li key={route}><Link to={route}>{route}</Link></li>)}
        </ul>}
        {item.unresolvedQuestions.length > 0 && <ul>
          {item.unresolvedQuestions.map((question) => <li key={question}>{question}</li>)}
        </ul>}
        <RecordSources record={item} />
      </details>
    </article>
  )
}

export default function EvidenceDashboardPage() {
  const [query] = useSearchParams()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<EvidenceType | 'all'>('all')
  const requestedTab = query.get('tab')
  const activeTab: TabId = tabs.find((tab) => tab.id === requestedTab)?.id ?? 'kpis'
  const focus = query.get('focus')
  const needle = search.trim().toLocaleLowerCase()

  function clearFilters() {
    setSearch('')
    setFilter('all')
  }

  function matches(id: string, words: readonly string[], type: EvidenceType) {
    if (focus) return id === focus
    return (filter === 'all' || filter === type) && words.some((word) => word.toLocaleLowerCase().includes(needle))
  }

  const visibleKpis = kpis.filter((item) => matches(
    item.id,
    [item.title, item.definition, item.unit, item.owner ?? '', item.current.value?.toString() ?? 'No data'],
    item.current.evidenceType,
  )).sort((left, right) => Number(right.current.evidenceType === 'VERIFIED FACT')
    - Number(left.current.evidenceType === 'VERIFIED FACT'))
  const visibleEvidence = evidence.filter((item) => matches(
    item.id, [item.id, item.title, item.description, item.scope], item.evidenceType,
  ))
  const visibleTeams = teamContributions.filter((item) => matches(
    item.id, [item.title, item.description, `Workstream ${item.workstream}`], item.evidenceType,
  ))
  const count = activeTab === 'kpis' ? visibleKpis.length : activeTab === 'evidence' ? visibleEvidence.length : visibleTeams.length

  return (
    <div className={`page ${styles.evidencePage}`}>
      <PageHeading
        eyebrow="Strategy control"
        title="KPI and Evidence Dashboard"
        description="Review measurement boundaries, public verified context and the validated team inputs each decision requires."
      >
        <Link className="button-secondary" to={routes.workstreams}>Team input readiness</Link>
      </PageHeading>

      <nav className={styles.tabs} aria-label="Evidence dashboards">
        {tabs.map(({ id, title, icon: Icon }) => (
          <Link
            key={id}
            to={id === 'kpis' ? '/strategy/evidence' : `/strategy/evidence?tab=${id}`}
            aria-current={id === activeTab ? 'page' : undefined}
            className={id === activeTab ? styles.activeTab : undefined}
            onClick={clearFilters}
          >
            <Icon size={18} aria-hidden="true" />
            {title}
          </Link>
        ))}
      </nav>

      <section className={styles.content} aria-label={tabs.find((tab) => tab.id === activeTab)?.title}>
        <div className={styles.evidenceTools}>
          {!focus && <div className={styles.filterBar}>
            <label className={styles.searchField}>
              <span>Find a record</span>
              <span className={styles.searchInput}>
                <Search size={18} aria-hidden="true" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search records" />
              </span>
            </label>
            <label>
              <span>Evidence type</span>
              <select value={filter} onChange={(event) => setFilter(dataType(event.target.value))}>
                <option value="all">All evidence types</option>
                {evidenceTypes.map((type) => <option key={type} value={type}>{type === 'NO DATA' ? 'No data' : type}</option>)}
              </select>
            </label>
          </div>}
          <div className={styles.resultsLine}>
            <p aria-live="polite" className="muted">{count} {count === 1 ? 'record' : 'records'}</p>
            {focus && <Link to={`/strategy/evidence?tab=${activeTab}`} onClick={clearFilters}>Show all records</Link>}
            <details className={styles.evidenceLegend}>
              <summary>Evidence categories</summary>
              <ul>
                {evidenceTypes.map((type) => (
                  <li key={type}><EvidenceBadge type={type} /></li>
                ))}
              </ul>
            </details>
          </div>
        </div>

        {!count && <p className={`panel ${styles.empty}`}>
          {focus ? 'No data for the selected record.' : 'No records match the current filters.'}
        </p>}
        {activeTab === 'kpis' && <div className={styles.kpiGrid}>
          {visibleKpis.map((item) => <KpiCard key={item.id} item={item} onNavigate={clearFilters} />)}
        </div>}
        {activeTab === 'evidence' && <div className={styles.registerList}>
          {visibleEvidence.map((item) => (
            <article key={item.id} className={`panel ${styles.recordCard}`} data-evidence={item.evidenceType}>
              <div className={styles.cardHeader}>
                <div>
                  <p className="eyebrow">{item.id}</p>
                  <h2>{item.title}</h2>
                </div>
                <EvidenceBadge type={item.evidenceType} />
              </div>
              <p>{item.description}</p>
              <dl className={styles.factList}>
                <div><dt>Scope</dt><dd>{item.scope}</dd></div>
                <div><dt>Reporting period</dt><dd>{item.reportingPeriod ?? 'No data'}</dd></div>
                <div><dt>Evidence owner</dt><dd>{item.owner ?? 'No data'}</dd></div>
                <div><dt>Register updated</dt><dd>{item.lastUpdated ?? 'No data'}</dd></div>
                {item.caveat && <div><dt>Caveat</dt><dd>{item.caveat}</dd></div>}
                {item.impactOfGap && <div><dt>Effect of gap</dt><dd>{item.impactOfGap}</dd></div>}
              </dl>
              <div className={styles.provenanceBlock}>
                <h3><FileCheck size={16} aria-hidden="true" /> Source and evidence</h3>
                <LeadSource reference={item.source[0]} />
                {item.source.length || item.evidenceIds.length ? <RecordSources record={item} /> : <p className="muted">No data</p>}
                {item.inputRequestIds.length > 0 && (
                  <div className={styles.provenanceGap}>
                    <p className={styles.provenanceLabel}>Input needed</p>
                    <WorkstreamInputs requestIds={item.inputRequestIds} className={styles.referenceList} />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>}
        {activeTab === 'team-inputs' && <div className={styles.registerList}>
          {visibleTeams.map((item) => <TeamCard key={item.id} item={item} onNavigate={clearFilters} />)}
        </div>}
      </section>
    </div>
  )
}
