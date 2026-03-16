import { Module } from "@nestjs/common";
import { TemplateController } from "./template.controller";
import { TemplateService } from "./template.service";
import { MarkdownTemplateParserService } from "./markdown-template-parser.service";
import { TemplateValidatorService } from "./template-validator.service";

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, MarkdownTemplateParserService, TemplateValidatorService],
  exports: [TemplateService]
})
export class TemplateModule {}
