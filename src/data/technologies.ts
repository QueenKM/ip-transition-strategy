import type { Datum, PortfolioPriority, Rating, TechnologyOption } from '../models/strategy'
import { initiativeInputRequests, initiatives } from './initiatives'

interface Assessment {
  title?: string
  description?: string
  priority: PortfolioPriority
  maturity: string
  rationale: string
  fit: Rating
  integration: Rating
  dependency: Rating
  risk: Rating
  regulatorySupport?: Rating
}

const assessments: Record<string, Assessment> = {
  'refinery-efficiency': {
    priority: 'Start now',
    maturity: 'Commercial methods for monitoring, efficiency and heat recovery. Retrofit performance varies by unit.',
    rationale: 'Start with audited measures that pass safety and downtime review. Defer infrastructure-intensive modifications until the site case is clear.',
    fit: 'High', integration: 'Medium', dependency: 'Medium', risk: 'Low', regulatorySupport: 'High',
  },
  'renewable-power': {
    priority: 'Start now',
    maturity: 'Commercial electricity procurement, including bilateral contracts and on-site generation. Contract eligibility depends on the use case.',
    rationale: 'Compare contracted power and demand flexibility across refinery and charging loads, using separate physical and accounting boundaries.',
    fit: 'High', integration: 'High', dependency: 'Medium', risk: 'Medium',
  },
  'process-electrification': {
    priority: 'Pilot',
    maturity: 'Commercial for some mechanical and heat duties. High-temperature or deeply integrated refinery processes require specific evidence.',
    rationale: 'Screen duty profile and net emissions first. Pilot a suitable duty where power is available and the case survives energy-price sensitivity.',
    fit: 'High', integration: 'Medium', dependency: 'High', risk: 'High',
  },
  'carbon-capture': {
    priority: 'Defer',
    maturity: 'Capture uses established components, with source-specific retrofit and transport and storage dependencies.',
    rationale: 'Preserve a residual-emissions option. Require suitable streams, delivered storage capacity and a validated full-chain cost before engineering commitment.',
    fit: 'Medium', integration: 'Low', dependency: 'High', risk: 'High',
  },
  'feedstock-coprocessing': {
    priority: 'Pilot',
    maturity: 'Commercial co-processing exists. IP reports historical activity at Falconara and Trecate within disclosed routes.',
    rationale: 'Test incremental qualifying feedstock and output routes against equipment constraints, independent attribution, supply intensity and matched offtake.',
    fit: 'High', integration: 'High', dependency: 'Medium', risk: 'Medium', regulatorySupport: 'High',
  },
  'road-hvo-pilot': {
    priority: 'Pilot',
    maturity: 'Commercial renewable diesel for approved vehicles. IP discloses a road HVO catalogue offer.',
    rationale: 'Qualify lot traceability and compatibility, then test a defined fleet and sites before considering extra distribution or supply capacity.',
    fit: 'High', integration: 'High', dependency: 'Medium', risk: 'Medium', regulatorySupport: 'High',
  },
  'refinery-hydrogen': {
    priority: 'Monitor',
    maturity: 'Industrial hydrogen use and electrolysis have commercial applications. IP has publicly disclosed a Trecate project.',
    rationale: 'Use disclosed project progress to assess substitution of existing process hydrogen. Incremental commitments require evidence on power, certification, demand and cost.',
    fit: 'High', integration: 'Medium', dependency: 'High', risk: 'High',
  },
  'road-hydrogen': {
    priority: 'Defer',
    maturity: 'Road vehicle and refuelling technology have specialist applications. Corridor viability depends on vehicles, supply and infrastructure.',
    rationale: 'Reopen selective review where committed fleet duty cycles and delivered low-emissions hydrogen can support a site relative to charging and other options.',
    fit: 'Low', integration: 'Low', dependency: 'High', risk: 'High',
  },
  'e-fuels': {
    priority: 'Monitor',
    maturity: 'The eligible combination of renewable hydrogen, carbon source and synthesis remains an emerging supply chain.',
    rationale: 'Track qualification, price and offtake in aviation or marine markets. Keep physical investment deferred until inputs, eligibility and demand align.',
    fit: 'Medium', integration: 'Medium', dependency: 'High', risk: 'High',
  },
  'public-charging': {
    priority: 'Pilot',
    maturity: 'Commercial charging equipment and services. IP publicly discloses a charging footprint.',
    rationale: 'Pilot incremental capacity or service improvement where the specific site, grid, consent and utilisation case are observable.',
    fit: 'High', integration: 'High', dependency: 'High', risk: 'Medium', regulatorySupport: 'High',
  },
  'fleet-charging': {
    priority: 'Pilot',
    maturity: 'Commercial charging and load management. Depot design and fleet operating schedules vary by use case.',
    rationale: 'Compare depot and route charging using observed duty cycles, contracted demand, connection cost and service economics.',
    fit: 'High', integration: 'High', dependency: 'High', risk: 'Medium',
  },
  biomethane: {
    priority: 'Monitor',
    maturity: 'Commercial biomethane pathways exist. Deliverability and eligibility depend on the specific supply and dispensing arrangement.',
    rationale: 'Assess eligible fuel for compatible fleets at proven sites. Require traceability, leakage controls and offtake and compare with direct electrification for feasible duty cycles.',
    fit: 'Medium', integration: 'Medium', dependency: 'Medium', risk: 'Medium', regulatorySupport: 'High',
  },
  'station-services': {
    priority: 'Pilot',
    maturity: 'Commercial retail and convenience formats. Incremental contribution and operational fit vary across forecourts.',
    rationale: 'Test a small service format and measure its own contribution and customer uptake, alongside separately reported charging performance.',
    fit: 'Medium', integration: 'Medium', dependency: 'Medium', risk: 'Medium',
  },
  'linked-mobility': {
    title: 'Digital catalogue, payment and loyalty',
    priority: 'Pilot',
    maturity: 'Commercial building blocks and existing IP customer channels. Cross-carrier data and payment flows require integration.',
    rationale: 'Test navigation, service evidence, accessibility and payment handoffs in a constrained scope before committing to cross-provider integration.',
    fit: 'High', integration: 'High', dependency: 'Medium', risk: 'Medium',
  },
  'advanced-biofuels': {
    title: 'Advanced biofuels for contracted channels',
    description: 'Assess certified road, aviation and marine offtake separately against eligibility, processing route, yields and logistics.',
    priority: 'Pilot',
    maturity: 'Several commercial routes exist. Qualification depends on the feedstock, process and destination channel.',
    rationale: 'Prioritise a verified pathway and contracted channel. Compare IP-reported co-processing with external sourcing and product certification.',
    fit: 'High', integration: 'High', dependency: 'Medium', risk: 'Medium', regulatorySupport: 'High',
  },
  'fleet-management': {
    title: 'Fleet management and energy reporting',
    description: 'Compare reporting and account features for cross-energy selection, compatible vehicles and fleet-level reconciliation.',
    priority: 'Pilot',
    maturity: 'Commercial fleet-account tooling. Cross-energy reconciliation and reporting need agreed data access and rights.',
    rationale: 'Use fleet reports to capture duty cycles, service outcomes and offtake evidence with a defined data boundary and user consent where appropriate.',
    fit: 'High', integration: 'High', dependency: 'Medium', risk: 'Medium',
  },
  'speculative-fossil-gas': {
    title: 'Uncontracted expansion of fossil gas refuelling',
    description: 'Screen broad new fossil gas capacity against service continuation, validated renewable gas routes and charging.',
    priority: 'Exclude',
    maturity: 'Commercial equipment exists. A mature technology carries no assurance of future demand or compliance value.',
    rationale: 'Exclude speculative expansion from the proposed transition programme. Existing services and specifically evidenced renewable gas options keep their own reviews.',
    fit: 'Low', integration: 'Low', dependency: 'High', risk: 'High',
  },
}

export const technologies: readonly TechnologyOption[] = initiatives.flatMap((initiative) => (
  initiative.technologyIds.map((id) => {
    const assessment = assessments[id.replace(/-technology$/, '')]
    const maturityAndFit = (value: string, scope: string): Datum<string> => ({
      value,
      evidenceType: 'STRATEGIC RECOMMENDATION',
      evidenceIds: initiative.evidenceIds,
      scope,
      period: null,
      lastUpdated: initiative.lastUpdated,
    })
    const qualitative = (value: Rating, scope: string): Datum<Rating> => ({
      value,
      evidenceType: 'STRATEGIC RECOMMENDATION',
      evidenceIds: initiative.evidenceIds,
      scope,
      period: null,
      lastUpdated: initiative.lastUpdated,
    })
    const caseGap = {
      value: null,
      evidenceType: 'NO DATA',
      inputRequestIds: initiativeInputRequests[initiative.id],
    } as const

    return {
      id,
      title: assessment.title ?? initiative.title,
      description: assessment.description ?? initiative.description,
      status: assessment.priority,
      evidenceType: 'STRATEGIC RECOMMENDATION',
      source: [],
      evidenceIds: initiative.evidenceIds,
      owner: initiative.owner,
      timeHorizon: initiative.timeHorizon,
      dependencies: initiative.dependencies,
      assumptions: [],
      lastUpdated: initiative.lastUpdated,
      industryMaturity: maturityAndFit(assessment.maturity, 'Industry-level judgement and disclosed case context.'),
      ipReadiness: caseGap,
      investmentIntensity: initiative.investmentIntensity,
      ratings: {
        strategicFit: qualitative(assessment.fit, 'Fit with the proposed IP strategy and intervention scope.'),
        demandVisibility: caseGap,
        infrastructureDependency: qualitative(assessment.dependency, 'Relative dependence on incremental assets, networks or permits.'),
        regulatorySupport: assessment.regulatorySupport
          ? qualitative(assessment.regulatorySupport, 'Qualitative policy relevance. Case eligibility remains subject to verification.')
          : caseGap,
        existingAssetUse: caseGap,
        integration: qualitative(assessment.integration, 'Strength of the proposed Refining–Distribution link.'),
        implementationRisk: qualitative(assessment.risk, 'Indicative complexity and exposure. Site-level risks require assessment.'),
      },
      rationale: assessment.rationale,
      initiativeIds: [initiative.id],
      riskIds: initiative.riskIds,
    } satisfies TechnologyOption
  })
))
