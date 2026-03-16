import type { ParsedTemplate } from "@dpp/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";
export const OFFICIAL_TEMPLATE_KEY = "dpp_privacy_checklist_full";

interface TemplateVersionRecord {
  parsed: ParsedTemplate;
}

export async function fetchLatestTemplate(templateKey: string): Promise<ParsedTemplate> {
  const response = await fetch(`${API_BASE_URL}/templates/${templateKey}/versions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch template '${templateKey}'.`);
  }

  const versions = (await response.json()) as TemplateVersionRecord[];
  const latestVersion = versions.at(-1)?.parsed;

  if (!latestVersion) {
    throw new Error(`Template '${templateKey}' did not return a parsed version.`);
  }

  return latestVersion;
}
