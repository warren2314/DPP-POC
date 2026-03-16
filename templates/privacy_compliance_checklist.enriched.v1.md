---
template_key: dpp_privacy_checklist
version: 1.0.0
title: Privacy & Data Protection Compliance Checklist
status: active
source_type: governed
derived_from: privacy_compliance_checklist.md
jurisdictions:
  - code: EU_GDPR
    label: EU GDPR
  - code: UK_GDPR
    label: UK GDPR
owners:
  - privacy-office
review_roles:
  - requestor
  - privacy_assessor
  - security_architect
---

# Privacy & Data Protection Compliance Checklist

## Personal Data Processing - Direct Identifiers

```dpp-section
key: direct_identifiers
description: Detect whether direct identifiers are processed anywhere in the solution lifecycle.
help:
  summary: Consider production, support, analytics, exports, and realistic test data.
maps_to:
  - EU_GDPR:ART_4_PERSONAL_DATA
  - UK_GDPR:ART_4_PERSONAL_DATA
```

### Does your product process names of natural persons? {#PDP_DI_001}

```dpp-question
response_type: boolean
required: true
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: Names are direct personal identifiers and usually make personal-data handling obligations applicable.
guidance:
  plain_english: Answer yes if legal names, display names, or contact names are stored, transmitted, exported, or logged.
  prompts:
    - Consider support tooling and exported files.
    - Consider seeded test data if it contains realistic personal names.
examples:
  good:
    - Customer onboarding stores account holder first and last name in the policy record.
  bad:
    - Users exist in the product.
evidence:
  recommended:
    - tam_diagram
    - data_inventory
requirement_refs:
  - EU_GDPR:ART_4_PERSONAL_DATA
  - UK_GDPR:ART_4_PERSONAL_DATA
decision_effects:
  yes_sets_flags:
    - personal_data_present
```

### Does your product process home or business email addresses? {#PDP_DI_002}

```dpp-question
response_type: boolean
required: true
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: Email addresses are generally personal data when they identify or relate to a natural person.
guidance:
  plain_english: Include employee, customer, partner, and support-contact email addresses.
examples:
  good:
    - The product sends notifications to named account owners at their work email address.
  bad:
    - We only send messages.
evidence:
  recommended:
    - tam_diagram
    - interface_specification
requirement_refs:
  - EU_GDPR:ART_4_PERSONAL_DATA
```

## Technical Identifiers

```dpp-section
key: technical_identifiers
description: Identify technical identifiers that can directly or indirectly relate to a natural person.
```

### Does your product process IP addresses? {#PDP_TI_001}

```dpp-question
response_type: boolean
required: true
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: IP addresses may be personal data and often require logging, retention, and access-control consideration.
guidance:
  plain_english: Include application logs, reverse proxy logs, monitoring tools, and support exports.
examples:
  good:
    - Web access logs store source IP addresses for troubleshooting and abuse detection.
  bad:
    - The platform is on the internet.
evidence:
  recommended:
    - threat_model
    - logging_standard
requirement_refs:
  - EU_GDPR:ART_4_PERSONAL_DATA
decision_effects:
  yes_sets_flags:
    - technical_identifier_present
    - logging_review_needed
```

### Does your product write identifiers like the user ID to log or trace files? {#PDP_TI_002}

```dpp-question
response_type: boolean
required: true
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: Logging identifiers can create sensitive secondary data stores that need access control and retention controls.
guidance:
  plain_english: Think about application logs, audit logs, tracing, SIEM exports, and debugging snapshots.
examples:
  good:
    - Audit logs record user ID and actor type for privileged actions.
  bad:
    - Logging is enabled.
evidence:
  required:
    - threat_model
    - tam_diagram
requirement_refs:
  - EU_GDPR:ART_5_DATA_MINIMISATION
  - EU_GDPR:ART_32_SECURITY
display_rules:
  any:
    - fact: personal_data_present
      equals: true
    - fact: technical_identifier_present
      equals: true
```

## Special Categories & Sensitive Processing

```dpp-section
key: sensitive_processing
description: Identify high-risk processing that requires stronger reviewer attention.
```

### Will you have any Special Categories of data? {#PDP_SENS_001}

```dpp-question
response_type: boolean
required: true
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: Special-category processing raises regulatory and design scrutiny and may require stronger controls and legal review.
guidance:
  plain_english: Include health data, biometric data, political opinions, religious beliefs, union membership, or similar categories.
examples:
  good:
    - The claims intake workflow stores medical claim attachments containing diagnosis information.
  bad:
    - Sensitive things might exist.
evidence:
  required:
    - threat_model
    - tam_diagram
    - legal_basis_note
requirement_refs:
  - EU_GDPR:ART_9_SPECIAL_CATEGORIES
decision_effects:
  yes_sets_flags:
    - special_category_data
```

### Will you perform Automated Decisions? {#PDP_SENS_002}

```dpp-question
response_type: boolean
required: true
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: Automated decision-making may trigger additional transparency and human-intervention obligations.
guidance:
  plain_english: Answer yes if the system makes or recommends decisions about people that materially affect them without meaningful human review.
examples:
  good:
    - A scoring model automatically declines applications unless manually overridden.
  bad:
    - We use if statements.
evidence:
  required:
    - threat_model
    - model_governance_note
requirement_refs:
  - EU_GDPR:ART_22_AUTOMATED_DECISIONS
display_rules:
  all:
    - fact: personal_data_present
      equals: true
```

## Threat Modelling & TAM Evidence

```dpp-section
key: threat_and_architecture_evidence
description: Ensure architecture evidence exists and is aligned with the assessment.
help:
  summary: These questions should usually be answered by the architect or security reviewer, not guessed by the requestor.
```

### Has a threat model been created or linked for the in-scope architecture? {#EVID_TM_001}

```dpp-question
response_type: single_select
required: true
options:
  - linked
  - uploaded
  - not_available
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: Threat models provide evidence that privacy-relevant attack paths, access paths, and trust boundaries have been reviewed.
guidance:
  plain_english: Link the current approved threat model if one exists. If not, explain why it is missing.
examples:
  good:
    - Linked threat model TM-042 version 3.2 reviewed on 2026-02-10.
  bad:
    - Security knows about it.
evidence:
  required:
    - threat_model
display_rules:
  all:
    - fact: personal_data_present
      equals: true
```

### Does the TAM diagram show the systems, interfaces, trust boundaries, and data stores relevant to this assessment? {#EVID_TAM_001}

```dpp-question
response_type: boolean
required: true
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: A TAM diagram is needed to understand where personal data flows, where it is stored, and where controls must apply.
guidance:
  plain_english: The diagram should show entry points, third-party integrations, storage locations, and trust boundaries for personal-data flows.
examples:
  good:
    - TAM v1.5 shows browser, API, IAM, CRM connector, database, batch export path, and trust boundaries.
  bad:
    - There is an architecture slide.
evidence:
  required:
    - tam_diagram
consistency_checks:
  - requires_data_store_if_personal_data_present
  - requires_external_flow_if_cross_border_transfer
display_rules:
  all:
    - fact: personal_data_present
      equals: true
```

## Required Privacy Controls & Safeguards

```dpp-section
key: required_controls
description: Verify key privacy controls for products processing personal data.
```

### Ensure Personal Data Minimization. {#CTRL_DP_001}

```dpp-question
response_type: boolean
required: true
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: Minimization reduces risk surface and is a core data-protection principle.
guidance:
  plain_english: Answer yes only if the design intentionally limits collection, storage, retention, and exposure to what is necessary.
examples:
  good:
    - Optional address fields were removed because the business process does not require them.
  bad:
    - We store everything just in case.
evidence:
  recommended:
    - data_retention_policy
    - tam_diagram
requirement_refs:
  - EU_GDPR:ART_5_DATA_MINIMISATION
display_rules:
  all:
    - fact: personal_data_present
      equals: true
```

### Allow human intervention for all automated decision processes. {#CTRL_DP_002}

```dpp-question
response_type: boolean
required: true
jurisdictions: [EU_GDPR, UK_GDPR]
why_it_matters: Human intervention is a key safeguard when automated decisions affect natural persons.
guidance:
  plain_english: If automated decisions exist, explain how an accountable human can review and override them.
examples:
  good:
    - Decisions above a risk threshold require manual reviewer approval and every override is audited.
  bad:
    - Someone could probably intervene if needed.
evidence:
  required:
    - operating_procedure
    - audit_log_design
requirement_refs:
  - EU_GDPR:ART_22_AUTOMATED_DECISIONS
display_rules:
  all:
    - question: PDP_SENS_002
      equals: true
```
