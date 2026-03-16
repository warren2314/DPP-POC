import { Injectable } from "@nestjs/common";
import { AssessmentService } from "../assessments/assessment.service";
import { ComplianceService } from "../compliance/compliance.service";
import { renderReportHtml, ReportTemplateModel } from "./report-template";

@Injectable()
export class ReportService {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly complianceService: ComplianceService
  ) {}

  generate(assessmentId: string) {
    const assessment = this.assessmentService.getAssessment(assessmentId);
    const complianceSummary = this.complianceService.evaluate(assessment.template, assessment.answers);
    const model: ReportTemplateModel = {
      assessmentId: assessment.id,
      productName: assessment.productName,
      jurisdictions: assessment.jurisdictions,
      generatedAt: new Date().toISOString(),
      templateVersion: assessment.template.version,
      executiveSummary:
        "This is an explainable, reviewer-oriented DPP summary. It highlights answered coverage, missing evidence, and areas requiring reviewer judgement.",
      completionPercent: complianceSummary.completionPercent,
      requirementRows: complianceSummary.requirementSummaries.map((summary) => ({
        requirementRef: summary.requirementRef,
        status: summary.status,
        explanation: summary.explanation
      }))
    };

    return {
      model,
      html: renderReportHtml(model),
      pdfStatus: "not_implemented_in_starter"
    };
  }
}
