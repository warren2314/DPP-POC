import { Controller, Param, Post } from "@nestjs/common";
import { ReportService } from "./report.service";

@Controller("assessments/:assessmentId/report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  generate(@Param("assessmentId") assessmentId: string) {
    return this.reportService.generate(assessmentId);
  }
}
