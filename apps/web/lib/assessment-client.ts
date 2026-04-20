const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

export interface ApiAssessmentSummary {
  id: string;
  templateKey: string;
  templateVersion: string;
  productName: string;
  jurisdictions: string[];
  jiraKey?: string;
  status: "draft" | "in_review" | "changes_requested" | "approved" | "closed";
  createdAt: string;
  updatedAt: string;
  answeredCount: number;
}

export async function createAssessment(input: {
  templateKey: string;
  templateVersion: string;
  productName: string;
  jurisdictions: string[];
  jiraKey?: string;
}): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE_URL}/assessments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, createdBy: "local-user" })
  });

  if (!response.ok) {
    throw new Error(`Failed to create assessment: ${response.status}`);
  }

  return response.json() as Promise<{ id: string }>;
}

export async function saveAnswerToApi(
  assessmentId: string,
  questionKey: string,
  value: boolean | string | null
): Promise<void> {
  await fetch(`${API_BASE_URL}/assessments/${assessmentId}/answers/${questionKey}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value })
  });
}

export async function linkJiraIssue(assessmentId: string, jiraKey: string): Promise<{ jiraUrl: string }> {
  const response = await fetch(`${API_BASE_URL}/assessments/${assessmentId}/jira-links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "link", jiraKey })
  });

  if (!response.ok) {
    throw new Error(`Jira link failed: ${response.status}`);
  }

  return response.json() as Promise<{ jiraUrl: string }>;
}

export async function listAssessments(): Promise<ApiAssessmentSummary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/assessments`);
    if (!response.ok) return [];
    return response.json() as Promise<ApiAssessmentSummary[]>;
  } catch {
    return [];
  }
}
