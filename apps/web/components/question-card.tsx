import { ParsedQuestion } from "@dpp/shared";

export function QuestionCard({ question }: { question: ParsedQuestion }) {
  return (
    <article className="question-card">
      <div className="question-header">
        <span className="question-key">{question.stableKey}</span>
        <span className="question-required">{question.required ? "Required" : "Optional"}</span>
      </div>
      <h3>{question.prompt}</h3>
      <p className="question-copy">{question.guidance?.plainEnglish ?? "Guidance should be defined in markdown."}</p>
      <div className="answer-cluster">
        {question.responseType === "boolean" ? (
          <>
            <button className="choice-button">Yes</button>
            <button className="choice-button">No</button>
            <button className="choice-button">Unsure</button>
          </>
        ) : (
          question.options?.map((option) => (
            <button className="choice-button" key={option}>
              {option}
            </button>
          ))
        )}
      </div>
      <div className="question-footer">
        <span>{question.whyItMatters ?? "Why this matters should be defined in the template."}</span>
      </div>
    </article>
  );
}
