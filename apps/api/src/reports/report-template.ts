export interface ReportTemplateModel {
  assessmentId: string;
  productName: string;
  jurisdictions: string[];
  generatedAt: string;
  templateVersion: string;
  executiveSummary: string;
  completionPercent: number;
  requirementRows: Array<{ requirementRef: string; status: string; explanation: string }>;
}

export function renderReportHtml(model: ReportTemplateModel): string {
  const requirementRows = model.requirementRows
    .map(
      (row) =>
        `<tr><td>${row.requirementRef}</td><td>${row.status}</td><td>${row.explanation}</td></tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>DPP Assessment Report</title>
    <style>
      body { font-family: Arial, sans-serif; color: #1e293b; margin: 40px; }
      h1, h2 { color: #0f766e; }
      .meta { display: grid; grid-template-columns: 180px 1fr; gap: 8px 16px; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; vertical-align: top; }
      th { background: #e2f3f2; }
      .summary { background: #f6fffd; border: 1px solid #cfeee9; padding: 16px; margin-bottom: 24px; }
    </style>
  </head>
  <body>
    <h1>DPP Assessment Report</h1>
    <div class="meta">
      <strong>Assessment ID</strong><span>${model.assessmentId}</span>
      <strong>Product</strong><span>${model.productName}</span>
      <strong>Jurisdictions</strong><span>${model.jurisdictions.join(", ")}</span>
      <strong>Template Version</strong><span>${model.templateVersion}</span>
      <strong>Generated</strong><span>${model.generatedAt}</span>
    </div>
    <div class="summary">
      <h2>Executive Summary</h2>
      <p>${model.executiveSummary}</p>
      <p>Completion: ${model.completionPercent}%</p>
    </div>
    <h2>DPP Requirement Coverage Summary</h2>
    <table>
      <thead>
        <tr><th>Requirement</th><th>Status</th><th>Explanation</th></tr>
      </thead>
      <tbody>${requirementRows}</tbody>
    </table>
  </body>
</html>`;
}
