import { ParsedQuestion } from "@dpp/shared";

export function HelpDrawer({ question }: { question: ParsedQuestion }) {
  return (
    <aside className="side-panel">
      <h3>Answer guidance</h3>
      <p>{question.guidance?.plainEnglish ?? "No plain-English explanation has been configured yet."}</p>
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
