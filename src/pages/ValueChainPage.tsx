import {
  ArrowDown, ArrowDownRight, ArrowRight, BarChart3, ClipboardCheck, Droplet, Factory, Fuel,
  ListChecks, MapPin, Network, Truck, Users, Zap,
} from 'lucide-react'
import { Link } from 'react-router'
import { routes } from '../app/routes'
import { EvidenceBadge } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import styles from '../components/strategy/StrategyStory.module.css'
import { valueChains } from '../data/strategy'

const flowTracks = [
  {
    title: 'Liquid fuel pathway', Icon: Droplet, tone: 'liquid',
    stages: [
      { label: 'Feedstock/Supply', Icon: Droplet },
      { label: 'Refining', Icon: Factory },
      { label: 'Qualified Product', Icon: Fuel },
      { label: 'Logistics', Icon: Truck },
      { label: 'Station/Fleet', Icon: MapPin },
      { label: 'Customer', Icon: Users },
    ],
  },
  {
    title: 'Electricity pathway', Icon: Zap, tone: 'electric',
    stages: [
      { label: 'Grid', Icon: Network },
      { label: 'Site', Icon: MapPin },
      { label: 'Charger', Icon: Zap },
      { label: 'Driver/Fleet', Icon: Users },
    ],
  },
] as const

const decisionFlow = [
  { label: 'Demand & Operating Evidence', detail: 'Volumes, demand signals, utilisation and service availability.', Icon: BarChart3, to: routes.evidence },
  { label: 'Strategy Control', detail: 'Review performance, dependencies and priorities across both pathways.', Icon: ClipboardCheck, to: routes.strategy },
  { label: 'Investment Gate', detail: 'Review evidence against decision criteria before human approval.', Icon: ListChecks, to: routes.gate },
] as const

export default function ValueChainPage() {
  return (
    <div className={`page ${styles.story}`}>
      <PageHeading
        title="Integrated Value Chain"
        eyebrow="Strategy control"
        description="This Part 7 integration model traces the proposed fuel and electricity pathways. Team findings will establish case-specific supply, site and operating requirements."
      >
        <EvidenceBadge type="STRATEGIC RECOMMENDATION" />
      </PageHeading>

      <section className={styles.section} aria-labelledby="energy-pathways-heading">
        <div className={styles.sectionHeader}>
          <h2 id="energy-pathways-heading">Energy pathways</h2>
        </div>
        <div className={styles.flowLayout}>
          <div className={styles.flowTracks}>
            {flowTracks.map(({ title, Icon, tone, stages }) => (
              <article className={`panel ${styles.flowTrack}`} data-tone={tone} key={tone}>
                <h3><Icon size={20} aria-hidden="true" /> {title}</h3>
                <ol>
                  {stages.map(({ label, Icon: StageIcon }, index) => {
                    const [primary, qualifier] = label.split('/')
                    return (
                      <li key={label}>
                        {index > 0 && <ArrowRight className={styles.trackArrow} size={14} aria-hidden="true" />}
                        <StageIcon size={23} aria-hidden="true" />
                        <span>{primary}{qualifier && <>/<wbr />{qualifier}</>}</span>
                      </li>
                    )
                  })}
                </ol>
              </article>
            ))}
          </div>
          <div className={styles.mergeConnector} aria-hidden="true"><ArrowRight size={25} /></div>
          <ol className={styles.decisionFlow} aria-label="Decision pathway shared by both energy routes">
            {decisionFlow.map(({ label, detail, Icon, to }, index) => (
              <li className={styles.decisionStep} key={label}>
                {index > 0 && <ArrowDown className={styles.decisionArrow} size={15} aria-hidden="true" />}
                <Link to={to}>
                  <Icon size={19} aria-hidden="true" />
                  {label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.laneNotes}>
          {valueChains.map((chain) => (
            <details className={`panel ${styles.recordDetails}`} key={chain.id}>
              <summary>{chain.title} details</summary>
              <p>{chain.description}</p>
              <ol className={styles.stageList}>
                {chain.steps.map((step) => (
                  <li className={styles.stage} key={step.title}>
                    <h3>
                      {'initiativeId' in step ? (
                        <Link className={styles.stageLink} to={`${routes.gate}?initiative=${encodeURIComponent(step.initiativeId)}`}>
                          {step.title} <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      ) : step.title}
                    </h3>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="shared-platform-heading">
        <div className={styles.sectionHeader}>
          <h2 id="shared-platform-heading">Shared digital platform</h2>
          <Link to={routes.architecture} className={styles.textLink}>
            Review the data flows <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.handoffGrid}>
          <article className={`${styles.handoff} panel`}>
            <h3>Service catalogue</h3>
            <p>Present eligible fuel or charging offers with their compatibility, availability and source.</p>
          </article>
          <article className={`${styles.handoff} panel`}>
            <h3>Customer and fleet activity</h3>
            <p>Capture service requests, delivered volumes and sessions as distinct forms of evidence.</p>
          </article>
          <article className={`${styles.handoff} panel`}>
            <h3>Investment review</h3>
            <p>Compare demand with operating performance, commercial terms and risks before committing capital.</p>
          </article>
        </div>
        <p className={styles.feedback}>
          <ArrowDownRight size={17} aria-hidden="true" />
          <span>Aggregate the evidence to inform the next review of feedstocks, product mix and station upgrades.</span>
        </p>
        <div className={styles.platformLinks}>
          <Link to={routes.explore} className="button button-secondary">
            Explore sample services <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
