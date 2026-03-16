export function EvidencePanel({ evidenceLabels }: { evidenceLabels: string[] }) {
  return (
    <aside className="side-panel">
      <div className="side-panel-header">
        <p className="section-kicker">Architecture evidence</p>
        <h3>Threat model and TAM</h3>
      </div>
      <div className="evidence-stack">
        <div className="evidence-item">
          <span>Threat model</span>
          <strong>Not linked</strong>
        </div>
        <div className="evidence-item">
          <span>TAM diagram</span>
          <strong>Not linked</strong>
        </div>
      </div>
      <ul className="signal-list dense">
        {evidenceLabels.length > 0 ? (
          <li>Expected evidence for this question: {evidenceLabels.join(", ")}.</li>
        ) : (
          <li>This question has no explicit evidence requirement configured.</li>
        )}
        <li>When the backend is wired, evidence metadata should track source, version, owner, and review date.</li>
        <li>This panel should eventually drive conditional prompts when the architecture implies missing controls.</li>
      </ul>
      <button className="primary-button full-width" type="button">
        Link artifact
      </button>
    </aside>
  );
}
