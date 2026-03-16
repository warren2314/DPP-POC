import { AppShell } from "../../components/app-shell";
import { sampleTemplate } from "../../lib/mock-data";

export default function TemplatesPage() {
  return (
    <AppShell
      eyebrow="Template Governance"
      title="Published markdown template registry"
      subtitle="Template management needs the same rigor as the assessments themselves: immutable versions, visible parsing outcomes, and explicit jurisdiction scope."
    >
      <section className="assessment-overview">
        <div className="overview-card emphasis">
          <span>Active template</span>
          <strong>{sampleTemplate.title}</strong>
          <p>{sampleTemplate.templateKey}</p>
        </div>
        <div className="overview-card">
          <span>Version</span>
          <strong>{sampleTemplate.version}</strong>
        </div>
        <div className="overview-card">
          <span>Source type</span>
          <strong>{sampleTemplate.sourceType}</strong>
        </div>
        <div className="overview-card">
          <span>Jurisdictions</span>
          <strong>{sampleTemplate.jurisdictions.length}</strong>
        </div>
      </section>

      <section className="dashboard-grid single-column">
        <article className="panel">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Version snapshot</p>
              <h2>{sampleTemplate.title}</h2>
            </div>
            <span className="tag strong">{sampleTemplate.version}</span>
          </div>
          <div className="governance-grid compact">
            <div className="governance-card">
              <span>Template key</span>
              <strong>{sampleTemplate.templateKey}</strong>
            </div>
            <div className="governance-card">
              <span>Jurisdictions</span>
              <strong>{sampleTemplate.jurisdictions.join(", ")}</strong>
            </div>
            <div className="governance-card">
              <span>Sections</span>
              <strong>{sampleTemplate.sections.length}</strong>
            </div>
            <div className="governance-card">
              <span>Questions</span>
              <strong>{sampleTemplate.sections.reduce((sum, section) => sum + section.questions.length, 0)}</strong>
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
              {sampleTemplate.sections.map((section) => (
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
