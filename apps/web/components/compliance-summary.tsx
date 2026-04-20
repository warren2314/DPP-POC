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
        <li>{unansweredRequired > 0 ? `${unansweredRequired} question${unansweredRequired === 1 ? "" : "s"} still need${unansweredRequired === 1 ? "s" : ""} an answer.` : "All questions answered — ready for reviewer summary."}</li>
        <li>Answers and project metadata are saved automatically as you work.</li>
        {jiraKey.trim() ? <li>Linked to Jira ticket {jiraKey.trim()}.</li> : <li>No Jira ticket linked yet — add one in the details panel above.</li>}
      </ul>
    </section>
  );
}
