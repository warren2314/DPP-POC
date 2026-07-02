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
  { href: "/", label: "Dashboard" },
  { href: "/assessments/new", label: "Assessment Flow" },
  { href: "/templates", label: "Template Registry" }
];

export function AppShell({ title, subtitle, eyebrow, actions, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="brand-block">
          <img className="brand-logo" src="/sap-fioneer-logo.svg" alt="SAP Fioneer" />
          <div>
            <strong>Privacy Governance</strong>
            <p>Corporate assessment workspace</p>
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

        <section className="sidebar-card muted">
          <p className="sidebar-label">Governance standards</p>
          <ul className="plain-list">
            <li>Every answer is traceable to the active template version.</li>
            <li>Architecture evidence is reviewed with the relevant question.</li>
            <li>Coverage summaries support reviewer judgement and approval decisions.</li>
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
