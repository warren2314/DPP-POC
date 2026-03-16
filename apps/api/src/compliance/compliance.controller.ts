import { Controller, Get, Param } from "@nestjs/common";
import { AssessmentService } from "../assessments/assessment.service";
import { ComplianceService } from "./compliance.service";

@Controller("assessments/:assessmentId/compliance-summary")
export class ComplianceController {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly complianceService: ComplianceService
  ) {}

  @Get()
  getComplianceSummary(@Param("assessmentId") assessmentId: string) {
    const assessment = this.assessmentService.getAssessment(assessmentId);
    return this.complianceService.evaluate(assessment.template, assessment.answers);
  }
}
