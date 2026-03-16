"use client";

import { useState } from "react";
import { sampleTemplate } from "../lib/mock-data";
import { QuestionCard } from "./question-card";
import { HelpDrawer } from "./help-drawer";
import { EvidencePanel } from "./evidence-panel";
import { ComplianceSummary } from "./compliance-summary";

export function AssessmentWizard() {
  const flatQuestions = sampleTemplate.sections.flatMap((section) =>
    section.questions.map((question) => ({ ...question, sectionTitle: section.title }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const question = flatQuestions[currentIndex];

  return (
    <main className="page-shell">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">Guided Assessment</p>
          <h1>{sampleTemplate.title}</h1>
          <p className="hero-copy">
            Users see the official question, a plain-English interpretation, and evidence expectations together. The
            source remains the published markdown template version.
          </p>
        </div>
        <div className="wizard-status">
          <span>{question.sectionTitle}</span>
          <strong>
            {currentIndex + 1} / {flatQuestions.length}
          </strong>
        </div>
      </section>

      <section className="wizard-layout">
        <nav className="panel nav-panel">
          <h2>Sections</h2>
          <ul className="section-list">
            {sampleTemplate.sections.map((section) => (
              <li key={section.key}>
                <strong>{section.title}</strong>
                <span>{section.questions.length} questions</span>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <button
              className="secondary-button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((value) => Math.max(value - 1, 0))}
            >
              Previous
            </button>
            <button
              className="primary-button"
              disabled={currentIndex === flatQuestions.length - 1}
              onClick={() => setCurrentIndex((value) => Math.min(value + 1, flatQuestions.length - 1))}
            >
              Next
            </button>
          </div>
        </nav>

        <div className="wizard-main">
          <QuestionCard question={question} />
          <ComplianceSummary />
        </div>

        <div className="wizard-sidebar">
          <HelpDrawer question={question} />
          <EvidencePanel />
        </div>
      </section>
    </main>
  );
}
