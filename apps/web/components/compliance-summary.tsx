export function ComplianceSummary() {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Explainable coverage summary</h2>
      </div>
      <div className="summary-grid">
        <div className="summary-card">
          <span>Completion</span>
          <strong>68%</strong>
        </div>
        <div className="summary-card">
          <span>Reviewer status</span>
          <strong>Review required</strong>
        </div>
        <div className="summary-card">
          <span>Evidence gaps</span>
          <strong>2</strong>
        </div>
      </div>
      <ul className="signal-list">
        <li>EU_GDPR:ART_4_PERSONAL_DATA appears covered by identified data categories.</li>
        <li>EU_GDPR:ART_22_AUTOMATED_DECISIONS still requires clearer human-intervention evidence.</li>
        <li>This summary is reviewer-assistive and not a final legal determination.</li>
      </ul>
    </section>
  );
}
