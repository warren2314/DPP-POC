# API Contract Starter

## Templates

### `POST /api/templates/validate`

Request:

```json
{
  "filename": "privacy_compliance_checklist.enriched.v1.md",
  "markdown": "---\\ntemplate_key: dpp_privacy_checklist\\nversion: 1.0.0\\n---"
}
```

Response:

```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "code": "QUESTION_WITHOUT_EXAMPLES",
      "message": "Question PDP_DI_003 has no good/bad examples."
    }
  ],
  "templatePreview": {
    "templateKey": "dpp_privacy_checklist",
    "version": "1.0.0",
    "sections": 4,
    "questions": 12
  }
}
```

### `POST /api/templates`

```json
{
  "filename": "privacy_compliance_checklist.enriched.v1.md",
  "markdown": "..."
}
```

### `GET /api/templates`

```json
[
  {
    "templateKey": "dpp_privacy_checklist",
    "title": "Privacy & Data Protection Compliance Checklist",
    "latestVersion": "1.0.0",
    "status": "active"
  }
]
```

## Assessments

### `POST /api/assessments`

```json
{
  "templateKey": "dpp_privacy_checklist",
  "templateVersion": "1.0.0",
  "productName": "Fioneer Collections Portal",
  "jurisdictions": ["EU_GDPR", "UK_GDPR"],
  "jiraKey": "DPP-431",
  "createdBy": "alice.smith@example.com"
}
```

### `PUT /api/assessments/:assessmentId/answers/:questionKey`

```json
{
  "value": true,
  "comment": "Customer onboarding stores first and last name.",
  "evidenceRefs": [
    {
      "type": "tam_diagram",
      "uri": "https://confluence.example.com/display/TAM/123"
    }
  ]
}
```

### `POST /api/assessments/:assessmentId/submit`

```json
{
  "submittedBy": "alice.smith@example.com",
  "reviewers": [
    "privacy.reviewer@example.com",
    "security.architect@example.com"
  ]
}
```

### `GET /api/assessments/:assessmentId/compliance-summary`

```json
{
  "status": "review_required",
  "completionPercent": 86,
  "requirementSummaries": [
    {
      "requirementRef": "EU_GDPR:ART_4_PERSONAL_DATA",
      "status": "appears_met",
      "explanation": "Personal data categories were identified and evidence references were supplied."
    }
  ]
}
```

## Reports

### `POST /api/assessments/:assessmentId/report`

```json
{
  "format": "pdf"
}
```

## Jira

### `POST /api/assessments/:assessmentId/jira-links`

```json
{
  "mode": "create",
  "projectKey": "DPP",
  "issueType": "Task"
}
```
