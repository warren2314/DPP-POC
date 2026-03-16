import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TemplateService } from "./template.service";

@Controller("templates")
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  listTemplates() {
    return this.templateService.listTemplates();
  }

  @Get(":templateKey/versions")
  listVersions(@Param("templateKey") templateKey: string) {
    return this.templateService.listVersions(templateKey).map((version) => ({
      filename: version.filename,
      checksum: version.checksum,
      parsed: version.parsed,
      validation: version.validation
    }));
  }

  @Post("validate")
  validateTemplate(@Body() body: { filename: string; markdown: string }) {
    return this.templateService.validateMarkdown(body.filename, body.markdown);
  }

  @Post()
  uploadTemplate(@Body() body: { filename: string; markdown: string }) {
    const version = this.templateService.uploadTemplate(body.filename, body.markdown);
    return {
      filename: version.filename,
      checksum: version.checksum,
      parsed: version.parsed,
      validation: version.validation
    };
  }
}
