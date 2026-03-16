import { sampleTemplate } from "../../lib/mock-data";

export default function TemplatesPage() {
  return (
    <main className="page-shell">
      <section className="hero-panel compact">
        <div>
          <p className="eyebrow">Template Governance</p>
          <h1>Published markdown template versions</h1>
          <p className="hero-copy">
            Admins upload markdown, validate parser output, preview conditional logic, and publish immutable versions
            for use in assessments.
          </p>
        </div>
      </section>

      <section className="dashboard-grid single-column">
        <article className="panel">
          <div className="panel-head">
            <h2>{sampleTemplate.title}</h2>
            <span className="tag">{sampleTemplate.version}</span>
          </div>
          <div className="template-summary">
            <p>Template key: {sampleTemplate.templateKey}</p>
            <p>Source type: {sampleTemplate.sourceType}</p>
            <p>Jurisdictions: {sampleTemplate.jurisdictions.join(", ")}</p>
          </div>
          <table className="report-table">
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
    </main>
  );
}
