import { Injectable } from "@nestjs/common";
import { AssessmentService } from "../assessments/assessment.service";
import { ComplianceService } from "../compliance/compliance.service";

@Injectable()
export class JiraService {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly complianceService: ComplianceService
  ) {}

  async createOrLinkIssue(
    assessmentId: string,
    input: { mode: "create" | "link"; projectKey?: string; issueType?: string; jiraKey?: string; jiraUrl?: string }
  ) {
    const assessment = this.assessmentService.getAssessment(assessmentId);
    const complianceSummary = this.complianceService.evaluate(assessment.template, assessment.answers);

    if (input.mode === "link") {
      return {
        assessmentId,
        jiraKey: input.jiraKey,
        jiraUrl: input.jiraUrl,
        syncStatus: "linked",
        traceability: {
          productName: assessment.productName,
          templateVersion: assessment.template.version
        }
      };
    }

    const issuePayload = {
      fields: {
        project: { key: input.projectKey ?? process.env.JIRA_PROJECT_KEY ?? "DPP" },
        issuetype: { name: input.issueType ?? process.env.JIRA_ISSUE_TYPE ?? "Task" },
        summary: `DPP Assessment: ${assessment.productName}`,
        description: [
          `Assessment ID: ${assessment.id}`,
          `Template Version: ${assessment.template.version}`,
          `Jurisdictions: ${assessment.jurisdictions.join(", ")}`,
          `Overall Summary: ${complianceSummary.overallStatus}`
        ].join("\n")
      }
    };

    return {
      assessmentId,
      syncStatus: "payload_prepared",
      issuePayload,
      note: "Jira REST call is intentionally stubbed in the starter. Add OAuth/service-account credentials and persistence before production use."
    };
  }
}
