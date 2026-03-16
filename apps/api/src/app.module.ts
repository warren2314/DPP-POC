import { Module } from "@nestjs/common";
import { TemplateModule } from "./templates/template.module";
import { AssessmentModule } from "./assessments/assessment.module";
import { ComplianceModule } from "./compliance/compliance.module";
import { ReportModule } from "./reports/report.module";
import { JiraModule } from "./jira/jira.module";

@Module({
  imports: [TemplateModule, AssessmentModule, ComplianceModule, ReportModule, JiraModule]
})
export class AppModule {}
