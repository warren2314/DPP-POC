import { ParsedQuestion } from "@dpp/shared";

export function HelpDrawer({ question }: { question: ParsedQuestion }) {
  return (
    <aside className="side-panel">
      <div className="side-panel-header">
        <p className="section-kicker">Guidance</p>
        <h3>How to answer this well</h3>
      </div>
      <p>{question.guidance?.plainEnglish ?? "No plain-English explanation has been configured yet."}</p>

      <div className="insight-card">
        <span className="intro-label">Reviewer expectation</span>
        <p>
          Provide an answer that can be defended against the architecture, data flows, logs, exports, and operating
          model. Short unsupported answers should not pass review.
        </p>
      </div>

      <div className="example-block">
        <strong>Good answer</strong>
        <p>{question.examples?.good?.[0] ?? "Add a positive example in the markdown template."}</p>
      </div>

      <div className="example-block">
        <strong>Weak answer</strong>
        <p>{question.examples?.bad?.[0] ?? "Add a weak-answer example in the markdown template."}</p>
      </div>
    </aside>
  );
}
