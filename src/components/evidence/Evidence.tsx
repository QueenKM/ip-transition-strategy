import { Link } from 'react-router'
import { evidence } from '../../data/evidence'
import { sources } from '../../data/sources'
import type {
  Datum, EvidenceType, GateRecommendation, RecordMeta, ServiceStatus, SourceRef,
} from '../../models/strategy'
import { formatDatum } from '../../utils/formatDatum'
import styles from './Evidence.module.css'

const evidenceTones: Record<EvidenceType, string> = {
  'VERIFIED FACT': 'verified',
  'TEAM INPUT': 'proposed',
  'STRATEGIC RECOMMENDATION': 'proposed',
  ASSUMPTION: 'review',
  'ILLUSTRATIVE OR MODELLED VALUE': 'illustrative',
  'NO DATA': 'unknown',
}

const serviceTones: Record<ServiceStatus, string> = {
  Available: 'verified',
  Pilot: 'review',
  Planned: 'proposed',
  'Under assessment': 'review',
  'No data': 'unknown',
}

const decisionTones: Record<GateRecommendation, string> = {
  Scale: 'verified',
  Pilot: 'proposed',
  Monitor: 'review',
  Defer: 'blocker',
  'Insufficient evidence': 'unknown',
}

function Badge({ label, tone }: { label: string; tone: string }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{label}</span>
}

export function EvidenceBadge({ type }: { type: EvidenceType }) {
  return <Badge label={type === 'NO DATA' ? 'No data' : type} tone={evidenceTones[type]} />
}

export function ServiceStatusChip({ status }: { status: ServiceStatus }) {
  return <Badge label={status} tone={serviceTones[status]} />
}

export function DecisionBadge({ recommendation }: { recommendation: GateRecommendation }) {
  return <Badge label={recommendation} tone={decisionTones[recommendation]} />
}

export function DatumValue({ datum, unit }: { datum: Datum<string | number>; unit?: string }) {
  return <span className={datum.value === null ? styles.missing : undefined}>{formatDatum(datum, unit)}</span>
}

function SourceCitation({ reference }: { reference: SourceRef }) {
  const source = sources.find(({ id }) => id === reference.sourceId)
  if (!source) return <span>No data</span>

  return (
    <>
      {source.url ? (
        <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
      ) : <span>{source.title}</span>}
      {reference.locator && <> · {reference.locator}</>}
      {source.fileName && <small className={styles.fileName}>{source.fileName}</small>}
    </>
  )
}

type SourceRecord = Pick<RecordMeta<string>, 'source' | 'evidenceIds'>

export function RecordSources({ record }: { record: SourceRecord }) {
  if (!record.source.length && !record.evidenceIds.length) return null

  return (
    <details className={styles.sources}>
      <summary>Sources and evidence</summary>
      <ul>
        {record.source.map((reference) => (
          <li key={`${reference.sourceId}:${reference.locator}`}><SourceCitation reference={reference} /></li>
        ))}
        {record.evidenceIds.map((id) => (
          <li key={id}>
            <Link to={`/strategy/evidence?tab=evidence&focus=${encodeURIComponent(id)}`}>
              {id} · {evidence.find((item) => item.id === id)?.title ?? 'Evidence record'}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  )
}
