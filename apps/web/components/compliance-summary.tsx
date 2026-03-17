interface ComplianceSummaryProps {
  answeredQuestions: number;
  totalQuestions: number;
  completionPercent: number;
  projectName: string;
  jiraKey: string;
}

export function ComplianceSummary({
  answeredQuestions,
  totalQuestions,
  completionPercent,
  projectName,
  jiraKey
}: ComplianceSummaryProps) {
  const unansweredRequired = totalQuestions - answeredQuestions;

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="section-kicker">Coverage</p>
          <h2>Explainable assessment state</h2>
        </div>
      </div>
      <div className="summary-grid">
        <div className="summary-card">
          <span>Completion</span>
          <strong>{completionPercent}%</strong>
        </div>
        <div className="summary-card">
          <span>Answered questions</span>
          <strong>
            {answeredQuestions}/{totalQuestions}
          </strong>
        </div>
        <div className="summary-card">
          <span>Project</span>
          <strong>{projectName.trim() || "Not named"}</strong>
        </div>
        <div className="summary-card">
          <span>Jira ticket</span>
          <strong>{jiraKey.trim() || "Not linked"}</strong>
        </div>
      </div>
      <div className="status-banner">
        <strong>Assessment posture</strong>
        <p>
          {unansweredRequired > 0
            ? "Review is still premature because mandatory questions remain unanswered."
            : "The questionnaire is complete enough for a reviewer-guided coverage summary."}
        </p>
      </div>
      <ul className="signal-list dense">
        <li>{unansweredRequired} questions remain unanswered in the local prototype.</li>
        <li>The current frontend summary is driven by live answers rather than placeholder numbers.</li>
        <li>Project metadata and evidence links are stored locally for this template version.</li>
        <li>Final requirement coverage should come from backend rules evaluation and reviewer judgement.</li>
      </ul>
    </section>
  );
}
