"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { LocalAssessmentMetadata } from "../lib/mock-data";
import { listAssessments, type ApiAssessmentSummary } from "../lib/assessment-client";

interface LocalAssessmentEntry {
  templateKey: string;
  version: string;
  metadata: LocalAssessmentMetadata;
  answeredCount: number;
  storageKey: string;
}

function readLocalAssessments(): LocalAssessmentEntry[] {
  const found: LocalAssessmentEntry[] = [];

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key?.startsWith("dpp-local-assessment-") || !key.endsWith("-metadata")) continue;

    const metaRaw = window.localStorage.getItem(key);
    const answersKey = key.replace(/-metadata$/, "");
    const answersRaw = window.localStorage.getItem(answersKey);

    if (!metaRaw) continue;

    try {
      const metadata = JSON.parse(metaRaw) as LocalAssessmentMetadata;
      const answers = answersRaw ? (JSON.parse(answersRaw) as Record<string, unknown>) : {};
      const versionMatch = answersKey.match(/^dpp-local-assessment-(.+)-(\d+\.\d+\.\d+)$/);
      if (!versionMatch) continue;

      found.push({
        templateKey: versionMatch[1],
        version: versionMatch[2],
        metadata,
        answeredCount: Object.values(answers).filter((v) => v !== null && v !== undefined).length,
        storageKey: answersKey
      });
    } catch {
      // Ignore invalid browser entries without blocking the dashboard.
    }
  }

  return found;
}

function formatStatus(status: ApiAssessmentSummary["status"]) {
  return status.replaceAll("_", " ");
}

export function SavedAssessmentsList() {
  const [apiEntries, setApiEntries] = useState<ApiAssessmentSummary[]>([]);
  const [localEntries, setLocalEntries] = useState<LocalAssessmentEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadAssessments() {
      const [apiAssessments, browserAssessments] = await Promise.all([
        listAssessments(),
        Promise.resolve(readLocalAssessments())
      ]);

      if (!active) return;
      setApiEntries(apiAssessments);
      setLocalEntries(browserAssessments);
      setLoaded(true);
    }

    void loadAssessments();

    return () => {
      active = false;
    };
  }, []);

  if (!loaded) {
    return (
      <div className="board-row">
        <div>
          <strong>Saved assessments</strong>
          <p>Loading assessment records...</p>
        </div>
      </div>
    );
  }

  if (apiEntries.length === 0 && localEntries.length === 0) {
    return (
      <div className="board-row">
        <div>
          <strong>No in-progress assessments</strong>
          <p>Start a new assessment to create the first governance record.</p>
        </div>
        <span className="status-pill neutral">None open</span>
      </div>
    );
  }

  return (
    <>
      {apiEntries.map((entry) => (
        <div className="board-row" key={entry.id}>
          <div>
            <strong>{entry.productName || "Unnamed product"}</strong>
            <p>
              {entry.templateKey} v{entry.templateVersion}
              {entry.jiraKey ? ` | ${entry.jiraKey}` : ""}
              {` | ${entry.answeredCount} question${entry.answeredCount === 1 ? "" : "s"} answered`}
            </p>
          </div>
          <Link className="status-pill good" href={`/assessments/${entry.id}` as Route}>
            {formatStatus(entry.status)}
          </Link>
        </div>
      ))}

      {localEntries.map((entry) => (
        <div className="board-row" key={entry.storageKey}>
          <div>
            <strong>{entry.metadata.projectName.trim() || "Unnamed product"}</strong>
            <p>
              {entry.templateKey} v{entry.version}
              {entry.metadata.jiraKey ? ` | ${entry.metadata.jiraKey}` : ""}
              {` | ${entry.answeredCount} question${entry.answeredCount === 1 ? "" : "s"} answered`}
            </p>
          </div>
          <Link className="status-pill warning" href="/assessments/new">
            Local draft
          </Link>
        </div>
      ))}
    </>
  );
}
