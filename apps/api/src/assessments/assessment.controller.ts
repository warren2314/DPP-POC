import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { EvidenceReference } from "@dpp/shared";
import { AssessmentService } from "./assessment.service";

@Controller("assessments")
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post()
  createAssessment(
    @Body()
    body: {
      templateKey: string;
      templateVersion?: string;
      productName: string;
      jurisdictions: string[];
      jiraKey?: string;
      createdBy: string;
    }
  ) {
    return this.assessmentService.createAssessment(body);
  }

  @Get(":assessmentId")
  getAssessment(@Param("assessmentId") assessmentId: string) {
    return this.assessmentService.getAssessment(assessmentId);
  }

  @Put(":assessmentId/answers/:questionKey")
  saveAnswer(
    @Param("assessmentId") assessmentId: string,
    @Param("questionKey") questionKey: string,
    @Body()
    body: {
      value: boolean | string | string[] | null;
      comment?: string;
      evidenceRefs?: EvidenceReference[];
    }
  ) {
    return this.assessmentService.saveAnswer(assessmentId, questionKey, body);
  }

  @Post(":assessmentId/submit")
  submitAssessment(
    @Param("assessmentId") assessmentId: string,
    @Body() body: { submittedBy: string; reviewers: string[] }
  ) {
    return this.assessmentService.submitAssessment(assessmentId, body);
  }
}
