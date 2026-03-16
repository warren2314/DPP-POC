import { ParsedQuestion } from "@dpp/shared";

type AnswerValue = boolean | string | null;

interface QuestionCardProps {
  question: ParsedQuestion;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const answerOptions =
    question.responseType === "boolean"
      ? [
          { label: "Yes", value: true, hint: "The solution clearly does this." },
          { label: "No", value: false, hint: "The solution does not do this." },
          { label: "Unsure", value: "unsure", hint: "The requestor needs guidance or evidence." }
        ]
      : (question.options ?? []).map((option) => ({
          label: option.replaceAll("_", " "),
          value: option,
          hint: "Select the option that best reflects the current state."
        }));

  return (
    <article className="question-card">
      <div className="question-banner">
        <div className="question-header">
          <span className="question-key">{question.stableKey}</span>
          <span className="question-required">{question.required ? "Required" : "Optional"}</span>
        </div>
        <div className="chip-row">
          <span className="context-chip">{question.responseType.replaceAll("_", " ")}</span>
          <span className="context-chip">{question.jurisdictions.join(", ")}</span>
        </div>
      </div>
      <h3>{question.prompt}</h3>
      <div className="question-intro">
        <div className="intro-card">
          <span className="intro-label">Plain-English interpretation</span>
          <p>{question.guidance?.plainEnglish ?? "Guidance should be defined in markdown."}</p>
        </div>
        <div className="intro-card subtle">
          <span className="intro-label">Why reviewers care</span>
          <p>{question.whyItMatters ?? "Why this matters should be defined in the template."}</p>
        </div>
      </div>

      <div className="answer-grid">
        {answerOptions.map((option) => (
          <button
            className={`choice-card ${value === option.value ? "selected" : ""}`}
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <strong>{option.label}</strong>
            <span>{option.hint}</span>
          </button>
        ))}
      </div>

      <div className="answer-status">
        <strong>Current answer</strong>
        <span>{value === null ? "Not answered yet" : String(value)}</span>
      </div>

      {question.guidance?.prompts?.length ? (
        <div className="question-footer">
          <span className="intro-label">Prompt the requestor to think about:</span>
          <ul className="plain-list">
            {question.guidance.prompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {question.requirementRefs?.length ? (
        <div className="reference-strip">
          {question.requirementRefs.map((requirementRef) => (
            <span className="reference-chip" key={requirementRef}>
              {requirementRef}
            </span>
          ))}
        </div>
      ) : null}

      {(question.examples?.good?.length ?? 0) > 0 || (question.examples?.bad?.length ?? 0) > 0 ? (
        <div className="example-grid">
          <div className="example-card good">
            <span className="intro-label">Strong answer pattern</span>
            <p>{question.examples?.good?.[0] ?? "Add a positive example in the markdown template."}</p>
          </div>
          <div className="example-card bad">
            <span className="intro-label">Weak answer pattern</span>
            <p>{question.examples?.bad?.[0] ?? "Add a weak-answer example in the markdown template."}</p>
          </div>
        </div>
      ) : null}

      <div className="question-footer compact">
        <span>This question is rendered directly from the published markdown template and should remain version-traceable.</span>
      </div>
    </article>
  );
}
