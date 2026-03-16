import { Injectable } from "@nestjs/common";
import { AssessmentAnswer, ComplianceSummary, ParsedTemplate, RequirementSummary } from "@dpp/shared";

@Injectable()
export class RulesEvaluationService {
  evaluate(template: ParsedTemplate, answers: AssessmentAnswer[]): ComplianceSummary {
    const questions = template.sections.flatMap((section) => section.questions);
    const answerMap = new Map(answers.map((answer) => [answer.questionKey, answer]));
    const requirementMap = new Map<string, RequirementSummary>();
    const reviewerAttention: string[] = [];

    for (const question of questions) {
      const answer = answerMap.get(question.stableKey);

      if (question.required && !answer) {
        reviewerAttention.push(`Question ${question.stableKey} is required but unanswered.`);
      }

      for (const requirementRef of question.requirementRefs ?? []) {
        const current = requirementMap.get(requirementRef) ?? {
          requirementRef,
          status: "appears_met" as const,
          explanation: "",
          relatedQuestions: []
        };

        current.relatedQuestions = [...new Set([...current.relatedQuestions, question.stableKey])];

        if (!answer) {
          current.status = "insufficient_evidence";
          current.explanation = `Related question ${question.stableKey} has not been answered.`;
        } else if (question.stableKey.startsWith("CTRL_") && answer.value === false) {
          current.status = "not_met";
          current.explanation = `Control question ${question.stableKey} was answered negatively.`;
        } else if ((question.evidence?.required?.length ?? 0) > 0 && !(answer.evidenceRefs?.length ?? 0)) {
          current.status = "partially_met";
          current.explanation = `Question ${question.stableKey} was answered, but required evidence references are missing.`;
        } else if (!current.explanation) {
          current.explanation = `Relevant question ${question.stableKey} was answered and no blocking issue was detected by starter rules.`;
        }

        requirementMap.set(requirementRef, current);
      }
    }

    const answeredQuestions = answers.length;
    const totalQuestions = questions.length;
    const requirementSummaries = [...requirementMap.values()];
    const hasInsufficient = requirementSummaries.some((summary) => summary.status === "insufficient_evidence");
    const hasAttention = requirementSummaries.some((summary) =>
      ["not_met", "partially_met"].includes(summary.status)
    );

    return {
      overallStatus: hasInsufficient
        ? "review_required"
        : hasAttention
          ? "attention_required"
          : "appears_complete",
      completionPercent: totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100),
      answeredQuestions,
      totalQuestions,
      requirementSummaries,
      reviewerAttention
    };
  }
}
