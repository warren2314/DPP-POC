import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { AssessmentAnswer, EvidenceReference } from "@dpp/shared";
import { TemplateService } from "../templates/template.service";

interface AssessmentRecord {
  id: string;
  templateKey: string;
  templateVersion: string;
  productName: string;
  jurisdictions: string[];
  jiraKey?: string;
  createdBy: string;
  status: "draft" | "in_review" | "changes_requested" | "approved" | "closed";
  answers: AssessmentAnswer[];
  reviewers: string[];
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

@Injectable()
export class AssessmentService {
  private readonly assessments = new Map<string, AssessmentRecord>();

  constructor(private readonly templateService: TemplateService) {}

  createAssessment(input: {
    templateKey: string;
    templateVersion?: string;
    productName: string;
    jurisdictions: string[];
    jiraKey?: string;
    createdBy: string;
  }) {
    const template = this.templateService.getTemplateVersion(input.templateKey, input.templateVersion);
    const now = new Date().toISOString();

    const record: AssessmentRecord = {
      id: uuid(),
      templateKey: input.templateKey,
      templateVersion: template.parsed.version,
      productName: input.productName,
      jurisdictions: input.jurisdictions,
      jiraKey: input.jiraKey,
      createdBy: input.createdBy,
      status: "draft",
      answers: [],
      reviewers: [],
      createdAt: now,
      updatedAt: now
    };

    this.assessments.set(record.id, record);
    return this.getAssessment(record.id);
  }

  getAssessment(assessmentId: string) {
    const record = this.assessments.get(assessmentId);
    if (!record) {
      throw new NotFoundException(`Assessment '${assessmentId}' was not found.`);
    }

    const template = this.templateService.getTemplateVersion(record.templateKey, record.templateVersion);

    return {
      ...record,
      template: template.parsed
    };
  }

  saveAnswer(
    assessmentId: string,
    questionKey: string,
    input: {
      value: boolean | string | string[] | null;
      comment?: string;
      evidenceRefs?: EvidenceReference[];
    }
  ) {
    const record = this.assessments.get(assessmentId);
    if (!record) {
      throw new NotFoundException(`Assessment '${assessmentId}' was not found.`);
    }

    const template = this.templateService.getTemplateVersion(record.templateKey, record.templateVersion);
    const questionExists = template.parsed.sections.some((section) =>
      section.questions.some((question) => question.stableKey === questionKey)
    );

    if (!questionExists) {
      throw new BadRequestException(`Question '${questionKey}' does not exist on the selected template version.`);
    }

    const nextAnswer: AssessmentAnswer = {
      questionKey,
      value: input.value,
      comment: input.comment,
      evidenceRefs: input.evidenceRefs ?? []
    };

    const remainingAnswers = record.answers.filter((answer) => answer.questionKey !== questionKey);
    record.answers = [...remainingAnswers, nextAnswer];
    record.updatedAt = new Date().toISOString();
    this.assessments.set(assessmentId, record);

    return this.getAssessment(assessmentId);
  }

  listAssessments() {
    return Array.from(this.assessments.values()).map((record) => ({
      id: record.id,
      templateKey: record.templateKey,
      templateVersion: record.templateVersion,
      productName: record.productName,
      jurisdictions: record.jurisdictions,
      jiraKey: record.jiraKey,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      answeredCount: record.answers.length
    }));
  }

  submitAssessment(assessmentId: string, input: { submittedBy: string; reviewers: string[] }) {
    const record = this.assessments.get(assessmentId);
    if (!record) {
      throw new NotFoundException(`Assessment '${assessmentId}' was not found.`);
    }

    record.status = "in_review";
    record.reviewers = input.reviewers;
    record.submittedAt = new Date().toISOString();
    record.updatedAt = record.submittedAt;
    this.assessments.set(assessmentId, record);

    return this.getAssessment(assessmentId);
  }
}
