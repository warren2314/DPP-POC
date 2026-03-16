import { Injectable } from "@nestjs/common";
import matter from "gray-matter";
import { load } from "js-yaml";
import slugify from "slugify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import {
  ConditionalRuleGroup,
  ParsedQuestion,
  ParsedSection,
  ParsedTemplate,
  ResponseType,
  JurisdictionCode
} from "@dpp/shared";

@Injectable()
export class MarkdownTemplateParserService {
  parse(markdown: string): ParsedTemplate {
    const { data, content } = matter(markdown);
    const sourceType = (data.source_type ?? data.sourceType ?? "legacy") as "legacy" | "governed";
    const template: ParsedTemplate = {
      templateKey: String(data.template_key ?? data.templateKey ?? "legacy_template"),
      version: String(data.version ?? "0.0.1"),
      title: String(data.title ?? "Untitled DPP Template"),
      status: (data.status ?? "draft") as ParsedTemplate["status"],
      sourceType,
      jurisdictions: this.parseJurisdictions(data.jurisdictions),
      sections: []
    };

    const tree = remark().use(remarkParse).use(remarkGfm).parse(content) as any;
    let currentSection: ParsedSection | undefined;
    let currentQuestion: ParsedQuestion | undefined;

    for (const node of tree.children as any[]) {
      if (node.type === "heading" && node.depth === 2) {
        currentSection = {
          key: this.fallbackKey(this.flattenText(node)),
          title: this.flattenText(node),
          order: template.sections.length + 1,
          questions: []
        };
        currentQuestion = undefined;
        template.sections.push(currentSection);
        continue;
      }

      if (node.type === "code" && node.lang === "dpp-section" && currentSection) {
        const metadata = (load(node.value) as Record<string, unknown>) ?? {};
        currentSection.key = String(metadata.key ?? currentSection.key);
        currentSection.description = this.optionalString(metadata.description);
        currentSection.helpSummary = this.optionalString((metadata.help as { summary?: string } | undefined)?.summary);
        currentSection.mapsTo = Array.isArray(metadata.maps_to) ? metadata.maps_to.map(String) : [];
        continue;
      }

      if (node.type === "heading" && node.depth === 3) {
        if (!currentSection) {
          currentSection = {
            key: "general",
            title: "General",
            order: template.sections.length + 1,
            questions: []
          };
          template.sections.push(currentSection);
        }

        const parsedHeading = this.parseQuestionHeading(this.flattenText(node));
        currentQuestion = {
          stableKey: parsedHeading.stableKey,
          prompt: parsedHeading.prompt,
          responseType: "boolean",
          required: true,
          jurisdictions: template.jurisdictions
        };
        currentSection.questions.push(currentQuestion);
        continue;
      }

      if (node.type === "code" && node.lang === "dpp-question" && currentQuestion) {
        const metadata = (load(node.value) as Record<string, any>) ?? {};
        currentQuestion.responseType = (metadata.response_type ?? "boolean") as ResponseType;
        currentQuestion.required = metadata.required ?? true;
        currentQuestion.jurisdictions = this.parseJurisdictions(metadata.jurisdictions, template.jurisdictions);
        currentQuestion.whyItMatters = this.optionalString(metadata.why_it_matters);
        currentQuestion.guidance = {
          plainEnglish: this.optionalString(metadata.guidance?.plain_english),
          prompts: Array.isArray(metadata.guidance?.prompts) ? metadata.guidance.prompts.map(String) : []
        };
        currentQuestion.examples = {
          good: Array.isArray(metadata.examples?.good) ? metadata.examples.good.map(String) : [],
          bad: Array.isArray(metadata.examples?.bad) ? metadata.examples.bad.map(String) : []
        };
        currentQuestion.evidence = {
          required: Array.isArray(metadata.evidence?.required) ? metadata.evidence.required : [],
          recommended: Array.isArray(metadata.evidence?.recommended) ? metadata.evidence.recommended : []
        };
        currentQuestion.requirementRefs = Array.isArray(metadata.requirement_refs)
          ? metadata.requirement_refs.map(String)
          : [];
        currentQuestion.options = Array.isArray(metadata.options) ? metadata.options.map(String) : [];
        currentQuestion.displayRules = this.parseConditionalGroup(metadata.display_rules);
        currentQuestion.validationRules = Array.isArray(metadata.validation_rules)
          ? metadata.validation_rules.map(String)
          : [];
        currentQuestion.consistencyChecks = Array.isArray(metadata.consistency_checks)
          ? metadata.consistency_checks.map(String)
          : [];
        currentQuestion.decisionEffects = {
          yesSetsFlags: Array.isArray(metadata.decision_effects?.yes_sets_flags)
            ? metadata.decision_effects.yes_sets_flags.map(String)
            : [],
          noSetsFlags: Array.isArray(metadata.decision_effects?.no_sets_flags)
            ? metadata.decision_effects.no_sets_flags.map(String)
            : []
        };
        continue;
      }

      if (node.type === "list" && sourceType === "legacy" && currentSection) {
        for (const item of node.children as any[]) {
          const prompt = this.flattenText(item);
          currentSection.questions.push({
            stableKey: this.fallbackKey(prompt),
            prompt,
            responseType: "boolean",
            required: true,
            jurisdictions: template.jurisdictions
          });
        }
      }
    }

    return template;
  }

  private parseJurisdictions(
    input: unknown,
    fallback: JurisdictionCode[] = ["EU_GDPR", "UK_GDPR"]
  ): JurisdictionCode[] {
    if (!Array.isArray(input)) {
      return fallback;
    }

    const values = input
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object" && "code" in item) {
          return String((item as { code: string }).code);
        }

        return undefined;
      })
      .filter(Boolean) as JurisdictionCode[];

    return values.length ? values : fallback;
  }

  private parseQuestionHeading(value: string) {
    const match = /^(.*?)\s*\{#([A-Za-z0-9_:-]+)\}\s*$/.exec(value);
    if (!match) {
      return {
        prompt: value.trim(),
        stableKey: this.fallbackKey(value)
      };
    }

    return {
      prompt: match[1].trim(),
      stableKey: match[2].trim()
    };
  }

  private parseConditionalGroup(input: Record<string, unknown> | undefined): ConditionalRuleGroup | undefined {
    if (!input) {
      return undefined;
    }

    return {
      all: Array.isArray(input.all) ? input.all.map((entry) => this.normalizeClause(entry)) : undefined,
      any: Array.isArray(input.any) ? input.any.map((entry) => this.normalizeClause(entry)) : undefined
    };
  }

  private normalizeClause(entry: any) {
    return {
      question: this.optionalString(entry.question),
      fact: this.optionalString(entry.fact),
      equals: entry.equals,
      jurisdictionIn: Array.isArray(entry.jurisdiction_in) ? entry.jurisdiction_in.map(String) : undefined
    };
  }

  private flattenText(node: any): string {
    if (!node) {
      return "";
    }

    if (typeof node.value === "string") {
      return node.value;
    }

    if (Array.isArray(node.children)) {
      return node.children.map((child) => this.flattenText(child)).join("").trim();
    }

    return "";
  }

  private fallbackKey(value: string): string {
    return slugify(value, { replacement: "_", lower: false, strict: true }) || "QUESTION_UNKEYED";
  }

  private optionalString(input: unknown): string | undefined {
    return typeof input === "string" && input.trim() ? input.trim() : undefined;
  }
}
