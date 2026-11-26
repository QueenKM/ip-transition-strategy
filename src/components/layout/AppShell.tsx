import {
  Activity, ArrowRightLeft, BookOpen, ChartNoAxesCombined, Compass, GitBranch,
  Layers3, ListChecks, Network, Route, Waypoints,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { routes } from '../../app/routes'
import styles from './AppShell.module.css'

const strategyNav = [
  { to: routes.strategy, label: 'Overview', Icon: ChartNoAxesCombined },
  { to: routes.valueChain, label: 'Value chain', Icon: Waypoints },
  { to: routes.portfolio, label: 'Portfolio', Icon: Layers3 },
  { to: routes.roadmap, label: 'Roadmap', Icon: Route },
  { to: routes.evidence, label: 'KPIs & evidence', Icon: BookOpen },
  { to: routes.gate, label: 'Decision gate', Icon: ListChecks },
  { to: routes.architecture, label: 'Architecture', Icon: Network },
]

const mobilityNav = [
  { to: routes.explore, label: 'Station explorer', Icon: Compass },
  { to: routes.journey, label: 'Service journey', Icon: ArrowRightLeft },
]

export default function AppShell() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)
  const isMobility = pathname.startsWith('/mobility/')
  const isStrategy = pathname.startsWith('/strategy')
  const contextualNav = isMobility ? mobilityNav : isStrategy ? strategyNav : []

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    window.scrollTo(0, 0)
    const target = mainRef.current?.querySelector<HTMLElement>('h1') ?? mainRef.current
    target?.focus()
  }, [pathname])

  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#main-content" onClick={(event) => {
        event.preventDefault()
        mainRef.current?.focus()
      }}>Skip to main content</a>
      <header className={styles.header}>
        <div className={styles.topbar}>
          <Link className={styles.brand} to={routes.strategy} aria-label="Italy Energy Transition overview">
            <span className={styles.mark}><GitBranch size={21} strokeWidth={2.15} aria-hidden="true" /></span>
            <span className={styles.brandName}>Italy Energy Transition<span>Italiana Petroli case study</span></span>
          </Link>
          <nav className={styles.views} aria-label="Application views">
            <Link className={isStrategy ? styles.activeView : styles.view} to={routes.strategy}
              aria-current={isStrategy ? 'location' : undefined}>Strategy Control</Link>
            <Link className={isMobility ? styles.activeView : styles.view} to={routes.explore}
              aria-current={isMobility ? 'location' : undefined}>Customer &amp; Fleet</Link>
          </nav>
          <NavLink className={({ isActive }) => isActive ? styles.aboutActive : styles.about} to={routes.about}>
            About<span> the prototype</span>
          </NavLink>
        </div>
      </header>
      {contextualNav.length > 0 && (
        <nav className={styles.sectionNav} aria-label={isMobility ? 'Customer and Fleet pages' : 'Strategy pages'}>
          <div className={styles.navInner}>
            {contextualNav.map(({ to, label, Icon }) => (
              <NavLink end key={to} to={to} className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
                <Icon size={17} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
      <main id="main-content" className={styles.main} ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span><Activity size={16} aria-hidden="true" /> Part 7 · Integrated strategy and roadmap</span>
          <Link to={routes.about}>Independent academic prototype</Link>
        </div>
      </footer>
    </div>
  )
}
