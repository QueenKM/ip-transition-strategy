# Italy Energy Transition

An independent academic proof of concept for Part 7 of the university sustainability strategy challenge on Italiana Petroli. It connects refining, qualified fuels, electricity supply, station services, fleet demand and human investment review. IP and its partners have no affiliation with or endorsement of this prototype.

## Run locally

Use Node.js 22.12 or later and npm.

```sh
npm install
npm run dev
```

Open the address printed by Vite. The suggested demonstration starts in **Customer & Fleet → Station explorer**. Open the fictional corridor XTL-HVO pilot, simulate a fleet request, and open the linked investment gate. The synthetic request appears in the demand panel. The case recommendation continues to use the documented evidence for the selected stage. The electric-vehicle example supports mock reservation and payment and distinguishes connector power in kW from energy delivered in kWh.

## Update the strategy and evidence

Edit `src/data` and rebuild. Keep record IDs stable so links continue to resolve.

| Data files | Update |
| --- | --- |
| `project.ts`, `strategy.ts` | Case description, strategic thesis, pillars and value chains |
| `sources.ts`, `evidence.ts`, `team.ts` | Provenance, evidence classification, eight workstream records and input requests |
| `initiatives.ts`, `technologies.ts`, `risks.ts` | Business cases, readiness, qualitative technology priorities and mitigation |
| `roadmap.ts`, `gates.ts` | Horizons, actions, stage-specific criteria and human approval records |
| `kpis.ts` | Values, measurement boundaries, targets, period and evidence |
| `services.ts`, `demo.ts` | Fictional locations, service statuses and mock transaction presets |
| `architecture.ts` | Documented systems and proposed integration records |

For a missing team input, first update its request in `team.ts`, then add or cite the underlying source and classify each claim. Link the relevant evidence ID when entering a value. Keep unavailable fields as `null` so they display **No data**. Preserve the historical reporting boundary when using a company disclosure. Lecture references are cited by filename and page.

Enter initiative-specific findings and recorded approvals in the `recordedEvidence` object in `gates.ts`. Use the gate ID, such as `road-hvo-pilot-pilot`, and the check ID to link each finding to its evidence. The recommendation is recalculated from the selected stage’s criteria.

The app accepts only preset demo actions. Session activity stays in the browser and can be cleared with **Reset demo**. The repository includes public citations and synthetic records. Publish only material approved for public access.

## Validate the production build

```sh
npm install
npm run lint
npm run validate:data
npm run build
npm run preview
```

Confirm the entry page, view switch, direct links, filters, linked mock journey and decision stages. For a repository-path smoke test, use a static hosting directory containing `dist` under a directory named `REPOSITORY_NAME`. Open `/REPOSITORY_NAME/#/strategy/gate?initiative=road-hvo-pilot` and refresh. Check the production CSS and imagery and try an unknown hash route.

## Publish to GitHub Pages

1. Create a GitHub repository and push the project root, including .github/workflows/deploy.yml, to its `main` branch. If your deployment branch differs, replace `main` in `.github/workflows/deploy.yml`.
2. In the GitHub repository, go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
3. In **Actions**, open **Deploy prototype to GitHub Pages**. Run the workflow manually if the initial push happened before Pages was enabled. Subsequent pushes to `main` trigger deployment.
4. Open `https://USERNAME.github.io/REPOSITORY_NAME/`. Replace `USERNAME` in this URL with your account or organisation and `REPOSITORY_NAME` with your repository name. The relative Vite asset base requires no repository-specific source changes.

The workflow validates the data, lints the code, builds the Vite bundle and publishes `dist`. React Router keeps screen paths after the URL hash so a direct link or refresh retrieves the same static entry page.
