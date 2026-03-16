import { Module } from "@nestjs/common";
import { JiraService } from "./jira.service";
import { JiraController } from "./jira.controller";
import { AssessmentModule } from "../assessments/assessment.module";
import { ComplianceModule } from "../compliance/compliance.module";

@Module({
  imports: [AssessmentModule, ComplianceModule],
  providers: [JiraService],
  controllers: [JiraController],
  exports: [JiraService]
})
export class JiraModule {}
