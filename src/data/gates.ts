import type { Datum, DecisionGate, GateCheck, GateStage } from '../models/strategy'
import { initiativeDecisionTriggers, initiatives } from './initiatives'

interface RequiredEvidence {
  demand: string
  regulation: string
  infrastructure: string
  economics: string
  verifiedMaturity?: { note: string; evidenceIds: readonly string[] }
}

interface RecordedGateEvidence {
  findings?: Partial<Record<GateCheck['id'], GateCheck['finding']>>
  approval?: DecisionGate['approval']
}

const recordedEvidence: Partial<Record<string, RecordedGateEvidence>> = {}

const requirements: Record<string, RequiredEvidence> = {
  'refinery-efficiency': {
    demand: 'A metered energy and throughput baseline, operating profile and planned turnaround support the intervention.',
    regulation: 'Engineering and compliance approve the applicable operating, emissions and safety boundary.',
    infrastructure: 'Unit access, instrumentation, utility and outage constraints are confirmed.',
    economics: 'Budget estimates and avoided energy and carbon costs justify the trial under realistic operating scenarios.',
  },
  'renewable-power': {
    demand: 'Metered refinery and charging load profiles establish the volumes each relevant entity can contract.',
    regulation: 'The contract and electricity attributes fit the intended accounting, reporting and compliance purpose.',
    infrastructure: 'Connection rights, meters, supply availability and balancing responsibilities are confirmed.',
    economics: 'A tariff, procurement or power-purchase option performs against alternatives under price, shape and volume sensitivity.',
    verifiedMaturity: { note: 'Lecture 2 documents electricity procurement and PPA mechanisms. Contract availability and fit require separate case evidence.', evidenceIds: ['E13', 'E14'] },
  },
  'process-electrification': {
    demand: 'A measured process duty, utility load and schedule establish the required operation.',
    regulation: 'Engineering and compliance complete the electrical, operating and emissions applicability review.',
    infrastructure: 'Steam or heat integration, power connection, operating flexibility and outage windows are documented.',
    economics: 'The duty-level case compares electrification with improved thermal operation under power and carbon-price scenarios.',
  },
  'carbon-capture': {
    demand: 'A measured residual emissions stream remains after screening efficiency and electrification.',
    regulation: 'Capture, transport, storage and accounting responsibilities are documented for the proposed route.',
    infrastructure: 'A stream study, fit assessment and credible transport and storage access establish the chain.',
    economics: 'Full-chain cost per tonne and liability exposure support comparison with other abatement.',
  },
  'feedstock-coprocessing': {
    demand: 'Qualified feedstocks and compatible contracted buyers establish plausible lot volumes for each channel.',
    regulation: 'The feedstock, processing attribution, chain of custody and lifecycle intensity meet the target scheme.',
    infrastructure: 'Unit fit, feedstock quality, catalysts, storage and the distribution route are documented.',
    economics: 'Incremental cost, product yields, logistics and offtake terms remain viable under feedstock-price sensitivity.',
    verifiedMaturity: { note: 'IP reports historical co-processing at two sites. New feedstocks, unit limits and commercial volumes are still subject to case review.', evidenceIds: ['E06'] },
  },
  'road-hvo-pilot': {
    demand: 'A compatible fleet commits defined volume and routes for a bounded trial.',
    regulation: 'Compliance checks lot eligibility, technical specification, documentation and customer claims.',
    infrastructure: 'Accountable operators confirm vehicle compatibility, storage, containment, supply route and site permissions.',
    economics: 'Incremental inventory, logistics, dispensing and realised fleet margin support a bounded test.',
    verifiedMaturity: { note: 'IP publishes a road HVO offer. Publication does not establish compatibility or supply for a different fleet or site.', evidenceIds: ['E06'] },
  },
  'refinery-hydrogen': {
    demand: 'Measured existing process-hydrogen use establishes a credible substitution scope.',
    regulation: 'Compliance confirms the intended hydrogen pathway, power sourcing and any claims on fuel products.',
    infrastructure: 'Verify the disclosed project stage and site utility, equipment and permitting constraints.',
    economics: 'Delivered hydrogen cost and power sensitivity support comparison with the baseline process route.',
  },
  'road-hydrogen': {
    demand: 'Fleet commitments demonstrate compatible vehicles and repeat volume on a defined route.',
    regulation: 'Confirm the applicable safety, site, vehicle and low-emissions fuel rules.',
    infrastructure: 'A safe route for supply, storage, delivery, dispensing and maintenance is available at the site.',
    economics: 'A downside case supports utilisation and delivered hydrogen cost relative to depot or route charging alternatives.',
  },
  'e-fuels': {
    demand: 'Qualified aviation or marine buyers provide credible offtake with volume and price visibility.',
    regulation: 'Renewable electricity and hydrogen, carbon source and lifecycle accounting meet the applicable route.',
    infrastructure: 'Confirm qualified inputs, production, blending and an available commercial distribution route.',
    economics: 'The investment can withstand input, utilisation, price and policy sensitivity.',
  },
  'public-charging': {
    demand: 'A local catchment and comparable usage validate the proposed charging test and its expected load.',
    regulation: 'Document planning and safety requirements plus applicable public access, pricing and data obligations.',
    infrastructure: 'Confirm site and operator consent, written grid capacity or connection offer and service support.',
    economics: 'A bounded capex and opex case addresses tariffs, site costs, utilisation downside and an exit condition.',
    verifiedMaturity: { note: 'Commercial charging is established, with IP and IPlanet charging activity disclosed. A new installation still needs a site case.', evidenceIds: ['E08'] },
  },
  'fleet-charging': {
    demand: 'A fleet commits a bounded trial with duty cycles, dwell and vehicle rollout timing.',
    regulation: 'Specify depot and public-route obligations, as applicable, and confirm site access and commercial terms.',
    infrastructure: 'Confirm depot or route readiness, distribution capacity, fleet staging and operator service levels.',
    economics: 'Compare fleet total cost and operator margin under the proposed route and its alternatives.',
    verifiedMaturity: { note: 'Lecture 2 describes flexible demand and EV charging. Fleet duty cycle, deployment and site compatibility remain separate checks.', evidenceIds: ['E08', 'E14'] },
  },
  biomethane: {
    demand: 'A compatible fleet and commercial route support evidenced volume and usage.',
    regulation: 'Verify eligible production, leakage and traceability obligations, and equipment permissions.',
    infrastructure: 'Confirm the form of supply, dispensing compatibility, capacity and ongoing service terms.',
    economics: 'Establish the delivered fuel case against continued service, alternatives and a lower-demand scenario.',
  },
  'station-services': {
    demand: 'Dwell and transaction evidence establish a plausible customer need for the proposed format.',
    regulation: 'Confirm applicable leases, station contracts, operating rules and accessibility requirements.',
    infrastructure: 'Confirm available space, staffing, facilities and operator consent.',
    economics: 'Estimate incremental contribution using an agreed baseline and sensitivity on staffing, stock and dwell.',
  },
  'linked-mobility': {
    demand: 'Customer and fleet task research identifies a useful, testable journey for a defined cohort.',
    regulation: 'Confirm data rights, privacy, accessibility and relevant payments and public-access duties.',
    infrastructure: 'Document permissions and capabilities for catalogue status, source freshness, reconciliation and support.',
    economics: 'A scoped delivery and operating case identifies owners, acquisition costs and expected measurable value.',
  },
}

const scaleRequirements: Partial<Record<string, RequiredEvidence & { operating: string }>> = {
  'road-hvo-pilot': {
    demand: 'Repeat purchases and committed offtake support the proposed volumes and specific expansion locations.',
    regulation: 'Recertify eligibility and chain of custody for the expanded supply and distribution route.',
    infrastructure: 'Confirm scaled supply, product quality, compatible fleets, storage and site operating rights.',
    economics: 'Reconcile measured landed cost and realised margin, and test supply shortages, low volume and price downside.',
    operating: 'Pilot records reconcile certified volumes with repeat supply, fleet use and service availability under the agreed scope.',
  },
  'public-charging': {
    demand: 'Measured repeat use, delivered energy and local utilisation support demand at the candidate sites.',
    regulation: 'Complete site-specific safety, public access, pricing, data and permit review for each new site.',
    infrastructure: 'Confirm grid agreements, site and operator terms, reliability support and delivery schedule for each site.',
    economics: 'Use observed energy margin and utilisation plus downside tariff, maintenance and delay scenarios to justify investment.',
    operating: 'Use validated pilot sessions, delivered energy, uptime and support outcomes against the agreed exit criteria.',
  },
}

const titles: Record<GateCheck['id'], string> = {
  strategicFit: 'Strategic fit',
  technologyMaturity: 'Technology maturity',
  demandReadiness: 'Demand readiness',
  regulatoryReadiness: 'Regulatory readiness',
  infrastructureReadiness: 'Infrastructure readiness',
  investmentIntensity: 'Investment intensity',
  economics: 'Economics',
  operatingPerformance: 'Operating performance',
}

const stages: Record<string, GateStage> = { watch: 'Watch', pilot: 'Pilot', scale: 'Scale' }

export const gates: readonly DecisionGate[] = initiatives.flatMap((initiative) => (
  initiative.gateIds.map((id) => {
    const stage = stages[id.slice(id.lastIndexOf('-') + 1)]
    const requiredForStage = stage !== 'Watch'
    const requirement = requirements[initiative.id]
    const scale = stage === 'Scale' ? scaleRequirements[initiative.id] : undefined
    const stageRequirement = scale ?? requirement
    const refineryInitiative = ['refinery-efficiency', 'process-electrification', 'carbon-capture',
      'feedstock-coprocessing', 'refinery-hydrogen'].includes(initiative.id)
    const requestIds: Record<GateCheck['id'], readonly string[]> = {
      strategicFit: ['ws7-input'],
      technologyMaturity: [refineryInitiative ? 'ws3-input' : 'ws5-input', 'ws6-input'],
      demandReadiness: refineryInitiative ? ['ws2-input', 'ws3-input'] : ['ws4-input', 'ws5-input'],
      regulatoryReadiness: ['ws1-input'],
      infrastructureReadiness: refineryInitiative ? ['ws3-input'] : ['ws4-input', 'ws5-input'],
      investmentIntensity: ['ws6-input'],
      economics: ['ws6-input'],
      operatingPerformance: refineryInitiative ? ['ws2-input', 'ws3-input'] : ['ws4-input', 'ws5-input'],
    }
    const owner = initiative.owner ?? 'Initiative owner'
    const verifiedMaturity = stage === 'Pilot' ? requirement.verifiedMaturity : undefined

    function check(
      checkId: GateCheck['id'],
      rationale: string,
      nextAction: string,
      checkOwner: string,
      options?: { blocking?: boolean; required?: boolean; finding?: GateCheck['finding'] },
    ): GateCheck {
      return {
        id: checkId,
        title: titles[checkId],
        required: options?.required ?? requiredForStage,
        blockingIfUnmet: options?.blocking ?? false,
        finding: recordedEvidence[id]?.findings?.[checkId] ?? options?.finding ?? {
          value: null,
          evidenceType: 'NO DATA',
          inputRequestIds: requestIds[checkId],
        },
        rationale,
        nextAction,
        owner: checkOwner,
      }
    }

    const fit: GateCheck['finding'] = {
      value: 'Met',
      evidenceType: 'STRATEGIC RECOMMENDATION',
      evidenceIds: initiative.evidenceIds,
      scope: 'Academic portfolio fit for the proposed scope. Subject to human review.',
      period: null,
      lastUpdated: initiative.lastUpdated,
    }
    const maturity: GateCheck['finding'] | undefined = verifiedMaturity ? {
      value: 'Met',
      evidenceType: 'VERIFIED FACT',
      evidenceIds: verifiedMaturity.evidenceIds,
      scope: 'Commercial or documented pathway context for initial review. Specific deployment readiness is assessed separately.',
      period: null,
      lastUpdated: initiative.lastUpdated,
    } : undefined
    const investmentScope = 'A cost classification and authorised financing need evidence for this specific intervention and stage.'
    const performanceScope = scale?.operating
      ?? 'Define an exit criterion and measurement boundary before launch. The project has no case pilot performance in this record.'

    const checks: readonly GateCheck[] = [
      check('strategicFit', initiative.integration, 'Confirm the case scope and pillar links with the strategy owner.', 'Transition strategy', { required: false, finding: fit }),
      check('technologyMaturity', verifiedMaturity?.note ?? 'Evidence of maturity for the specific scope and deployment route is needed.', 'Validate the pathway and confirm the unit or site application.', owner, { finding: maturity }),
      check('demandReadiness', stageRequirement.demand, 'Obtain the demand, fleet, process or offtake evidence listed for this stage.', owner),
      check('regulatoryReadiness', stageRequirement.regulation, 'Record legal, sustainability and safety applicability and approvals.', 'Sustainability and compliance', { blocking: true }),
      check('infrastructureReadiness', stageRequirement.infrastructure, 'Obtain an engineering or operator readiness statement for the implementation boundary.', owner, { blocking: true }),
      check('investmentIntensity', investmentScope, 'Confirm the indicative intensity with scoped budget evidence and an approval path.', 'Investment governance and finance'),
      check('economics', stageRequirement.economics, 'Validate the base and downside case with finance using verified inputs.', 'Investment governance and finance', { blocking: true }),
      check('operatingPerformance', performanceScope, 'Reconcile approved exit criteria with measured pilot results before any scale approval.', owner, { required: stage === 'Scale' }),
    ]

    const approval: Datum<'Under review' | 'Approved' | 'Rejected'> = recordedEvidence[id]?.approval ?? {
      value: null,
      evidenceType: 'NO DATA',
      inputRequestIds: ['ws7-input'],
    }

    return {
      id,
      title: `${stage} review`,
      description: `Review the evidence for ${initiative.title.toLowerCase()} at the ${stage.toLowerCase()} stage. Human approval follows the relevant governance process.`,
      status: 'Proposed decision rule',
      evidenceType: 'STRATEGIC RECOMMENDATION',
      source: [],
      evidenceIds: initiative.evidenceIds,
      owner,
      timeHorizon: stage === 'Scale' ? '3–7 years' : initiative.timeHorizon,
      dependencies: [
        { kind: 'initiative', id: initiative.id },
        ...initiative.dependencies,
      ],
      assumptions: [],
      lastUpdated: initiative.lastUpdated,
      initiativeId: initiative.id,
      stage,
      checks,
      riskIds: initiative.riskIds,
      reviewTrigger: scale ? scale.operating : initiativeDecisionTriggers[initiative.id],
      approvalRole: 'Proposed investment committee, with operating, compliance and finance review',
      approval,
    } satisfies DecisionGate
  })
))
