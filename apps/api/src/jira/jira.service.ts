import { Injectable, InternalServerErrorException } from "@nestjs/common";
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
      if (!input.jiraKey) {
        throw new InternalServerErrorException("jiraKey is required for link mode.");
      }
      await this.addAssessmentComment(input.jiraKey, assessmentId, assessment, complianceSummary);
      return {
        assessmentId,
        jiraKey: input.jiraKey,
        jiraUrl: `${this.baseUrl}/browse/${input.jiraKey}`,
        syncStatus: "linked"
      };
    }

    // create mode — open a new issue and return its key
    const issueKey = await this.createIssue(assessment, complianceSummary, input);
    return {
      assessmentId,
      jiraKey: issueKey,
      jiraUrl: `${this.baseUrl}/browse/${issueKey}`,
      syncStatus: "created"
    };
  }

  private get baseUrl(): string {
    const url = process.env.JIRA_BASE_URL;
    if (!url) throw new InternalServerErrorException("JIRA_BASE_URL is not configured.");
    return url.replace(/\/$/, "");
  }

  private get authHeader(): string {
    const user = process.env.JIRA_USERNAME;
    const token = process.env.JIRA_API_TOKEN;
    if (!user || !token) throw new InternalServerErrorException("JIRA_USERNAME or JIRA_API_TOKEN is not configured.");
    return `Basic ${Buffer.from(`${user}:${token}`).toString("base64")}`;
  }

  private async jiraFetch(path: string, options: RequestInit): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.authHeader,
        Accept: "application/json",
        ...(options.headers as Record<string, string> | undefined)
      }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new InternalServerErrorException(`Jira API error ${response.status}: ${body}`);
    }

    return response.json();
  }

  private async addAssessmentComment(
    issueKey: string,
    assessmentId: string,
    assessment: ReturnType<AssessmentService["getAssessment"]>,
    complianceSummary: ReturnType<ComplianceService["evaluate"]>
  ): Promise<void> {
    const lines = [
      `*DPP Assessment linked* — ${assessment.productName}`,
      "",
      `| Field | Value |`,
      `|---|---|`,
      `| Assessment ID | ${assessmentId} |`,
      `| Template | ${assessment.template.templateKey} v${assessment.template.version} |`,
      `| Jurisdictions | ${assessment.jurisdictions.join(", ")} |`,
      `| Overall status | ${complianceSummary.overallStatus} |`,
      `| Answered | ${assessment.answers.length} question(s) |`
    ];

    await this.jiraFetch(`/rest/api/2/issue/${issueKey}/comment`, {
      method: "POST",
      body: JSON.stringify({ body: lines.join("\n") })
    });
  }

  private async createIssue(
    assessment: ReturnType<AssessmentService["getAssessment"]>,
    complianceSummary: ReturnType<ComplianceService["evaluate"]>,
    input: { projectKey?: string; issueType?: string }
  ): Promise<string> {
    const description = [
      `DPP Assessment: ${assessment.productName}`,
      "",
      `Assessment ID: ${assessment.id}`,
      `Template: ${assessment.template.templateKey} v${assessment.template.version}`,
      `Jurisdictions: ${assessment.jurisdictions.join(", ")}`,
      `Overall status: ${complianceSummary.overallStatus}`,
      `Answered: ${assessment.answers.length} question(s)`
    ].join("\n");

    const result = (await this.jiraFetch("/rest/api/2/issue", {
      method: "POST",
      body: JSON.stringify({
        fields: {
          project: { key: input.projectKey ?? process.env.JIRA_PROJECT_KEY ?? "DPP" },
          issuetype: { name: input.issueType ?? process.env.JIRA_ISSUE_TYPE ?? "Task" },
          summary: `DPP Assessment: ${assessment.productName}`,
          description
        }
      })
    })) as { key: string };

    return result.key;
  }
}
