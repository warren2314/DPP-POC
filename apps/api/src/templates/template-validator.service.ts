import { Injectable } from "@nestjs/common";
import { ParsedTemplate } from "@dpp/shared";

export interface TemplateValidationIssue {
  code: string;
  message: string;
  location?: string;
}

export interface TemplateValidationResult {
  valid: boolean;
  errors: TemplateValidationIssue[];
  warnings: TemplateValidationIssue[];
}

@Injectable()
export class TemplateValidatorService {
  validate(template: ParsedTemplate): TemplateValidationResult {
    const errors: TemplateValidationIssue[] = [];
    const warnings: TemplateValidationIssue[] = [];
    const sectionKeys = new Set<string>();
    const questionKeys = new Set<string>();
    const knownQuestionKeys = new Set<string>();

    if (!template.templateKey) {
      errors.push({ code: "MISSING_TEMPLATE_KEY", message: "Template key is required." });
    }

    if (!template.version) {
      errors.push({ code: "MISSING_TEMPLATE_VERSION", message: "Template version is required." });
    }

    if (!template.sections.length) {
      errors.push({ code: "NO_SECTIONS", message: "At least one section is required." });
    }

    for (const section of template.sections) {
      if (sectionKeys.has(section.key)) {
        errors.push({
          code: "DUPLICATE_SECTION_KEY",
          message: `Section key '${section.key}' is duplicated.`,
          location: section.title
        });
      }

      sectionKeys.add(section.key);

      for (const question of section.questions) {
        knownQuestionKeys.add(question.stableKey);

        if (questionKeys.has(question.stableKey)) {
          errors.push({
            code: "DUPLICATE_QUESTION_KEY",
            message: `Question key '${question.stableKey}' is duplicated.`,
            location: section.title
          });
        }

        questionKeys.add(question.stableKey);

        if (!question.guidance?.plainEnglish) {
          warnings.push({
            code: "QUESTION_WITHOUT_GUIDANCE",
            message: `Question '${question.stableKey}' has no plain-English guidance.`,
            location: section.title
          });
        }

        if (!question.examples?.good?.length || !question.examples?.bad?.length) {
          warnings.push({
            code: "QUESTION_WITHOUT_EXAMPLES",
            message: `Question '${question.stableKey}' should include good and bad examples.`,
            location: section.title
          });
        }

        for (const requirementRef of question.requirementRefs ?? []) {
          if (!/^[A-Z_]+:[A-Z0-9_]+$/.test(requirementRef)) {
            errors.push({
              code: "INVALID_REQUIREMENT_REF",
              message: `Requirement reference '${requirementRef}' is invalid.`,
              location: question.stableKey
            });
          }
        }
      }
    }

    for (const section of template.sections) {
      for (const question of section.questions) {
        const clauses = [
          ...(question.displayRules?.all ?? []),
          ...(question.displayRules?.any ?? [])
        ];

        for (const clause of clauses) {
          if (clause.question && !knownQuestionKeys.has(clause.question)) {
            errors.push({
              code: "UNKNOWN_DISPLAY_RULE_QUESTION",
              message: `Display rule references unknown question '${clause.question}'.`,
              location: question.stableKey
            });
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
