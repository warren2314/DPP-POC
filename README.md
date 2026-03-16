# DPP Assessment Platform

Starter monorepo for an internal SAP Fioneer-style DPP assessment application that replaces an Excel checklist with a guided, versioned, markdown-driven workflow.

## What this scaffold contains

- `docs/dpp-assessment-design.md`: product, domain, workflow, UX, rules, API, schema, and roadmap design.
- `templates/privacy_compliance_checklist.enriched.v1.md`: governed markdown template format derived from the current checklist.
- `docs/example-parsed-template.json`: example runtime JSON produced by the parser.
- `apps/api`: NestJS-style backend skeleton for templates, assessments, rules, reports, and Jira integration.
- `apps/web`: Next.js-style frontend skeleton for dashboard, guided assessment, admin template management, and report preview.
- `packages/shared`: shared types for templates, answers, compliance summaries, and reporting.

## Key design decisions

- Markdown remains the primary source of truth for assessment content.
- Every uploaded template version is stored with a checksum and parsed snapshot so historic assessments remain pinned to the exact template used.
- Compliance logic is explainable and assistive. It does not replace expert review.
- Threat modelling and TAM evidence are first-class parts of the workflow, not optional attachments bolted on at the end.

## Recommended local setup

1. Start PostgreSQL locally with `docker compose up -d`.
2. Install dependencies with `npm install`.
3. Run the API with `npm run dev:api`.
4. Run the frontend with `npm run dev:web`.

## Windows PowerShell note

If PowerShell blocks `npm.ps1` on your machine, use `npm.cmd` instead:

1. `npm.cmd install`
2. `npm.cmd run dev:api`
3. `npm.cmd run dev:web`

Useful verification commands:

- `npm.cmd run build --workspace @dpp/api`
- `npm.cmd run build --workspace @dpp/web`

Open the guided assessment at `http://localhost:3000/assessments/new`.

## Current prototype behavior

- The assessment wizard now keeps local answer state, so `Yes` / `No` / `Unsure` selections are clickable.
- Completion starts at `0%` and updates from actual answers instead of a hard-coded placeholder.
- Jira and evidence panels default to neutral local-prototype values rather than fake linked records.
- The frontend is still in local-state mode; it is not yet wired to persist answers through the API.

## Assumptions

- Internal users authenticate through corporate SSO such as Entra ID or SAP Identity Authentication.
- Jira is available via REST API with a service account or OAuth app.
- Threat model and TAM artifacts may be uploaded or linked from internal document systems.

## Current source material

The original checklist is preserved in [privacy_compliance_checklist.md](/c:/Users/warre/Downloads/DPP/privacy_compliance_checklist.md). The enriched governed template example lives in [templates/privacy_compliance_checklist.enriched.v1.md](/c:/Users/warre/Downloads/DPP/templates/privacy_compliance_checklist.enriched.v1.md).
