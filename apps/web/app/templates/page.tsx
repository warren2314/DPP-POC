import { AppShell } from "../../components/app-shell";
import { governedFallbackTemplate } from "../../lib/mock-data";

export default function TemplatesPage() {
  return (
    <AppShell
      eyebrow="Template Governance"
      title="Published template registry"
      subtitle="Manage the governed assessment source of truth with immutable versions, visible parsing outcomes, and explicit jurisdiction scope."
    >
      <section className="assessment-overview">
        <div className="overview-card emphasis">
          <span>Active template</span>
          <strong>{governedFallbackTemplate.title}</strong>
          <p>{governedFallbackTemplate.templateKey}</p>
        </div>
        <div className="overview-card">
          <span>Version</span>
          <strong>{governedFallbackTemplate.version}</strong>
        </div>
        <div className="overview-card">
          <span>Source type</span>
          <strong>{governedFallbackTemplate.sourceType}</strong>
        </div>
        <div className="overview-card">
          <span>Jurisdictions</span>
          <strong>{governedFallbackTemplate.jurisdictions.length}</strong>
        </div>
      </section>

      <section className="dashboard-grid single-column">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Version snapshot</p>
              <h2>{governedFallbackTemplate.title}</h2>
            </div>
            <span className="tag strong">{governedFallbackTemplate.version}</span>
          </div>
          <div className="governance-grid compact">
            <div className="governance-card">
              <span>Template key</span>
              <strong>{governedFallbackTemplate.templateKey}</strong>
            </div>
            <div className="governance-card">
              <span>Jurisdictions</span>
              <strong>{governedFallbackTemplate.jurisdictions.join(", ")}</strong>
            </div>
            <div className="governance-card">
              <span>Sections</span>
              <strong>{governedFallbackTemplate.sections.length}</strong>
            </div>
            <div className="governance-card">
              <span>Questions</span>
              <strong>{governedFallbackTemplate.sections.reduce((sum, section) => sum + section.questions.length, 0)}</strong>
            </div>
          </div>
          <table className="report-table elevated">
            <thead>
              <tr>
                <th>Section</th>
                <th>Questions</th>
                <th>Intent</th>
              </tr>
            </thead>
            <tbody>
              {governedFallbackTemplate.sections.map((section) => (
                <tr key={section.key}>
                  <td>{section.title}</td>
                  <td>{section.questions.length}</td>
                  <td>{section.description ?? "No description provided."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </AppShell>
  );
}
