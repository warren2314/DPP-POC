export function ReportPreview() {
  return (
    <main className="page-shell">
      <section className="report-sheet">
        <div className="report-hero">
          <div>
            <p className="eyebrow">Report Preview</p>
            <h1>DPP Assessment Report</h1>
            <p className="hero-copy">
              Report output should read like a professional internal governance artefact: clear provenance, executive
              summary, requirement posture, reviewer notes, and linked evidence.
            </p>
          </div>
          <div className="report-badge">Draft snapshot</div>
        </div>

        <div className="report-meta-grid">
          <div>
            <span>Assessment ID</span>
            <strong>ASM-2026-001</strong>
          </div>
          <div>
            <span>Product</span>
            <strong>Collections Portal</strong>
          </div>
          <div>
            <span>Jurisdictions</span>
            <strong>EU GDPR, UK GDPR</strong>
          </div>
          <div>
            <span>Template</span>
            <strong>dpp_privacy_checklist v1.0.0</strong>
          </div>
        </div>

        <section className="report-section">
          <h2>Executive Summary</h2>
          <p>
            The assessed solution appears to process direct identifiers and technical identifiers. The template-driven
            workflow has identified missing threat-model evidence and one reviewer clarification area for automated
            decision safeguards.
          </p>
        </section>

        <section className="report-section two-column">
          <div>
            <h2>Scope</h2>
            <p>In scope: customer-facing onboarding workflow, supporting APIs, audit logging, and support-access flows.</p>
          </div>
          <div>
            <h2>Evidence posture</h2>
            <p>Threat model evidence is incomplete. TAM coverage is present but requires reviewer confirmation.</p>
          </div>
        </section>

        <section className="report-section">
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

        <section className="report-section two-column">
          <div>
            <h2>Reviewer Notes</h2>
            <p>Clarify whether automated decision overrides are operationally enforced or only procedurally described.</p>
          </div>
          <div>
            <h2>Jira Linkage</h2>
            <p>No Jira issue linked in the local prototype. Production flow should record issue key, sync status, and report URL.</p>
          </div>
        </section>
      </section>
    </main>
  );
}
