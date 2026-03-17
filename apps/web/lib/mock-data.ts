import { ParsedTemplate } from "@dpp/shared";

export interface LocalAssessmentMetadata {
  environment: string;
  defaultAssessmentId: string;
  projectName: string;
  jiraKey: string;
  threatModelUrl: string;
  tamDiagramUrl: string;
}

export const sampleTemplate: ParsedTemplate = {
  templateKey: "dpp_privacy_checklist",
  version: "1.0.0",
  title: "Privacy & Data Protection Compliance Checklist",
  status: "active",
  sourceType: "governed",
  jurisdictions: ["EU_GDPR", "UK_GDPR"],
  sections: [
    {
      key: "direct_identifiers",
      title: "Personal Data Processing - Direct Identifiers",
      order: 1,
      description: "Detect whether direct identifiers are processed anywhere in the solution lifecycle.",
      helpSummary: "Include production, support, analytics, exports, and realistic test data.",
      questions: [
        {
          stableKey: "PDP_DI_001",
          prompt: "Does your product process names of natural persons?",
          responseType: "boolean",
          required: true,
          jurisdictions: ["EU_GDPR", "UK_GDPR"],
          whyItMatters: "Names are direct personal identifiers and usually make personal-data handling obligations applicable.",
          guidance: {
            plainEnglish: "Answer yes if legal names, display names, or contact names are stored, transmitted, exported, or logged.",
            prompts: ["Consider support tooling and exported files."]
          },
          examples: {
            good: ["Customer onboarding stores account holder first and last name in the policy record."],
            bad: ["Users exist in the product."]
          },
          evidence: {
            recommended: ["tam_diagram", "data_inventory"]
          },
          requirementRefs: ["EU_GDPR:ART_4_PERSONAL_DATA"]
        },
        {
          stableKey: "PDP_DI_002",
          prompt: "Does your product process home or business email addresses?",
          responseType: "boolean",
          required: true,
          jurisdictions: ["EU_GDPR", "UK_GDPR"],
          guidance: {
            plainEnglish: "Include employee, customer, partner, and support-contact email addresses."
          },
          examples: {
            good: ["The product sends notifications to named account owners at their work email address."],
            bad: ["We only send messages."]
          }
        }
      ]
    },
    {
      key: "threat_and_architecture_evidence",
      title: "Threat Modelling & TAM Evidence",
      order: 2,
      description: "Ensure architecture evidence exists and is aligned with the assessment.",
      helpSummary: "These questions should usually be answered by the architect or security reviewer.",
      questions: [
        {
          stableKey: "EVID_TM_001",
          prompt: "Has a threat model been created or linked for the in-scope architecture?",
          responseType: "single_select",
          required: true,
          jurisdictions: ["EU_GDPR", "UK_GDPR"],
          options: ["linked", "uploaded", "not_available"],
          guidance: {
            plainEnglish: "Link the current approved threat model if one exists. If not, explain why it is missing."
          },
          evidence: {
            required: ["threat_model"]
          }
        }
      ]
    },
    {
      key: "required_controls",
      title: "Required Privacy Controls & Safeguards",
      order: 3,
      description: "Verify key privacy controls for products processing personal data.",
      questions: [
        {
          stableKey: "CTRL_DP_001",
          prompt: "Ensure Personal Data Minimization.",
          responseType: "boolean",
          required: true,
          jurisdictions: ["EU_GDPR", "UK_GDPR"],
          whyItMatters: "Minimization reduces risk surface and is a core data-protection principle.",
          guidance: {
            plainEnglish: "Answer yes only if the design intentionally limits collection, storage, retention, and exposure to what is necessary."
          },
          examples: {
            good: ["Optional address fields were removed because the business process does not require them."],
            bad: ["We store everything just in case."]
          },
          requirementRefs: ["EU_GDPR:ART_5_DATA_MINIMISATION"]
        }
      ]
    }
  ]
};

export const localDemoMetadata = {
  environment: "Local prototype",
  defaultAssessmentId: "LOCAL-DEMO",
  projectName: "",
  jiraKey: "",
  threatModelUrl: "",
  tamDiagramUrl: ""
} satisfies LocalAssessmentMetadata;
