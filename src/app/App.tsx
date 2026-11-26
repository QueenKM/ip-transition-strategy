import { Navigate, Route, Routes } from 'react-router'
import AppShell from '../components/layout/AppShell'
import AboutPage from '../pages/AboutPage'
import ArchitecturePage from '../pages/ArchitecturePage'
import EvidenceDashboardPage from '../pages/EvidenceDashboardPage'
import ExecutiveDashboardPage from '../pages/ExecutiveDashboardPage'
import InvestmentGatePage from '../pages/InvestmentGatePage'
import JourneyPage from '../pages/JourneyPage'
import NotFoundPage from '../pages/NotFoundPage'
import RoadmapPage from '../pages/RoadmapPage'
import StationExplorerPage from '../pages/StationExplorerPage'
import TechnologyPortfolioPage from '../pages/TechnologyPortfolioPage'
import ValueChainPage from '../pages/ValueChainPage'
import { routes } from './routes'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to={routes.strategy} replace />} />
        <Route path={routes.strategy} element={<ExecutiveDashboardPage />} />
        <Route path={routes.valueChain} element={<ValueChainPage />} />
        <Route path={routes.portfolio} element={<TechnologyPortfolioPage />} />
        <Route path={routes.roadmap} element={<RoadmapPage />} />
        <Route path={routes.evidence} element={<EvidenceDashboardPage />} />
        <Route path={routes.gate} element={<InvestmentGatePage />} />
        <Route path={routes.architecture} element={<ArchitecturePage />} />
        <Route path={routes.explore} element={<StationExplorerPage />} />
        <Route path={routes.journey} element={<JourneyPage />} />
        <Route path={routes.about} element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
