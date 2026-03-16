import { Module } from "@nestjs/common";
import { AssessmentController } from "./assessment.controller";
import { AssessmentService } from "./assessment.service";
import { TemplateModule } from "../templates/template.module";

@Module({
  imports: [TemplateModule],
  controllers: [AssessmentController],
  providers: [AssessmentService],
  exports: [AssessmentService]
})
export class AssessmentModule {}
