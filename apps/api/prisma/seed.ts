import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  const markdownPath = join(process.cwd(), "..", "..", "templates", "privacy_compliance_checklist.enriched.v1.md");
  const markdown = readFileSync(markdownPath, "utf8");
  const checksum = createHash("sha256").update(markdown).digest("hex");

  await prisma.jurisdiction.upsert({
    where: { code: "EU_GDPR" },
    update: {},
    create: { code: "EU_GDPR", label: "EU GDPR", status: "active" }
  });

  await prisma.jurisdiction.upsert({
    where: { code: "UK_GDPR" },
    update: {},
    create: { code: "UK_GDPR", label: "UK GDPR", status: "active" }
  });

  const template = await prisma.assessmentTemplate.upsert({
    where: { templateKey: "dpp_privacy_checklist" },
    update: { status: "active" },
    create: {
      templateKey: "dpp_privacy_checklist",
      name: "Privacy & Data Protection Compliance Checklist",
      owningTeam: "DPP",
      status: "active"
    }
  });

  await prisma.templateVersion.upsert({
    where: {
      templateId_version: {
        templateId: template.id,
        version: "1.0.0"
      }
    },
    update: {
      sourceMarkdown: markdown,
      sourceChecksum: checksum
    },
    create: {
      templateId: template.id,
      version: "1.0.0",
      title: "Privacy & Data Protection Compliance Checklist",
      status: "active",
      sourceType: "governed",
      sourceMarkdown: markdown,
      sourceChecksum: checksum,
      parsedJson: {},
      validationJson: {}
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
