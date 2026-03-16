import { Module } from "@nestjs/common";
import { ComplianceService } from "./compliance.service";
import { ComplianceController } from "./compliance.controller";
import { AssessmentModule } from "../assessments/assessment.module";
import { RulesEvaluationService } from "./rules-evaluation.service";

@Module({
  imports: [AssessmentModule],
  providers: [ComplianceService, RulesEvaluationService],
  controllers: [ComplianceController],
  exports: [ComplianceService]
})
export class ComplianceModule {}
