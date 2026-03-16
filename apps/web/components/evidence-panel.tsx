export function EvidencePanel() {
  return (
    <aside className="side-panel">
      <h3>Threat model / TAM evidence</h3>
      <ul className="signal-list">
        <li>Threat model: not yet linked</li>
        <li>TAM diagram: linked to current Confluence document</li>
        <li>Cross-check: personal-data logging should appear in the threat model scope</li>
      </ul>
      <button className="primary-button">Link artifact</button>
    </aside>
  );
}
