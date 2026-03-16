import Link from "next/link";
import { sampleAssessment } from "../lib/mock-data";

export function DashboardShell() {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">SAP Fioneer Internal Workflow</p>
          <h1>Markdown-driven DPP assessments with evidence, review, and traceability.</h1>
          <p className="hero-copy">
            Replace the spreadsheet with a governed assessment workflow that preserves template versions, guides
            requestors clearly, and surfaces reviewer decisions without treating compliance as a black box.
          </p>
        </div>
        <div className="hero-metrics">
          <div className="metric-card">
            <span>Active template</span>
            <strong>{sampleAssessment.templateVersion}</strong>
          </div>
          <div className="metric-card">
            <span>Current draft</span>
            <strong>{sampleAssessment.id}</strong>
          </div>
          <div className="metric-card">
            <span>Jira link</span>
            <strong>{sampleAssessment.jiraKey}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-head">
            <h2>Assessment Queue</h2>
            <Link href="/assessments/new" className="action-link">
              Start new assessment
            </Link>
          </div>
          <div className="assessment-row">
            <div>
              <strong>{sampleAssessment.productName}</strong>
              <p>{sampleAssessment.jurisdictions.join(", ")} | Template {sampleAssessment.templateVersion}</p>
            </div>
            <div className="assessment-meta">
              <span>{sampleAssessment.completionPercent}% complete</span>
              <Link href="/assessments/ASM-2026-001">Open</Link>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h2>Reviewer Attention</h2>
          </div>
          <ul className="signal-list">
            <li>2 questions still need clarification from the requestor.</li>
            <li>Threat model reference is missing for one in-scope data flow.</li>
            <li>Automated decision safeguards still require reviewer judgement.</li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h2>Template Governance</h2>
            <Link href="/templates" className="action-link">
              Manage templates
            </Link>
          </div>
          <ul className="signal-list">
            <li>Current template source remains markdown-first and version-pinned.</li>
            <li>Historic assessments remain attached to the exact parsed snapshot used.</li>
            <li>Validation warnings highlight questions missing examples or guidance.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
