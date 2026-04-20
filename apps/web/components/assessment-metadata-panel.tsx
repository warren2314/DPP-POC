import type { LocalAssessmentMetadata } from "../lib/mock-data";

export type EditableAssessmentMetadataField = "projectName" | "jiraKey" | "threatModelUrl" | "tamDiagramUrl";

interface AssessmentMetadataPanelProps {
  metadata: LocalAssessmentMetadata;
  onChange: (field: EditableAssessmentMetadataField, value: string) => void;
  onJiraSync?: (jiraKey: string) => Promise<{ jiraUrl: string } | null>;
  jiraSyncStatus?: "idle" | "syncing" | "synced" | "error";
}

export function AssessmentMetadataPanel({ metadata, onChange, onJiraSync, jiraSyncStatus = "idle" }: AssessmentMetadataPanelProps) {
  const canSync = Boolean(onJiraSync && metadata.jiraKey.trim());

  const syncLabel =
    jiraSyncStatus === "syncing" ? "Syncing…" :
    jiraSyncStatus === "synced" ? "Synced" :
    jiraSyncStatus === "error" ? "Sync failed" :
    "Sync to Jira";

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
          <div className="metadata-input-row">
            <input
              className="metadata-input"
              onChange={(event) => onChange("jiraKey", event.target.value)}
              placeholder="WAR-123"
              type="text"
              value={metadata.jiraKey}
            />
            {canSync ? (
              <button
                className={`secondary-button compact ${jiraSyncStatus === "synced" ? "success" : jiraSyncStatus === "error" ? "danger" : ""}`}
                disabled={jiraSyncStatus === "syncing"}
                onClick={() => void onJiraSync!(metadata.jiraKey.trim())}
                type="button"
              >
                {syncLabel}
              </button>
            ) : null}
          </div>
          <span className="metadata-help">Enter a ticket key (e.g. WAR-123) then sync to attach the assessment as a comment.</span>
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
          <span className="metadata-help">Opens directly from the evidence panel alongside each question.</span>
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
          <span className="metadata-help">Opens directly from the evidence panel so TAM evidence can be reviewed in context.</span>
        </label>
      </div>
    </section>
  );
}
