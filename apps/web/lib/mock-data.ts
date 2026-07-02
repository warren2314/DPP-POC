import type {
  ConditionalRuleGroup,
  DecisionEffects,
  EvidenceType,
  JurisdictionCode,
  ParsedQuestion,
  ParsedTemplate,
  QuestionExamples,
  QuestionEvidence
} from "@dpp/shared";

export interface LocalAssessmentMetadata {
  environment: string;
  defaultAssessmentId: string;
  projectName: string;
  jiraKey: string;
  threatModelUrl: string;
  tamDiagramUrl: string;
}

const jurisdictions: JurisdictionCode[] = ["EU_GDPR", "UK_GDPR"];
const directEvidence: EvidenceType[] = ["tam_diagram", "data_inventory"];
const architectureEvidence: EvidenceType[] = ["threat_model", "tam_diagram"];

interface ChecklistQuestionInput {
  stableKey: string;
  prompt: string;
  whyItMatters?: string;
  guidance?: string;
  prompts?: string[];
  examples?: QuestionExamples;
  evidence?: QuestionEvidence;
  requirementRefs?: string[];
  decisionEffects?: DecisionEffects;
  displayRules?: ConditionalRuleGroup;
}

function defaultExamples(prompt: string): QuestionExamples {
  return {
    good: [`The assessment identifies whether this applies and cites the relevant system, data flow, or control for: ${prompt}`],
    bad: ["The answer is unsupported or only describes the solution at a high level."]
  };
}

function booleanQuestion(input: ChecklistQuestionInput): ParsedQuestion {
  return {
    stableKey: input.stableKey,
    prompt: input.prompt,
    responseType: "boolean",
    required: true,
    jurisdictions,
    whyItMatters:
      input.whyItMatters ??
      "This answer determines whether additional privacy controls, evidence, and reviewer scrutiny are required.",
    guidance: {
      plainEnglish:
        input.guidance ??
        "Answer yes if the product stores, transmits, logs, exports, derives, or otherwise processes this data or control in any environment.",
      prompts: input.prompts ?? [
        "Consider production, support, reporting, analytics, exported files, logs, integrations, and realistic test data."
      ]
    },
    examples: input.examples ?? defaultExamples(input.prompt),
    evidence: input.evidence ?? { recommended: directEvidence },
    requirementRefs: input.requirementRefs ?? ["EU_GDPR:ART_4_PERSONAL_DATA", "UK_GDPR:ART_4_PERSONAL_DATA"],
    decisionEffects: input.decisionEffects,
    displayRules: input.displayRules
  };
}

export const governedFallbackTemplate: ParsedTemplate = {
  templateKey: "dpp_privacy_checklist",
  version: "1.0.0",
  title: "Privacy & Data Protection Compliance Checklist",
  status: "active",
  sourceType: "governed",
  jurisdictions,
  sections: [
    {
      key: "direct_identifiers",
      title: "Personal Data Processing - Direct Identifiers",
      order: 1,
      description: "Detect whether direct identifiers are processed anywhere in the solution lifecycle.",
      helpSummary: "Include production, support, analytics, exports, and realistic test data.",
      questions: [
        booleanQuestion({
          stableKey: "PDP_DI_001",
          prompt: "Does your product process names of natural persons?",
          whyItMatters: "Names are direct personal identifiers and usually make personal-data handling obligations applicable.",
          guidance: "Answer yes if legal names, display names, or contact names are stored, transmitted, exported, or logged.",
          prompts: ["Consider support tooling and exported files.", "Consider seeded test data if it contains realistic personal names."],
          examples: {
            good: ["Customer onboarding stores account holder first and last name in the policy record."],
            bad: ["Users exist in the product."]
          },
          decisionEffects: { yesSetsFlags: ["personal_data_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_DI_002",
          prompt: "Does your product process home or business email addresses?",
          whyItMatters: "Email addresses are generally personal data when they identify or relate to a natural person.",
          guidance: "Include employee, customer, partner, and support-contact email addresses.",
          evidence: { recommended: ["tam_diagram", "interface_specification"] },
          examples: {
            good: ["The product sends notifications to named account owners at their work email address."],
            bad: ["We only send messages."]
          },
          decisionEffects: { yesSetsFlags: ["personal_data_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_DI_003",
          prompt: "Does your product process home or business addresses of natural persons?",
          guidance: "Include residential addresses, work addresses, billing addresses, correspondence addresses, and delivery addresses.",
          decisionEffects: { yesSetsFlags: ["personal_data_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_DI_004",
          prompt: "Does your product process personal or business phone numbers?",
          guidance: "Include mobile, landline, office, support-contact, and emergency-contact phone numbers.",
          decisionEffects: { yesSetsFlags: ["personal_data_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_DI_005",
          prompt: "Does your product process other information which identifies individuals in terms of making them directly addressable or contactable?",
          guidance: "Include usernames, handles, postal contact routes, messaging IDs, or other direct contact identifiers.",
          decisionEffects: { yesSetsFlags: ["personal_data_present"] }
        })
      ]
    },
    {
      key: "technical_identifiers",
      title: "Technical Identifiers",
      order: 2,
      description: "Identify technical identifiers that can directly or indirectly relate to a natural person.",
      questions: [
        booleanQuestion({
          stableKey: "PDP_TI_001",
          prompt: "Does your product process IP addresses?",
          whyItMatters: "IP addresses may be personal data and often require logging, retention, and access-control consideration.",
          guidance: "Include application logs, reverse proxy logs, monitoring tools, and support exports.",
          evidence: { recommended: ["threat_model", "logging_standard"] },
          decisionEffects: { yesSetsFlags: ["technical_identifier_present", "logging_review_needed"] }
        }),
        booleanQuestion({
          stableKey: "PDP_TI_002",
          prompt: "Does your product write identifiers like the user ID to log or trace files?",
          whyItMatters: "Logging identifiers can create sensitive secondary data stores that need access control and retention controls.",
          guidance: "Think about application logs, audit logs, tracing, SIEM exports, and debugging snapshots.",
          evidence: { required: architectureEvidence },
          requirementRefs: ["EU_GDPR:ART_5_DATA_MINIMISATION", "EU_GDPR:ART_32_SECURITY"],
          decisionEffects: { yesSetsFlags: ["logging_review_needed"] }
        }),
        booleanQuestion({
          stableKey: "PDP_TI_003",
          prompt: "Does your product process any device numbers such as the media access control (MAC) address?",
          guidance: "Include device IDs, MAC addresses, hardware identifiers, and identifiers received from mobile or desktop clients.",
          decisionEffects: { yesSetsFlags: ["technical_identifier_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_TI_004",
          prompt: "Does your product process identifiers like customer number, supplier number, employee number?",
          guidance: "Include internal and external reference numbers that can identify a person alone or in combination with other data.",
          decisionEffects: { yesSetsFlags: ["technical_identifier_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_TI_005",
          prompt: "Does your product process user ID numbers?",
          guidance: "Include account IDs, login IDs, subject IDs, IAM identifiers, and IDs exchanged with identity providers.",
          decisionEffects: { yesSetsFlags: ["technical_identifier_present"] }
        })
      ]
    },
    {
      key: "financial_legal_identifiers",
      title: "Financial & Legal Identifiers",
      order: 3,
      description: "Identify regulated identifiers that require stronger handling controls.",
      questions: [
        booleanQuestion({ stableKey: "PDP_FIN_001", prompt: "Does your product process vehicle license plate numbers?" }),
        booleanQuestion({ stableKey: "PDP_FIN_002", prompt: "Does your product process vehicle identity numbers?" }),
        booleanQuestion({ stableKey: "PDP_FIN_003", prompt: "Does your product process membership numbers?" }),
        booleanQuestion({
          stableKey: "PDP_FIN_004",
          prompt: "Does your product process bank account numbers?",
          evidence: { required: architectureEvidence, recommended: ["data_inventory"] }
        }),
        booleanQuestion({
          stableKey: "PDP_FIN_005",
          prompt: "Does your product process credit card numbers?",
          evidence: { required: architectureEvidence, recommended: ["data_inventory"] }
        }),
        booleanQuestion({
          stableKey: "PDP_FIN_006",
          prompt: "Does your product process medical record numbers?",
          evidence: { required: ["threat_model", "tam_diagram", "legal_basis_note"] }
        }),
        booleanQuestion({
          stableKey: "PDP_FIN_007",
          prompt: "Does your product process health plan benefit numbers?",
          evidence: { required: ["threat_model", "tam_diagram", "legal_basis_note"] }
        })
      ]
    },
    {
      key: "biometric_visual_data",
      title: "Biometric & Visual Data",
      order: 4,
      description: "Identify biometric and image data that may enable identification.",
      questions: [
        booleanQuestion({
          stableKey: "PDP_BIO_001",
          prompt: "Does your product process biometric information?",
          evidence: { required: ["threat_model", "tam_diagram", "legal_basis_note"] },
          requirementRefs: ["EU_GDPR:ART_9_SPECIAL_CATEGORIES"]
        }),
        booleanQuestion({
          stableKey: "PDP_BIO_002",
          prompt: "Does your product process biometric identifiers like fingerprints or voice prints?",
          evidence: { required: ["threat_model", "tam_diagram", "legal_basis_note"] },
          requirementRefs: ["EU_GDPR:ART_9_SPECIAL_CATEGORIES"]
        }),
        booleanQuestion({
          stableKey: "PDP_BIO_003",
          prompt: "Does your product process full face photographic images or any comparable images which allow the identification of natural persons?",
          evidence: { required: architectureEvidence, recommended: ["data_inventory"] }
        })
      ]
    },
    {
      key: "temporal_location_data",
      title: "Temporal & Location Data",
      order: 5,
      description: "Identify date and location data that can relate to natural persons.",
      questions: [
        booleanQuestion({
          stableKey: "PDP_TEMP_001",
          prompt: "Does your product process dates directly related to natural persons like date of birth, medical facility admission and discharge dates, entry dates, termination dates?"
        }),
        booleanQuestion({
          stableKey: "PDP_TEMP_002",
          prompt: "Does your product process geo location data of devices which can be linked to natural persons like mobile phones or cars?",
          evidence: { required: architectureEvidence }
        })
      ]
    },
    {
      key: "indirect_identifiers_profiling",
      title: "Indirect Identifiers & Profiling",
      order: 6,
      description: "Identify data that may identify a person indirectly or through profiling.",
      questions: [
        booleanQuestion({
          stableKey: "PDP_IND_001",
          prompt: "Does your product process unique information like browser footprints which may lead to an identification of a natural person?",
          decisionEffects: { yesSetsFlags: ["profiling_or_indirect_identifier_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_IND_002",
          prompt: "Does your product process other information which contains identifiers that enable an indirect connection to an individual?",
          decisionEffects: { yesSetsFlags: ["profiling_or_indirect_identifier_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_IND_003",
          prompt: "Does your product process information that contains or is associated with a characteristic or a set of attributes which distinguishes a natural person from other natural persons?",
          decisionEffects: { yesSetsFlags: ["profiling_or_indirect_identifier_present"] }
        })
      ]
    },
    {
      key: "communications_data",
      title: "Communications Data",
      order: 7,
      description: "Identify communications content and records about identifiable people.",
      questions: [
        booleanQuestion({
          stableKey: "PDP_COMMS_001",
          prompt: "Does your product process voice call content?",
          evidence: { required: architectureEvidence, recommended: ["data_retention_policy"] }
        }),
        booleanQuestion({
          stableKey: "PDP_COMMS_002",
          prompt: "Does your product process recorded phone calls?",
          evidence: { required: architectureEvidence, recommended: ["data_retention_policy"] }
        }),
        booleanQuestion({
          stableKey: "PDP_COMMS_003",
          prompt: "Does your product process other information which is about an individual natural person?"
        })
      ]
    },
    {
      key: "sensitive_processing",
      title: "Special Categories & Sensitive Processing",
      order: 8,
      description: "Identify high-risk processing that requires stronger reviewer attention.",
      questions: [
        booleanQuestion({
          stableKey: "PDP_SENS_001",
          prompt: "Will you have any Special Categories of data?",
          whyItMatters: "Special-category processing raises regulatory and design scrutiny and may require stronger controls and legal review.",
          guidance: "Include health data, biometric data, political opinions, religious beliefs, union membership, or similar categories.",
          evidence: { required: ["threat_model", "tam_diagram", "legal_basis_note"] },
          requirementRefs: ["EU_GDPR:ART_9_SPECIAL_CATEGORIES"],
          decisionEffects: { yesSetsFlags: ["special_category_data"] }
        }),
        booleanQuestion({
          stableKey: "PDP_SENS_002",
          prompt: "Will you perform Automated Decisions?",
          whyItMatters: "Automated decision-making may trigger additional transparency and human-intervention obligations.",
          guidance: "Answer yes if the system makes or recommends decisions about people that materially affect them without meaningful human review.",
          evidence: { required: ["threat_model", "model_governance_note"] },
          requirementRefs: ["EU_GDPR:ART_22_AUTOMATED_DECISIONS"],
          decisionEffects: { yesSetsFlags: ["automated_decision_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_SENS_003",
          prompt: "Does your product offer generic containers in which solutions / customers can process personal data?",
          guidance: "Answer yes if tenants, customers, or implementation teams can define fields, upload files, or store free-form records containing personal data.",
          evidence: { required: architectureEvidence, recommended: ["data_inventory"] }
        }),
        booleanQuestion({
          stableKey: "PDP_SENS_004",
          prompt: "Will you engage in Profiling?",
          guidance: "Include scoring, segmentation, behavioural analysis, risk classification, or prediction about a natural person.",
          evidence: { required: ["threat_model", "model_governance_note"] },
          decisionEffects: { yesSetsFlags: ["profiling_or_indirect_identifier_present"] }
        }),
        booleanQuestion({
          stableKey: "PDP_SENS_005",
          prompt: "Will you Monitor people's movement in a public space (e.g., via video)?",
          evidence: { required: ["threat_model", "tam_diagram", "legal_basis_note"] }
        }),
        booleanQuestion({
          stableKey: "PDP_SENS_006",
          prompt: "Will you have other Sensitive or Embarrassing data (e.g., criminal convictions or arrests)?",
          evidence: { required: ["threat_model", "tam_diagram", "legal_basis_note"] }
        })
      ]
    },
    {
      key: "organizational_legal_basis",
      title: "Organizational & Legal Basis",
      order: 9,
      description: "Clarify controller responsibilities and legal-basis expectations.",
      questions: [
        booleanQuestion({
          stableKey: "ORG_LB_001",
          prompt: "Will this product be operated by SAP Fioneer and process personal data, which makes us a Controller?",
          whyItMatters: "Controller status affects accountability, notices, data subject rights, and records of processing.",
          evidence: { required: ["legal_basis_note"], recommended: ["data_inventory"] },
          requirementRefs: ["EU_GDPR:ART_6_LAWFULNESS", "UK_GDPR:ART_6_LAWFULNESS"]
        })
      ]
    },
    {
      key: "threat_and_architecture_evidence",
      title: "Threat Modelling & TAM Evidence",
      order: 10,
      description: "Ensure architecture evidence exists and is aligned with the assessment.",
      helpSummary: "These questions should usually be answered by the architect or security reviewer.",
      questions: [
        {
          stableKey: "EVID_TM_001",
          prompt: "Has a threat model been created or linked for the in-scope architecture?",
          responseType: "single_select",
          required: true,
          jurisdictions,
          options: ["linked", "uploaded", "not_available"],
          whyItMatters: "Threat models provide evidence that privacy-relevant attack paths, access paths, and trust boundaries have been reviewed.",
          guidance: {
            plainEnglish: "Link the current approved threat model if one exists. If not, explain why it is missing.",
            prompts: ["Confirm the threat model version and review date.", "Confirm that privacy-relevant data stores and trust boundaries are covered."]
          },
          examples: {
            good: ["Linked threat model TM-042 version 3.2 reviewed by security architecture."],
            bad: ["Security knows about it."]
          },
          evidence: { required: ["threat_model"] }
        },
        booleanQuestion({
          stableKey: "EVID_TAM_001",
          prompt: "Does the TAM diagram show the systems, interfaces, trust boundaries, and data stores relevant to this assessment?",
          whyItMatters: "A TAM diagram is needed to understand where personal data flows, where it is stored, and where controls must apply.",
          guidance: "The diagram should show entry points, third-party integrations, storage locations, and trust boundaries for personal-data flows.",
          evidence: { required: ["tam_diagram"] },
          examples: {
            good: ["TAM v1.5 shows browser, API, IAM, CRM connector, database, batch export path, and trust boundaries."],
            bad: ["There is an architecture slide."]
          }
        })
      ]
    },
    {
      key: "required_controls",
      title: "Required Privacy Controls & Safeguards",
      order: 11,
      description: "Verify privacy controls for products processing personal data.",
      questions: [
        booleanQuestion({
          stableKey: "CTRL_LB_001",
          prompt: "Capture explicit consent before collecting personal data, where no other legal ground exists.",
          evidence: { required: ["legal_basis_note"], recommended: ["operating_procedure"] },
          requirementRefs: ["EU_GDPR:ART_6_LAWFULNESS", "EU_GDPR:ART_7_CONSENT"]
        }),
        booleanQuestion({
          stableKey: "CTRL_LB_002",
          prompt: "Customer data is Not used for partner's own purpose without contractual consent or legal ground.",
          evidence: { required: ["legal_basis_note"], recommended: ["operating_procedure"] },
          requirementRefs: ["EU_GDPR:ART_6_LAWFULNESS"]
        }),
        booleanQuestion({
          stableKey: "CTRL_DSR_001",
          prompt: "Provide a retrieval function which can be used to inform the data subjects about the personal data stored about them.",
          evidence: { recommended: ["operating_procedure", "tam_diagram"] },
          requirementRefs: ["EU_GDPR:ART_15_ACCESS"]
        }),
        booleanQuestion({
          stableKey: "CTRL_DSR_002",
          prompt: "Erasure of personal data is supported.",
          evidence: { recommended: ["data_retention_policy", "operating_procedure"] },
          requirementRefs: ["EU_GDPR:ART_17_ERASURE"]
        }),
        booleanQuestion({
          stableKey: "CTRL_DSR_003",
          prompt: "Provide EU Access.",
          guidance: "Confirm that the product can support access obligations for EU data subjects and relevant reviewer workflows.",
          evidence: { recommended: ["operating_procedure"] },
          requirementRefs: ["EU_GDPR:ART_15_ACCESS"]
        }),
        booleanQuestion({
          stableKey: "CTRL_LOG_001",
          prompt: "Log read access to sensitive personal data.",
          evidence: { required: ["audit_log_design"], recommended: ["logging_standard"] },
          requirementRefs: ["EU_GDPR:ART_32_SECURITY"]
        }),
        booleanQuestion({
          stableKey: "CTRL_LOG_002",
          prompt: "Changes to personal data can be logged.",
          evidence: { recommended: ["audit_log_design", "logging_standard"] },
          requirementRefs: ["EU_GDPR:ART_32_SECURITY"]
        }),
        booleanQuestion({
          stableKey: "CTRL_DP_001",
          prompt: "Ensure Personal Data Minimization.",
          whyItMatters: "Minimization reduces risk surface and is a core data-protection principle.",
          guidance: "Answer yes only if the design intentionally limits collection, storage, retention, and exposure to what is necessary.",
          evidence: { recommended: ["data_retention_policy", "tam_diagram"] },
          requirementRefs: ["EU_GDPR:ART_5_DATA_MINIMISATION"],
          examples: {
            good: ["Optional address fields were removed because the business process does not require them."],
            bad: ["We store everything just in case."]
          }
        }),
        booleanQuestion({
          stableKey: "CTRL_DP_002",
          prompt: "Allow human intervention for all automated decision processes.",
          whyItMatters: "Human intervention is a key safeguard when automated decisions affect natural persons.",
          guidance: "If automated decisions exist, explain how an accountable human can review and override them.",
          evidence: { required: ["operating_procedure", "audit_log_design"] },
          requirementRefs: ["EU_GDPR:ART_22_AUTOMATED_DECISIONS"],
          displayRules: { all: [{ question: "PDP_SENS_002", equals: true }] }
        }),
        booleanQuestion({
          stableKey: "CTRL_AI_001",
          prompt: "Ensure used AI methods do Not result in inaccuracies detrimental to data subjects' rights.",
          evidence: { required: ["model_governance_note"], recommended: ["audit_log_design"] },
          requirementRefs: ["EU_GDPR:ART_5_ACCURACY"]
        }),
        booleanQuestion({
          stableKey: "CTRL_AI_002",
          prompt: "Provide transparency when using AI during processing of personal data.",
          evidence: { required: ["model_governance_note", "legal_basis_note"] },
          requirementRefs: ["EU_GDPR:ART_13_TRANSPARENCY", "EU_GDPR:ART_14_TRANSPARENCY"]
        }),
        booleanQuestion({
          stableKey: "CTRL_AI_003",
          prompt: "Implement safeguards to protect personal data used to train AI model.",
          evidence: { required: ["model_governance_note", "threat_model"], recommended: ["data_retention_policy"] },
          requirementRefs: ["EU_GDPR:ART_25_DATA_PROTECTION_BY_DESIGN"]
        })
      ]
    }
  ]
};

export const defaultAssessmentMetadata = {
  environment: "Corporate workspace",
  defaultAssessmentId: "UNASSIGNED",
  projectName: "",
  jiraKey: "",
  threatModelUrl: "",
  tamDiagramUrl: ""
} satisfies LocalAssessmentMetadata;
