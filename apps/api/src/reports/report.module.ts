import { Module } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportController } from "./report.controller";
import { AssessmentModule } from "../assessments/assessment.module";
import { ComplianceModule } from "../compliance/compliance.module";

@Module({
  imports: [AssessmentModule, ComplianceModule],
  providers: [ReportService],
  controllers: [ReportController],
  exports: [ReportService]
})
export class ReportModule {}
