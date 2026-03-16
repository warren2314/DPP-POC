"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface AppShellProps {
  title: string;
  subtitle: string;
  eyebrow: string;
  actions?: ReactNode;
  children: ReactNode;
}

const NAV_ITEMS: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Overview" },
  { href: "/assessments/new", label: "New Assessment" },
  { href: "/templates", label: "Templates" },
  { href: "/reports/ASM-2026-001" as Route, label: "Report Preview" }
];

export function AppShell({ title, subtitle, eyebrow, actions, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="brand-block">
          <span className="brand-mark">DPP</span>
          <div>
            <strong>SAP Fioneer</strong>
            <p>Assessment workspace</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link className={`nav-link ${isActive ? "active" : ""}`} href={item.href} key={item.href}>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <section className="sidebar-card">
          <p className="sidebar-label">Operating mode</p>
          <strong>Local prototype</strong>
          <p>
            Markdown remains the source of truth. This shell is for validating flow, hierarchy, and guidance before
            full API persistence is wired.
          </p>
        </section>

        <section className="sidebar-card muted">
          <p className="sidebar-label">Reviewer expectation</p>
          <ul className="plain-list">
            <li>Answers must be traceable to the published template version.</li>
            <li>Threat model and TAM evidence should appear in the workflow, not in a separate email thread.</li>
            <li>Coverage summaries should assist decisions, not replace reviewers.</li>
          </ul>
        </section>
      </aside>

      <div className="workspace-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="topbar-copy">{subtitle}</p>
          </div>
          {actions ? <div className="topbar-actions">{actions}</div> : null}
        </header>

        <div className="page-shell">{children}</div>
      </div>
    </div>
  );
}
