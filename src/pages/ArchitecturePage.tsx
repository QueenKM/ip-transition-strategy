import {
  ArrowDownRight, ArrowRight, BrainCircuit, Building2, ClipboardCheck, DatabaseZap, Factory, Gauge,
  Layers3, Network, PlugZap, RotateCcw, ShieldCheck, Smartphone, Truck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { routes } from '../app/routes'
import { EvidenceBadge, RecordSources } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import { architectureConnections, architectureNodes } from '../data/architecture'
import type { ArchitectureConnection, ArchitectureNode } from '../models/strategy'
import styles from './SystemPages.module.css'

const nodeIcons = {
  Refining: Factory,
  Station: Building2,
  Charging: Gauge,
  Customer: Smartphone,
  Fleet: Truck,
  Analytics: DatabaseZap,
  Management: Layers3,
}

type ConnectionFilter = 'All' | ArchitectureConnection['status']

const connectionFilters: readonly ConnectionFilter[] = ['All', 'Existing', 'Required', 'Future']

interface LandscapeLayer {
  title: string
  icon: LucideIcon
  items: readonly {
    title: string
    description: string
    tone?: 'fuel' | 'electric' | 'conceptual' | 'governance'
  }[]
}

const layers: readonly LandscapeLayer[] = [
  {
    title: 'Physical energy layer',
    icon: PlugZap,
    items: [
      { title: 'Liquid fuels', description: 'Refinery output and sourced products for eligible channels.', tone: 'fuel' },
      { title: 'Electricity', description: 'Procurement, grid connection and assessed on-site supply.', tone: 'electric' },
    ],
  },
  {
    title: 'Operations & distribution',
    icon: Factory,
    items: [
      { title: 'Refining and logistics', description: 'Operating performance, product quality and supply windows.', tone: 'fuel' },
      { title: 'Stations and charging', description: 'Forecourt services, connector status and service delivery.', tone: 'electric' },
    ],
  },
  {
    title: 'Customer / fleet services',
    icon: Smartphone,
    items: [
      { title: 'Customer channels', description: 'Discover compatible services and check availability.' },
      { title: 'Fleet portal', description: 'Confirm eligibility, request services and track fulfilment.' },
    ],
  },
  {
    title: 'Data & analytics',
    icon: DatabaseZap,
    items: [
      { title: 'Evidence and metrics', description: 'Validate provenance and aggregate permitted operating and demand records.' },
    ],
  },
  {
    title: 'Strategy control',
    icon: ClipboardCheck,
    items: [
      { title: 'Management dashboard', description: 'Review portfolio risks, KPI boundaries and evidence at the decision gate.' },
      { title: 'Conceptual AI-assisted decision support', description: 'Evidence synthesis, scenario and portfolio comparison, and evidence gap detection. Human-governed.', tone: 'conceptual' },
    ],
  },
  {
    title: 'Human governance',
    icon: ShieldCheck,
    items: [
      { title: 'Accountable decision owner', description: 'Approve, review or stop an initiative and record the rationale.', tone: 'governance' },
    ],
  },
]

function ArchitectureLandscape() {
  return (
    <figure className={styles.flow}>
      <figcaption className={styles.flowHeading}>
        <span>From energy supply to investment review</span>
        <span className={styles.status} data-status="Future"><Network size={14} aria-hidden="true" /> Conceptual model</span>
      </figcaption>
      <ol className={styles.layers}>
        {layers.map(({ title, icon: Icon, items }) => (
          <li key={title} className={styles.layer}>
            <div className={styles.layerLabel}>
              <span className={styles.layerIcon}><Icon size={18} aria-hidden="true" /></span>
              <strong>{title}</strong>
              <ArrowDownRight className={styles.layerArrow} size={14} aria-hidden="true" />
            </div>
            <div className={styles.layerItems} data-wide={items.length === 1}>
              {items.map((item) => (
                <div key={item.title} className={styles.layerItem} data-tone={item.tone}>
                  <strong>
                    {item.tone === 'conceptual' && <BrainCircuit className={styles.conceptIcon} size={15} aria-hidden="true" />}
                    {item.title}
                  </strong>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <p className={styles.feedback}><RotateCcw size={16} aria-hidden="true" />
        <span>Review decisions return to refining and distribution owners.</span>
      </p>
    </figure>
  )
}

function ArchitectureSystem({ node }: { node: ArchitectureNode }) {
  const Icon = nodeIcons[node.kind]
  return (
    <article className={styles.node}>
      <div className={styles.nodeHeading}>
        <span className={styles.iconTile}><Icon size={20} aria-hidden="true" /></span>
        <span className={styles.status} data-status={node.status}>{node.status}</span>
      </div>
      <h3>{node.title}</h3>
      <p>{node.description}</p>
      <p className={styles.owner}>{node.owner}</p>
      <EvidenceBadge type={node.evidenceType} />
      <RecordSources record={node} />
    </article>
  )
}

function nodeName(id: string) {
  return architectureNodes.find((node) => node.id === id)?.title ?? 'No data'
}

export default function ArchitecturePage() {
  const [filter, setFilter] = useState<ConnectionFilter>('All')
  const connections = architectureConnections.filter(({ status }) => filter === 'All' || status === filter)

  return (
    <div className={`page ${styles.darkPage}`}>
      <PageHeading eyebrow="Strategy control" title="Architecture and Data Flow"
        description="The proposed operating model connects product supply and station services with decisions on where to invest." />
      <ArchitectureLandscape />
      <section className={styles.systems} aria-labelledby="systems-heading">
        <div className={styles.sectionHead}><h2 id="systems-heading">Systems and responsibilities</h2><p>Open a source to check the scope of a documented capability or the basis for a proposed system.</p></div>
        <div className={styles.nodes}>{architectureNodes.map((node) => <ArchitectureSystem key={node.id} node={node} />)}</div>
      </section>
      <section className={styles.systems} aria-labelledby="connection-heading">
        <div className={styles.sectionHead}><h2 id="connection-heading">Integration register</h2><p>Existing records document product interactions. Required and Future describe proposed interfaces.</p></div>
        <div className={styles.registerTools}>
          <div className={styles.filter} role="group" aria-label="Connection status">
            {connectionFilters.map((value) => (
              <button key={value} type="button" className={styles.filterButton}
                aria-controls="architecture-connections"
                onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}</button>
            ))}
          </div>
          <p className={styles.resultCount} aria-live="polite">
            {connections.length} {connections.length === 1 ? 'connection' : 'connections'}
          </p>
        </div>
        <div className={styles.connectionList} id="architecture-connections">
          {connections.length === 0 && <p className={styles.connection}><strong>No data.</strong> Connections are unavailable for this status.</p>}
          {connections.map((connection) => (
            <article key={connection.id} className={styles.connection}>
              <div>
                <span className={styles.status} data-status={connection.status}>{connection.status}</span>
                <h3>{connection.title}</h3>
                <p className={styles.connectionRoute}>{nodeName(connection.fromNodeId)} <ArrowRight size={14} aria-hidden="true" /><span className="sr-only"> to </span> {nodeName(connection.toNodeId)}</p>
              </div>
              <div>
                <p>{connection.description}</p>
                <p className={styles.exchange}>{connection.dataExchanged}</p>
                <p className={styles.owner}>{connection.owner}</p>
                <EvidenceBadge type={connection.evidenceType} />
                <RecordSources record={connection} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <p className={styles.followLink}><Link to={routes.gate}>Review the investment decision gate <ArrowRight size={16} aria-hidden="true" /></Link></p>
    </div>
  )
}
