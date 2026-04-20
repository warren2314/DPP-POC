import Link from "next/link";
import { AppShell } from "./app-shell";
import { sampleTemplate } from "../lib/mock-data";
import { SavedAssessmentsList } from "./saved-assessments-list";

export function DashboardShell() {
  return (
    <AppShell
      eyebrow="DPP Assessment Platform"
      title="Privacy assessment workspace"
      subtitle="Guided, markdown-governed assessments with traceable answers and built-in reviewer context."
      actions={
        <Link href="/assessments/new" className="primary-button">
          Start assessment
        </Link>
      }
    >
      <section className="hero-panel">
        <div className="hero-copy-block">
          <div className="eyebrow-row">
            <span className="tag strong">Template {sampleTemplate.version}</span>
            <span className="tag soft">{sampleTemplate.jurisdictions.join(", ")}</span>
          </div>
          <h2 className="hero-title">Replace spreadsheet-driven ambiguity with a reviewable, markdown-governed workflow.</h2>
          <p className="hero-copy">
            Each question shows plain-English guidance, evidence expectations, and reviewer context in one place.
            Answers are version-pinned to the published template and saved automatically.
          </p>
          <div className="hero-actions">
            <Link href="/assessments/new" className="primary-button">
              Open guided flow
            </Link>
            <Link href="/templates" className="secondary-button">
              Review template governance
            </Link>
          </div>
        </div>

        <div className="hero-stack">
          <div className="metric-card emphasis">
            <span>Workflow</span>
            <strong>Markdown template → guided answers → reviewer summary</strong>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
              <span>Template source</span>
              <strong>Version-pinned markdown</strong>
            </div>
            <div className="metric-card">
              <span>Threat model / TAM</span>
              <strong>Evidence in workflow</strong>
            </div>
            <div className="metric-card">
              <span>Compliance output</span>
              <strong>Explainable, not black-box</strong>
            </div>
            <div className="metric-card">
              <span>Persistence</span>
              <strong>Local + API sync</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel panel-tall">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Assessment operations</p>
              <h2>In-progress assessments</h2>
            </div>
            <Link href="/assessments/new" className="action-link">
              New assessment
            </Link>
          </div>
          <div className="list-board">
            <SavedAssessmentsList />
            <div className="board-row">
              <div>
                <strong>Guidance system</strong>
                <p>Questions include plain-English help, examples, and rationale.</p>
              </div>
              <span className="status-pill good">Active</span>
            </div>
            <div className="board-row">
              <div>
                <strong>API persistence</strong>
                <p>Answers are synced to the backend on each response. Saved locally as backup.</p>
              </div>
              <span className="status-pill good">Active</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Reviewer lens</p>
              <h2>What reviewers need to see</h2>
            </div>
          </div>
          <ul className="signal-list dense">
            <li>Each answer is traceable to the template version and guidance shown at time of response.</li>
            <li>Evidence requests appear when the architecture implies they matter.</li>
            <li>Jurisdiction outcomes point to specific requirements and unanswered gaps.</li>
            <li>Threat model and TAM links are captured in the workflow, not in a separate email chain.</li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Template governance</p>
              <h2>Source of truth posture</h2>
            </div>
            <Link href="/templates" className="action-link">
              Open template registry
            </Link>
          </div>
          <div className="governance-grid">
            <div className="governance-card">
              <span>Template key</span>
              <strong>{sampleTemplate.templateKey}</strong>
            </div>
            <div className="governance-card">
              <span>Jurisdictions</span>
              <strong>{sampleTemplate.jurisdictions.join(", ")}</strong>
            </div>
            <div className="governance-card">
              <span>Question source</span>
              <strong>Published markdown</strong>
            </div>
            <div className="governance-card">
              <span>Version behaviour</span>
              <strong>Immutable snapshots</strong>
            </div>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
