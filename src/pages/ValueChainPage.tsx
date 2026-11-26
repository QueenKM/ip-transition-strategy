import { ArrowDownRight, ArrowRight, Factory, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { routes } from '../app/routes'
import { EvidenceBadge } from '../components/evidence/Evidence'
import { PageHeading } from '../components/layout/PageHeading'
import styles from '../components/strategy/StrategyStory.module.css'
import { valueChains } from '../data/strategy'

export default function ValueChainPage() {
  return (
    <div className="page stack">
      <PageHeading
        title="Integrated value chain"
        eyebrow="Strategy control"
        description="Trace certified fuels from refining and procurement, and charging from grid supply. Both routes meet in the customer and fleet experience and return evidence to investment review."
      >
        <EvidenceBadge type="STRATEGIC RECOMMENDATION" />
      </PageHeading>

      <section className={styles.section} aria-labelledby="energy-pathways-heading">
        <div className={styles.sectionHeader}>
          <h2 id="energy-pathways-heading">Energy pathways</h2>
        </div>
        <div className={styles.laneGrid}>
          {valueChains.map((chain) => {
            const isElectric = chain.id === 'grid-to-customer'
            const Icon = isElectric ? Zap : Factory
            return (
              <article className={`panel ${styles.lane}${isElectric ? ` ${styles.electricLane}` : ''}`} key={chain.id}>
                <header className={styles.laneHeading}>
                  <span className={styles.stageIcon}><Icon size={21} aria-hidden="true" /></span>
                  <h3 className={styles.laneTitle}>{chain.title}</h3>
                </header>
                <p>{chain.description}</p>
                <ol className={styles.stageList}>
                  {chain.steps.map((step) => (
                    <li className={styles.stage} key={step.title}>
                      <h4>
                        {'initiativeId' in step ? (
                          <Link
                            className={styles.stageLink}
                            to={`${routes.gate}?initiative=${encodeURIComponent(step.initiativeId)}`}
                            aria-label={`Review initiative for ${step.title.toLowerCase()}`}
                          >
                            {step.title} <ArrowRight size={14} aria-hidden="true" />
                          </Link>
                        ) : step.title}
                      </h4>
                      <p>{step.description}</p>
                    </li>
                  ))}
                </ol>
              </article>
            )
          })}
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
          <Link to={routes.gate} className={styles.textLink}>
            Open the investment gate <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
