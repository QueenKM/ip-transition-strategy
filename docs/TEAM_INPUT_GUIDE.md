# Team input integration guide

Use this process when a workstream sends its findings. The eight workstream pages, home cards and readiness view use the same records in `src/data/workstreams/`. Shared KPI, portfolio, roadmap and gate records change when the workstream evidence supports their specific scope.

## Record and validate a submission

1. Open the matching workstream file in the table below. Set the responsible role in `owner`.
2. Record the submission in `submission`. Add `dateReceived`, `lastUpdated`, `summary`, `keyFindings`, `recommendations`, `sources` and `evidenceIds`. Leave `lastValidated: null` while review is pending. The data model derives `inputReceived`, `validated`, `status` and `evidenceType` from the submission. An outstanding review appears as **Team input awaiting validation**.
3. Add source metadata to `src/data/sources.ts`. Add evidence items with a stable ID, reporting period, scope and source locator in `src/data/evidence.ts`. Use `TEAM INPUT` for submitted analysis and `VERIFIED FACT` for separately substantiated observations within their reporting boundary. Use `ASSUMPTION` for unsupported premises, and keep `NO DATA` with a null value where evidence is unavailable.
4. Add case findings, priority, timing and rationale to the corresponding topic fields. Use `findingEvidenceIds` for evidence supporting team findings and `evidenceIds` within a topic for public or lecture context. Add `affectedRecords` references by stable ID, using the appropriate kinds such as `initiative`, `technology`, `kpi` and `phase`. The workstream-level lists are derived from these references. Keep the existing `wsX-input` request IDs.
5. Check the source, definition, scope, unit, period and evidence class. Enter the actual review date in `submission.lastValidated` once the review is complete. Update `unresolvedQuestions` and keep outstanding topic or metric values null. If you supplied a manual `missingData` list, revise it to reflect the evidence you just validated.
6. Update the linked shared data only where a supported conclusion changes it. A validated submission does not populate `gates.ts`, approve investment or turn an illustrative request into contracted demand. Each affected gate stage requires its own scoped finding and evidence. Record case evidence in `recordedEvidence` in `src/data/gates.ts`, and record approval only with a documented authorised human decision.
7. Run the checks below, then open the workstream, home, readiness register and affected screens. Check that any value still pending displays **No data**. Refresh a linked route and repeat the demo if investment records changed.
8. Commit as `Integrate Workstream X [scope]`, using the examples in the table. Keep internal or personal information out of this public repository.

```sh
npm run validate
npm run lint
npm run build
```

## Workstream-specific updates

| Workstream file | What to integrate | Recheck | Example commit |
| --- | --- | --- | --- |
| [w1-context.ts](../src/data/workstreams/w1-context.ts) | Applicable regulation, market and competitor conclusions, demand scenarios, implications for IP | Context, portfolio, regulatory and demand gate checks | `Integrate Workstream 1 regulation and market analysis` |
| [w2-refining-context.ts](../src/data/workstreams/w2-refining-context.ts) | Asset boundaries, capacity, metered energy and emissions, benchmark, constraints and residual gaps | Refining context, KPI dashboard, refinery gates | `Integrate Workstream 2 refining baseline` |
| [w3-refining-solutions.ts](../src/data/workstreams/w3-refining-solutions.ts) | Scoped technical shortlist, priorities, timing, rationale, certification and unit fit | Refining, portfolio, roadmap, decision gate | `Integrate Workstream 3 refining analysis` |
| [w4-distribution-context.ts](../src/data/workstreams/w4-distribution-context.ts) | Network boundary, station archetypes, local competitors, customers, grid and site constraints | Distribution, KPI dashboard, demand and site checks | `Integrate Workstream 4 distribution baseline` |
| [w5-distribution-solutions.ts](../src/data/workstreams/w5-distribution-solutions.ts) | Proposed charging, fuel, station or customer services with site or fleet eligibility and scale criteria | Distribution, portfolio, roadmap, demo journey, decision gate | `Integrate Workstream 5 distribution solutions` |
| [w6-economics.ts](../src/data/workstreams/w6-economics.ts) | CAPEX, OPEX, ROI, NPV, payback, margin, hurdle rate, demand sensitivity, maturity and risks | Economics workstream, portfolio comparison, roadmap, economics gate | `Integrate Workstream 6 investment and risk analysis` |
| [w7-integrated-strategy.ts](../src/data/workstreams/w7-integrated-strategy.ts) | Integrated timing, reconciled dependencies, KPI definitions, data rights and governance | Integrated strategy, value chain, roadmap, governance, evidence and demo | `Integrate Workstream 7 cross-workstream strategy` |
| [w8-executive.ts](../src/data/workstreams/w8-executive.ts) | Group-approved recommendation, executive summary, storyline, allocation, terminology and final conclusion | Executive workstream, home, approved presentation narrative | `Integrate Workstream 8 executive storyline` |

For W3, where a validated recommendation affects the near-term roadmap, add `{ kind: 'phase', id: 'near-term' }` to the topic along with the relevant initiative and technology references. The three phase IDs are `near-term`, `medium-term` and `long-term`. For W6, a portfolio-specific finding needs the affected technology ID, and financial metrics retain their own `value`, evidence class, scope and unit. For W7, a portfolio timing conclusion needs its relevant technology ID and validated case input from the contributing technical and economics workstreams.

## Shared records

- Use `sources.ts` and `evidence.ts` for provenance.
- Use `technologies.ts`, `initiatives.ts` and `roadmap.ts` to revise the integrated framework after review.
- Use `kpis.ts`, `risks.ts`, `gates.ts` and `governance.ts` for measurement, risks, case decisions and proposed responsibilities.
- Use `demo.ts` and `services.ts` for clearly identified illustrative scenarios. Their browser-session events stay separate from case evidence.
