"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ParsedTemplate } from "@dpp/shared";
import { AppShell } from "./app-shell";
import { localDemoMetadata, sampleTemplate, type LocalAssessmentMetadata } from "../lib/mock-data";
import { fetchLatestTemplate, OFFICIAL_TEMPLATE_KEY } from "../lib/template-client";
import { createAssessment, linkJiraIssue, saveAnswerToApi } from "../lib/assessment-client";
import { QuestionCard } from "./question-card";
import { HelpDrawer } from "./help-drawer";
import { EvidencePanel } from "./evidence-panel";
import { ComplianceSummary } from "./compliance-summary";
import { AssessmentMetadataPanel, type EditableAssessmentMetadataField } from "./assessment-metadata-panel";

export function AssessmentWizard() {
  const [template, setTemplate] = useState<ParsedTemplate | null>(null);
  const [isTemplateLoading, setIsTemplateLoading] = useState(true);
  const [templateSource, setTemplateSource] = useState<"api" | "fallback">("fallback");
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean | string | null>>({});
  const [metadata, setMetadata] = useState<LocalAssessmentMetadata>(localDemoMetadata);
  const [apiAssessmentId, setApiAssessmentId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [jiraSyncStatus, setJiraSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");

  useEffect(() => {
    let isMounted = true;

    async function loadTemplate() {
      try {
        const loadedTemplate = await fetchLatestTemplate(OFFICIAL_TEMPLATE_KEY);
        if (!isMounted) return;
        setTemplate(loadedTemplate);
        setTemplateSource("api");
        setTemplateError(null);
        setIsTemplateLoading(false);
      } catch {
        if (!isMounted) return;
        setTemplate(sampleTemplate);
        setTemplateSource("fallback");
        setTemplateError("Official template unavailable — using the built-in sample template.");
        setIsTemplateLoading(false);
      }
    }

    void loadTemplate();
    return () => { isMounted = false; };
  }, []);

  const activeTemplate = template ?? sampleTemplate;
  const storageKey = `dpp-local-assessment-${activeTemplate.templateKey}-${activeTemplate.version}`;
  const metadataStorageKey = `${storageKey}-metadata`;
  const apiIdStorageKey = `${storageKey}-apiId`;

  const flatQuestions = activeTemplate.sections.flatMap((section, sectionIndex) =>
    section.questions.map((question, questionIndex) => ({
      ...question,
      sectionTitle: section.title,
      sectionKey: section.key,
      sectionIndex,
      questionIndex
    }))
  );
  const question = flatQuestions[currentIndex];
  const answeredQuestions = Object.values(answers).filter((value) => value !== null && value !== undefined).length;
  const completionPercent = flatQuestions.length === 0 ? 0 : Math.round((answeredQuestions / flatQuestions.length) * 100);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(storageKey);
    if (!savedValue) { setAnswers({}); return; }
    try {
      setAnswers(JSON.parse(savedValue) as Record<string, boolean | string | null>);
    } catch {
      window.localStorage.removeItem(storageKey);
      setAnswers({});
    }
    setCurrentIndex(0);
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(metadataStorageKey);
    if (!savedValue) { setMetadata(localDemoMetadata); return; }
    try {
      setMetadata({ ...localDemoMetadata, ...(JSON.parse(savedValue) as Partial<LocalAssessmentMetadata>) });
    } catch {
      window.localStorage.removeItem(metadataStorageKey);
      setMetadata(localDemoMetadata);
    }
  }, [metadataStorageKey]);

  useEffect(() => {
    window.localStorage.setItem(metadataStorageKey, JSON.stringify(metadata));
  }, [metadata, metadataStorageKey]);

  useEffect(() => {
    const savedId = window.localStorage.getItem(apiIdStorageKey);
    if (savedId) setApiAssessmentId(savedId);
  }, [apiIdStorageKey]);

  // Refs so ensureApiAssessmentId always reads current values without being in dep array
  const metadataRef = useRef(metadata);
  useEffect(() => { metadataRef.current = metadata; }, [metadata]);
  const activeTemplateRef = useRef(activeTemplate);
  useEffect(() => { activeTemplateRef.current = activeTemplate; }, [activeTemplate]);

  const ensureApiAssessmentId = useCallback(async (): Promise<string | null> => {
    if (apiAssessmentId) return apiAssessmentId;
    const savedId = window.localStorage.getItem(apiIdStorageKey);
    if (savedId) {
      setApiAssessmentId(savedId);
      return savedId;
    }
    try {
      const tpl = activeTemplateRef.current;
      const meta = metadataRef.current;
      const result = await createAssessment({
        templateKey: tpl.templateKey,
        templateVersion: tpl.version,
        productName: meta.projectName.trim() || "Unnamed project",
        jurisdictions: tpl.jurisdictions,
        jiraKey: meta.jiraKey.trim() || undefined
      });
      window.localStorage.setItem(apiIdStorageKey, result.id);
      setApiAssessmentId(result.id);
      return result.id;
    } catch {
      return null;
    }
  }, [apiAssessmentId, apiIdStorageKey]);

  const updateAnswer = (value: boolean | string | null) => {
    if (!question) return;
    const key = question.stableKey;
    setAnswers((current) => ({ ...current, [key]: value }));

    if (value !== null) {
      setSyncStatus("saving");
      void (async () => {
        const apiId = await ensureApiAssessmentId();
        if (apiId) {
          try {
            await saveAnswerToApi(apiId, key, value);
            setSyncStatus("saved");
            setTimeout(() => setSyncStatus("idle"), 2000);
          } catch {
            setSyncStatus("error");
          }
        } else {
          setSyncStatus("idle");
        }
      })();
    }
  };

  const updateMetadata = (field: EditableAssessmentMetadataField, value: string) => {
    setMetadata((current) => ({ ...current, [field]: value }));
  };

  const handleJiraSync = async (jiraKey: string): Promise<{ jiraUrl: string } | null> => {
    const apiId = await ensureApiAssessmentId();
    if (!apiId) {
      setJiraSyncStatus("error");
      return null;
    }
    setJiraSyncStatus("syncing");
    try {
      const result = await linkJiraIssue(apiId, jiraKey);
      setJiraSyncStatus("synced");
      return result;
    } catch {
      setJiraSyncStatus("error");
      return null;
    }
  };

  const resetAnswers = () => {
    setAnswers({});
    setMetadata(localDemoMetadata);
    setApiAssessmentId(null);
    setSyncStatus("idle");
    setJiraSyncStatus("idle");
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(metadataStorageKey);
    window.localStorage.removeItem(apiIdStorageKey);
    setCurrentIndex(0);
  };

  const sectionProgress = activeTemplate.sections.map((section) => {
    const sectionQuestions = flatQuestions.filter((entry) => entry.sectionKey === section.key);
    const sectionAnswered = sectionQuestions.filter((entry) => answers[entry.stableKey] !== undefined).length;
    const firstQuestionIndex = flatQuestions.findIndex((entry) => entry.sectionKey === section.key);
    return {
      key: section.key,
      title: section.title,
      count: section.questions.length,
      answered: sectionAnswered,
      firstQuestionIndex
    };
  });

  if (isTemplateLoading) {
    return (
      <AppShell
        eyebrow="Guided Assessment"
        title="Loading assessment template"
        subtitle="Fetching the questionnaire from the template service."
      >
        <section className="panel">
          <p>Loading template content...</p>
        </section>
      </AppShell>
    );
  }

  if (!question) {
    return (
      <AppShell
        eyebrow="Guided Assessment"
        title="No questions available"
        subtitle="The selected template did not produce any questionnaire content."
      >
        <section className="panel">
          <p>Check the template parsing output and try again.</p>
        </section>
      </AppShell>
    );
  }

  const syncLabel =
    syncStatus === "saving" ? "Saving…" :
    syncStatus === "saved" ? "Saved" :
    syncStatus === "error" ? "Save failed — answers kept locally" :
    null;

  return (
    <AppShell
      eyebrow="Guided Assessment"
      title={activeTemplate.title}
      subtitle="Answer each question using the guidance provided. Evidence links and reviewer context appear alongside each question."
      actions={
        <div className="topbar-actions">
          <span className={`tag ${templateSource === "api" ? "soft" : "strong"}`}>
            {templateSource === "api" ? "Official template" : "Sample template"}
          </span>
          <span className="tag strong">{completionPercent}% complete</span>
          {syncLabel ? (
            <span className={`tag ${syncStatus === "error" ? "strong" : "soft"}`}>{syncLabel}</span>
          ) : null}
          <button className="secondary-button" onClick={resetAnswers} type="button">
            Reset assessment
          </button>
        </div>
      }
    >
      <section className="assessment-overview">
        <div className="overview-card emphasis">
          <span>Current section</span>
          <strong>{question.sectionTitle}</strong>
          <p>
            Question {currentIndex + 1} of {flatQuestions.length}
          </p>
        </div>
        <div className="overview-card">
          <span>Jurisdictions</span>
          <strong>{activeTemplate.jurisdictions.join(", ")}</strong>
        </div>
        <div className="overview-card">
          <span>Template version</span>
          <strong>{activeTemplate.version}</strong>
        </div>
        <div className="overview-card">
          <span>Project</span>
          <strong>{metadata.projectName.trim() || "Not named"}</strong>
        </div>
        <div className="overview-card">
          <span>Jira ticket</span>
          <strong>{metadata.jiraKey.trim() || "Not linked"}</strong>
        </div>
      </section>

      {templateError ? (
        <section className="panel">
          <p>{templateError}</p>
        </section>
      ) : null}

      <AssessmentMetadataPanel
        metadata={metadata}
        onChange={updateMetadata}
        onJiraSync={handleJiraSync}
        jiraSyncStatus={jiraSyncStatus}
      />

      <section className="wizard-layout">
        <nav className="panel nav-panel structured">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Assessment map</p>
              <h2>Section progress</h2>
            </div>
          </div>
          <div className="section-stack">
            {sectionProgress.map((section) => {
              const isActive = section.key === question.sectionKey;
              const isComplete = section.answered === section.count;

              return (
                <button
                  className={`section-item ${isActive ? "active" : ""}`}
                  key={section.key}
                  onClick={() => setCurrentIndex(section.firstQuestionIndex)}
                  type="button"
                >
                  <div>
                    <strong>{section.title}</strong>
                    <span>
                      {section.answered} / {section.count} answered
                    </span>
                  </div>
                  <span className={`status-pill ${isComplete ? "good" : isActive ? "warning" : "neutral"}`}>
                    {isComplete ? "Done" : isActive ? "In progress" : "Open"}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="nav-actions">
            <button
              className="secondary-button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((value) => Math.max(value - 1, 0))}
              type="button"
            >
              Previous
            </button>
            <button
              className="primary-button"
              disabled={currentIndex === flatQuestions.length - 1}
              onClick={() => setCurrentIndex((value) => Math.min(value + 1, flatQuestions.length - 1))}
              type="button"
            >
              Next
            </button>
          </div>
        </nav>

        <div className="wizard-main">
          <QuestionCard question={question} value={answers[question.stableKey] ?? null} onChange={updateAnswer} />
          <ComplianceSummary
            answeredQuestions={answeredQuestions}
            totalQuestions={flatQuestions.length}
            completionPercent={completionPercent}
            projectName={metadata.projectName}
            jiraKey={metadata.jiraKey}
          />
        </div>

        <div className="wizard-sidebar">
          <HelpDrawer question={question} />
          <EvidencePanel
            evidenceLabels={[...(question.evidence?.required ?? []), ...(question.evidence?.recommended ?? [])]}
            tamDiagramUrl={metadata.tamDiagramUrl}
            threatModelUrl={metadata.threatModelUrl}
          />
        </div>
      </section>
    </AppShell>
  );
}
