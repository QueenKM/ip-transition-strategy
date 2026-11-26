import { Building2, DatabaseZap, Factory, Gauge, Layers3, Smartphone, Truck } from 'lucide-react'
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

function ArchitectureSystem({ node }: { node: ArchitectureNode }) {
  const Icon = nodeIcons[node.kind]
  return (
    <article className={`panel ${styles.node}`}>
      <div>
        <span className={styles.iconTile}><Icon size={20} aria-hidden="true" /></span>
        <span className="tag">{node.status}</span>
      </div>
      <h3>{node.title}</h3>
      <p>{node.description}</p>
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
    <div className="page">
      <PageHeading eyebrow="Strategy control" title="Architecture and Data Flow"
        description="See how product records and service activity could move from operating systems into customer experiences and investment review." />
      <figure className={styles.flow}>
        <figcaption>Data flow for the proposed operating model</figcaption>
        <ol>
          <li><strong>Operating systems</strong><span>Refining, stations and charging hold distinct product and service records.</span></li>
          <li><strong>Mobility services</strong><span>A customer platform and fleet portal consume approved offers and generate service activity.</span></li>
          <li><strong>Analytics</strong><span>Validate provenance and aggregate demand, delivery and availability.</span></li>
          <li><strong>Human review</strong><span>Compare initiatives in the management dashboard against investment criteria.</span></li>
        </ol>
        <p>Management reviews the evidence and returns decisions to the operating teams.</p>
      </figure>
      <section className={styles.systems} aria-labelledby="systems-heading">
        <div className={styles.sectionHead}><h2 id="systems-heading">Systems and responsibilities</h2><p>Documented capabilities and proposed systems carry their own evidence labels.</p></div>
        <div className={styles.nodes}>{architectureNodes.map((node) => <ArchitectureSystem key={node.id} node={node} />)}</div>
      </section>
      <section className={styles.systems} aria-labelledby="connection-heading">
        <div className={styles.sectionHead}><h2 id="connection-heading">Integration register</h2><p>Existing connections require evidence of the specific interface. Required and future entries describe the design.</p></div>
        <div className={styles.filter} aria-label="Connection status">
          {connectionFilters.map((value) => (
            <button key={value} type="button" className={filter === value ? 'button' : 'button-secondary'}
              onClick={() => setFilter(value)} aria-pressed={filter === value}>{value}</button>
          ))}
        </div>
        <div className="stack" aria-live="polite">
          {connections.length === 0 && <p className="panel"><strong>No data.</strong> The register has no verified connection in this category.</p>}
          {connections.map((connection) => (
            <article key={connection.id} className={`panel ${styles.connection}`}>
              <div>
                <span className="tag">{connection.status}</span>
                <h3>{connection.title}</h3>
                <p className={styles.connectionRoute}>{nodeName(connection.fromNodeId)} <span aria-hidden="true">→</span><span className="sr-only"> to </span> {nodeName(connection.toNodeId)}</p>
              </div>
              <div>
                <p>{connection.description}</p>
                <p className="muted">{connection.dataExchanged}</p>
                <EvidenceBadge type={connection.evidenceType} />
                <RecordSources record={connection} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <p className={styles.followLink}><Link to={routes.gate}>Review the investment decision gate</Link></p>
    </div>
  )
}
