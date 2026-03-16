export type JurisdictionCode = "EU_GDPR" | "UK_GDPR" | "CCPA" | "LGPD";

export type TemplateStatus = "draft" | "active" | "retired";

export type ResponseType =
  | "boolean"
  | "single_select"
  | "multi_select"
  | "text"
  | "long_text"
  | "date"
  | "evidence_reference";

export type AssessmentStatus =
  | "draft"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "closed";

export type EvidenceType =
  | "threat_model"
  | "tam_diagram"
  | "data_inventory"
  | "interface_specification"
  | "logging_standard"
  | "legal_basis_note"
  | "model_governance_note"
  | "operating_procedure"
  | "audit_log_design"
  | "data_retention_policy";

export interface TemplateFrontmatter {
  templateKey: string;
  version: string;
  title: string;
  status: TemplateStatus;
  sourceType: "legacy" | "governed";
  jurisdictions: JurisdictionCode[];
  owners: string[];
  reviewRoles: string[];
  derivedFrom?: string;
}

export interface ConditionalRuleClause {
  question?: string;
  fact?: string;
  equals?: boolean | string | number;
  jurisdictionIn?: JurisdictionCode[];
}

export interface ConditionalRuleGroup {
  all?: ConditionalRuleClause[];
  any?: ConditionalRuleClause[];
}

export interface QuestionGuidance {
  plainEnglish?: string;
  prompts?: string[];
}

export interface QuestionExamples {
  good?: string[];
  bad?: string[];
}

export interface QuestionEvidence {
  required?: EvidenceType[];
  recommended?: EvidenceType[];
}

export interface DecisionEffects {
  yesSetsFlags?: string[];
  noSetsFlags?: string[];
}

export interface ParsedQuestion {
  stableKey: string;
  prompt: string;
  responseType: ResponseType;
  required: boolean;
  jurisdictions: JurisdictionCode[];
  whyItMatters?: string;
  guidance?: QuestionGuidance;
  examples?: QuestionExamples;
  evidence?: QuestionEvidence;
  requirementRefs?: string[];
  options?: string[];
  displayRules?: ConditionalRuleGroup;
  validationRules?: string[];
  consistencyChecks?: string[];
  decisionEffects?: DecisionEffects;
}

export interface ParsedSection {
  key: string;
  title: string;
  order: number;
  description?: string;
  helpSummary?: string;
  mapsTo?: string[];
  questions: ParsedQuestion[];
}

export interface ParsedTemplate {
  templateKey: string;
  version: string;
  title: string;
  status: TemplateStatus;
  sourceType: "legacy" | "governed";
  checksum?: string;
  jurisdictions: JurisdictionCode[];
  sections: ParsedSection[];
}

export interface EvidenceReference {
  type: EvidenceType;
  uri?: string;
  fileName?: string;
  versionLabel?: string;
}

export interface AssessmentAnswer {
  questionKey: string;
  value: boolean | string | string[] | null;
  comment?: string;
  evidenceRefs?: EvidenceReference[];
}

export interface RequirementSummary {
  requirementRef: string;
  status:
    | "appears_met"
    | "partially_met"
    | "not_met"
    | "insufficient_evidence"
    | "not_applicable";
  explanation: string;
  relatedQuestions: string[];
}

export interface ComplianceSummary {
  overallStatus: "review_required" | "attention_required" | "appears_complete";
  completionPercent: number;
  answeredQuestions: number;
  totalQuestions: number;
  requirementSummaries: RequirementSummary[];
  reviewerAttention: string[];
}
