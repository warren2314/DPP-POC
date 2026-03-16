import { Injectable, NotFoundException } from "@nestjs/common";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { ParsedTemplate } from "@dpp/shared";
import { MarkdownTemplateParserService } from "./markdown-template-parser.service";
import { TemplateValidationResult, TemplateValidatorService } from "./template-validator.service";

interface StoredTemplateVersion {
  filename: string;
  checksum: string;
  markdown: string;
  parsed: ParsedTemplate;
  validation: TemplateValidationResult;
}

@Injectable()
export class TemplateService {
  private readonly templates = new Map<string, StoredTemplateVersion[]>();
  private static readonly OFFICIAL_TEMPLATE_KEY = "dpp_privacy_checklist_full";
  private static readonly ENRICHED_TEMPLATE_KEY = "dpp_privacy_checklist";

  constructor(
    private readonly parser: MarkdownTemplateParserService,
    private readonly validator: TemplateValidatorService
  ) {
    this.bootstrapSampleTemplate();
  }

  listTemplates() {
    return [...this.templates.entries()].map(([templateKey, versions]) => ({
      templateKey,
      title: versions[versions.length - 1]?.parsed.title,
      latestVersion: versions[versions.length - 1]?.parsed.version,
      status: versions[versions.length - 1]?.parsed.status
    }));
  }

  listVersions(templateKey: string) {
    return this.templates.get(templateKey) ?? [];
  }

  getTemplateVersion(templateKey: string, version?: string): StoredTemplateVersion {
    const versions = this.templates.get(templateKey);

    if (!versions?.length) {
      throw new NotFoundException(`Template '${templateKey}' was not found.`);
    }

    if (!version) {
      return versions[versions.length - 1];
    }

    const match = versions.find((entry) => entry.parsed.version === version);
    if (!match) {
      throw new NotFoundException(`Template '${templateKey}' version '${version}' was not found.`);
    }

    return match;
  }

  validateMarkdown(filename: string, markdown: string) {
    const parsed = this.parser.parse(markdown);
    const validation = this.validator.validate(parsed);

    return {
      valid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
      templatePreview: {
        templateKey: parsed.templateKey,
        version: parsed.version,
        title: parsed.title,
        sections: parsed.sections.length,
        questions: parsed.sections.reduce((sum, section) => sum + section.questions.length, 0)
      }
    };
  }

  uploadTemplate(filename: string, markdown: string) {
    const parsed = this.parser.parse(markdown);
    const validation = this.validator.validate(parsed);
    const checksum = this.checksum(markdown);
    const versionRecord: StoredTemplateVersion = {
      filename,
      checksum,
      markdown,
      parsed,
      validation
    };

    const existing = this.templates.get(parsed.templateKey) ?? [];
    this.templates.set(parsed.templateKey, [...existing, versionRecord]);

    return versionRecord;
  }

  private bootstrapSampleTemplate() {
    this.bootstrapOfficialLegacyTemplate();
    this.bootstrapEnrichedPrototypeTemplate();
  }

  private checksum(markdown: string) {
    return createHash("sha256").update(markdown).digest("hex");
  }

  private bootstrapOfficialLegacyTemplate() {
    const candidatePaths = [
      join(process.cwd(), "privacy_compliance_checklist.md"),
      join(process.cwd(), "..", "..", "privacy_compliance_checklist.md")
    ];

    for (const candidate of candidatePaths) {
      try {
        const markdown = readFileSync(candidate, "utf8");
        this.uploadTemplate(
          "privacy_compliance_checklist.md",
          this.wrapLegacyMarkdown({
            templateKey: TemplateService.OFFICIAL_TEMPLATE_KEY,
            version: "1.0.0",
            title: "Privacy & Data Protection Compliance Checklist",
            derivedFrom: "privacy_compliance_checklist.md",
            markdown
          })
        );
        return;
      } catch {
        continue;
      }
    }
  }

  private bootstrapEnrichedPrototypeTemplate() {
    const candidatePaths = [
      join(process.cwd(), "templates", "privacy_compliance_checklist.enriched.v1.md"),
      join(process.cwd(), "..", "..", "templates", "privacy_compliance_checklist.enriched.v1.md")
    ];

    for (const candidate of candidatePaths) {
      try {
        const markdown = readFileSync(candidate, "utf8");
        this.uploadTemplate("privacy_compliance_checklist.enriched.v1.md", markdown);
        return;
      } catch {
        continue;
      }
    }
  }

  private wrapLegacyMarkdown(input: {
    templateKey: string;
    version: string;
    title: string;
    derivedFrom: string;
    markdown: string;
  }) {
    return `---
template_key: ${input.templateKey}
version: ${input.version}
title: ${input.title}
status: active
source_type: legacy
derived_from: ${input.derivedFrom}
jurisdictions:
  - code: EU_GDPR
    label: EU GDPR
  - code: UK_GDPR
    label: UK GDPR
owners:
  - privacy-office
review_roles:
  - requestor
  - privacy_assessor
  - security_architect
---

${input.markdown}`;
  }
}
