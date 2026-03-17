import type { LocalAssessmentMetadata } from "../lib/mock-data";

export type EditableAssessmentMetadataField = "projectName" | "jiraKey" | "threatModelUrl" | "tamDiagramUrl";

interface AssessmentMetadataPanelProps {
  metadata: LocalAssessmentMetadata;
  onChange: (field: EditableAssessmentMetadataField, value: string) => void;
}

export function AssessmentMetadataPanel({ metadata, onChange }: AssessmentMetadataPanelProps) {
  return (
    <section className="panel" id="assessment-details">
      <div className="panel-head">
        <div>
          <p className="section-kicker">Assessment details</p>
          <h2>Project and evidence links</h2>
        </div>
      </div>
      <div className="metadata-grid">
        <label className="metadata-field">
          <span className="metadata-label">Project name</span>
          <input
            className="metadata-input"
            onChange={(event) => onChange("projectName", event.target.value)}
            placeholder="Collections Portal"
            type="text"
            value={metadata.projectName}
          />
          <span className="metadata-help">Used in the assessment context so reviewers can see what is in scope.</span>
        </label>

        <label className="metadata-field">
          <span className="metadata-label">Jira ticket ID</span>
          <input
            className="metadata-input"
            onChange={(event) => onChange("jiraKey", event.target.value)}
            placeholder="DPP-431"
            type="text"
            value={metadata.jiraKey}
          />
          <span className="metadata-help">Store the linked issue key even before Jira sync is wired end to end.</span>
        </label>

        <label className="metadata-field">
          <span className="metadata-label">Threat model link</span>
          <input
            className="metadata-input"
            onChange={(event) => onChange("threatModelUrl", event.target.value)}
            placeholder="https://confluence.example.com/display/TM/042"
            type="url"
            value={metadata.threatModelUrl}
          />
          <span className="metadata-help">Used by the sidebar shortcut. Hostnames are normalized to HTTPS automatically.</span>
        </label>

        <label className="metadata-field">
          <span className="metadata-label">TAM link</span>
          <input
            className="metadata-input"
            onChange={(event) => onChange("tamDiagramUrl", event.target.value)}
            placeholder="https://confluence.example.com/display/TAM/123"
            type="url"
            value={metadata.tamDiagramUrl}
          />
          <span className="metadata-help">Used by the sidebar shortcut so TAM evidence can be opened directly.</span>
        </label>
      </div>
    </section>
  );
}
