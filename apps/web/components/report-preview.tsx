export function ReportPreview() {
  return (
    <main className="page-shell">
      <section className="report-sheet">
        <p className="eyebrow">Report Preview</p>
        <h1>DPP Assessment Report</h1>
        <div className="report-meta">
          <span>Assessment ID</span>
          <strong>ASM-2026-001</strong>
          <span>Product</span>
          <strong>Collections Portal</strong>
          <span>Jurisdictions</span>
          <strong>EU GDPR, UK GDPR</strong>
        </div>
        <section>
          <h2>Executive Summary</h2>
          <p>
            The assessed solution appears to process direct identifiers and technical identifiers. The template-driven
            workflow has identified missing threat-model evidence and one reviewer clarification area for automated
            decision safeguards.
          </p>
        </section>
        <section>
          <h2>DPP Requirement Coverage Summary</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Status</th>
                <th>Explanation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EU_GDPR:ART_4_PERSONAL_DATA</td>
                <td>Appears met</td>
                <td>Personal data categories were identified and linked to architecture evidence.</td>
              </tr>
              <tr>
                <td>EU_GDPR:ART_22_AUTOMATED_DECISIONS</td>
                <td>Insufficient evidence</td>
                <td>Human-intervention design still requires clearer operational evidence.</td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}
