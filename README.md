# DPP Assessment Platform

Internal SAP Fioneer privacy assessment platform. Replaces the Excel checklist with a guided, versioned, markdown-driven workflow where answers are traceable to the exact template version used.

## What this contains

- `docs/dpp-assessment-design.md` — product, domain, workflow, UX, rules, API, schema, and roadmap design
- `templates/privacy_compliance_checklist.enriched.v1.md` — governed markdown template format
- `docs/example-parsed-template.json` — example runtime JSON produced by the parser
- `apps/api` — NestJS backend: templates, assessments, compliance rules, reports, Jira integration
- `apps/web` — Next.js frontend: dashboard, guided assessment wizard, template registry, report preview
- `packages/shared` — shared TypeScript types across API and web

## Key design decisions

- Markdown is the source of truth for assessment content. Template versions are immutable snapshots with checksums.
- Every answer is pinned to the exact template version shown at time of response.
- Compliance logic is explainable and assistive — it does not replace expert review.
- Threat model and TAM evidence are first-class parts of the workflow, not optional attachments.

## Local setup

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

### Steps

1. Copy the environment file and fill in your values:
   ```
   cp .env.example .env
   ```
2. Start PostgreSQL:
   ```
   docker compose up -d
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the API (port 3001):
   ```
   npm run dev:api
   ```
5. Start the frontend (port 3000):
   ```
   npm run dev:web
   ```

Open the guided assessment at `http://localhost:3000`.

### Windows PowerShell note

If PowerShell blocks `npm.ps1`, use `npm.cmd` instead — e.g. `npm.cmd run dev:api`.

## Environment variables

See `.env.example` for the full list with descriptions. Key variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL consumed by the frontend |
| `JIRA_BASE_URL` | Jira Cloud (`https://your-domain.atlassian.net`) or Server URL |
| `JIRA_USERNAME` | Service account email (Cloud) or username (Server/DC) |
| `JIRA_API_TOKEN` | API token — generate at [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens) |
| `JIRA_PROJECT_KEY` | Default project key for new issues (e.g. `WAR`) |

## Jira integration

In the assessment wizard, enter a Jira ticket key (e.g. `WAR-123`) in the **Project and evidence links** panel. A **Sync to Jira** button appears — clicking it posts a comment to that ticket with the assessment ID, template version, jurisdictions, and compliance status.

To create a new Jira issue instead of linking an existing one, use `POST /api/assessments/:id/jira-links` with `{ "mode": "create" }`.

Jira sync requires `JIRA_BASE_URL`, `JIRA_USERNAME`, and `JIRA_API_TOKEN` to be set in `.env`.

## API persistence

Answers are saved to the backend automatically as you respond to each question. The assessment is created on the API on the first answer given. Answers are also kept in `localStorage` as a local fallback.

The in-memory store (`Map`) means assessments are lost when the API restarts. Wiring to PostgreSQL via the existing Prisma schema is the next persistence step.

## Current limitations

- Assessment store is in-memory — data is lost on API restart. Prisma schema exists and is ready to wire.
- Jira "create" mode is implemented but not yet exposed in the UI — link mode (attach to existing ticket) is the default UI flow.
- PDF report export is not yet implemented. HTML report generation works via `GET /api/reports/:assessmentId`.
- Authentication middleware is not wired. `AUTH_PROVIDER=entra-id` is configured in env but not enforced.
- Reviewer workflow (comments, approvals, status changes) is designed but not yet built.

## Original source material

The original checklist: [privacy_compliance_checklist.md](privacy_compliance_checklist.md)  
Enriched governed template: [templates/privacy_compliance_checklist.enriched.v1.md](templates/privacy_compliance_checklist.enriched.v1.md)
