import { Body, Controller, Param, Post } from "@nestjs/common";
import { JiraService } from "./jira.service";

@Controller("assessments/:assessmentId/jira-links")
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @Post()
  createOrLink(
    @Param("assessmentId") assessmentId: string,
    @Body()
    body: {
      mode: "create" | "link";
      projectKey?: string;
      issueType?: string;
      jiraKey?: string;
      jiraUrl?: string;
    }
  ) {
    return this.jiraService.createOrLinkIssue(assessmentId, body);
  }
}
