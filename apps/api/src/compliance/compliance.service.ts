import { Injectable } from "@nestjs/common";
import { AssessmentAnswer, ComplianceSummary, ParsedTemplate } from "@dpp/shared";
import { RulesEvaluationService } from "./rules-evaluation.service";

@Injectable()
export class ComplianceService {
  constructor(private readonly rulesEvaluationService: RulesEvaluationService) {}

  evaluate(template: ParsedTemplate, answers: AssessmentAnswer[]): ComplianceSummary {
    return this.rulesEvaluationService.evaluate(template, answers);
  }
}
