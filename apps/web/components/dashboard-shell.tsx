import Link from "next/link";
import { AppShell } from "./app-shell";
import { localDemoMetadata, sampleTemplate } from "../lib/mock-data";

export function DashboardShell() {
  return (
    <AppShell
      eyebrow="DPP Assessment Platform"
      title="Operational workspace for guided privacy assessments"
      subtitle="Designed to replace spreadsheet-driven ambiguity with a reviewable, markdown-governed workflow that teams can actually navigate."
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
            <span className="tag soft">{localDemoMetadata.environment}</span>
          </div>
          <h2 className="hero-title">Assessment work should feel like a governed operating model, not a spreadsheet with legal language.</h2>
          <p className="hero-copy">
            This product is structured around three things: the published markdown template, guided user interpretation,
            and traceable reviewer judgement. That should be immediately visible in the UI.
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
            <span>Current operating pattern</span>
            <strong>Markdown template to guided answers to reviewer summary</strong>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
              <span>Template source</span>
              <strong>Version-pinned markdown</strong>
            </div>
            <div className="metric-card">
              <span>Threat model/TAM</span>
              <strong>Evidence in workflow</strong>
            </div>
            <div className="metric-card">
              <span>Compliance output</span>
              <strong>Explainable, not black-box</strong>
            </div>
            <div className="metric-card">
              <span>Jira status</span>
              <strong>Not linked yet</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel panel-tall">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Assessment operations</p>
              <h2>Current workspace state</h2>
            </div>
          </div>
          <div className="list-board">
            <div className="board-row">
              <div>
                <strong>Saved assessments</strong>
                <p>No persisted assessments are loaded into the dashboard yet.</p>
              </div>
              <span className="status-pill neutral">Prototype mode</span>
            </div>
            <div className="board-row">
              <div>
                <strong>Guidance system</strong>
                <p>Questions show plain-English help, examples, and rationale in context.</p>
              </div>
              <span className="status-pill good">Available</span>
            </div>
            <div className="board-row">
              <div>
                <strong>Backend persistence</strong>
                <p>The live API exists, but the frontend is not yet posting assessments end to end.</p>
              </div>
              <span className="status-pill warning">Next build step</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Reviewer lens</p>
              <h2>What should stand out</h2>
            </div>
          </div>
          <ul className="signal-list dense">
            <li>Users should know what a question means before they answer it.</li>
            <li>Evidence requests should appear when the architecture implies they matter.</li>
            <li>Jurisdiction outcomes should point to requirements and unanswered gaps.</li>
            <li>Historic assessments must remain tied to the exact template version used.</li>
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
              <span>Version behavior</span>
              <strong>Immutable snapshots</strong>
            </div>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
