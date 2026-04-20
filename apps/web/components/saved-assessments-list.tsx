"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LocalAssessmentMetadata } from "../lib/mock-data";

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
      // skip corrupted entries
    }
  }

  return found;
}

export function SavedAssessmentsList() {
  const [entries, setEntries] = useState<LocalAssessmentEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(readLocalAssessments());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="board-row">
        <div>
          <strong>Saved assessments</strong>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="board-row">
        <div>
          <strong>No in-progress assessments</strong>
          <p>Start a new assessment to begin. Your answers will be saved automatically.</p>
        </div>
        <span className="status-pill neutral">None saved</span>
      </div>
    );
  }

  return (
    <>
      {entries.map((entry) => (
        <div className="board-row" key={entry.storageKey}>
          <div>
            <strong>{entry.metadata.projectName.trim() || "Unnamed project"}</strong>
            <p>
              {entry.templateKey} v{entry.version}
              {entry.metadata.jiraKey ? ` · ${entry.metadata.jiraKey}` : ""}
              {" · "}
              {entry.answeredCount} question{entry.answeredCount === 1 ? "" : "s"} answered
            </p>
          </div>
          <Link className="status-pill warning" href="/assessments/new">
            Resume
          </Link>
        </div>
      ))}
    </>
  );
}
