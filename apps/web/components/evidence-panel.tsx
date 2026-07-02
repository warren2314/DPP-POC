import { normalizeExternalUrl } from "../lib/external-links";

interface EvidencePanelProps {
  evidenceLabels: string[];
  threatModelUrl: string;
  tamDiagramUrl: string;
}

export function EvidencePanel({ evidenceLabels, threatModelUrl, tamDiagramUrl }: EvidencePanelProps) {
  const threatModelHref = normalizeExternalUrl(threatModelUrl);
  const tamDiagramHref = normalizeExternalUrl(tamDiagramUrl);
  const hasInvalidThreatModelLink = threatModelUrl.trim().length > 0 && !threatModelHref;
  const hasInvalidTamLink = tamDiagramUrl.trim().length > 0 && !tamDiagramHref;

  return (
    <aside className="side-panel">
      <div className="side-panel-header">
        <p className="section-kicker">Architecture evidence</p>
        <h3>Threat model and TAM</h3>
      </div>
      <div className="evidence-stack">
        <div className="evidence-item">
          <span>Threat model</span>
          <strong>{threatModelHref ? "Linked" : hasInvalidThreatModelLink ? "Invalid link" : "Not linked"}</strong>
          {threatModelHref ? (
            <a className="artifact-link" href={threatModelHref} rel="noreferrer" target="_blank">
              Open threat model
            </a>
          ) : (
            <p>{hasInvalidThreatModelLink ? "Check the URL format in Assessment details." : "Add the URL in Assessment details to make this shortcut live."}</p>
          )}
        </div>
        <div className="evidence-item">
          <span>TAM diagram</span>
          <strong>{tamDiagramHref ? "Linked" : hasInvalidTamLink ? "Invalid link" : "Not linked"}</strong>
          {tamDiagramHref ? (
            <a className="artifact-link" href={tamDiagramHref} rel="noreferrer" target="_blank">
              Open TAM link
            </a>
          ) : (
            <p>{hasInvalidTamLink ? "Check the URL format in Assessment details." : "Add the URL in Assessment details to make this shortcut live."}</p>
          )}
        </div>
      </div>
      <ul className="signal-list dense">
        {evidenceLabels.length > 0 ? (
          <li>Expected evidence for this question: {evidenceLabels.join(", ")}.</li>
        ) : (
          <li>This question has no explicit evidence requirement configured.</li>
        )}
        <li>Evidence metadata should identify source, version, owner, and review date.</li>
        <li>Conditional prompts highlight missing controls when the architecture implies additional review.</li>
      </ul>
      <a className="primary-button full-width" href="#assessment-details">
        Manage artifact links
      </a>
    </aside>
  );
}
