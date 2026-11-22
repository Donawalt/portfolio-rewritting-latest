import { SITE, SOCIALS, canonical } from "@/config/site";

export const markdownUrl = (path = "") => `${canonical(path).replace(/\/$/, "")}/index.md`;

const servicesSection = SITE.services
  .map(
    (service) => `- ${service.title}${service.description ? ` — ${service.description}` : ""}`
  )
  .join("\n");

const processSection = SITE.process
  .map((step, index) => `${index + 1}. ${step.title} — ${step.description}`)
  .join("\n");

const officialPagesSection = SITE.officialPages
  .map((page) => `- ${page.name}: ${canonical(page.path)}`)
  .join("\n");

const profilesSection = [
  ...SOCIALS.map((social) => `- ${social.name}: ${social.url}`),
  `- Email: ${SITE.email}`,
].join("\n");

export const CORE = `# ${SITE.name} — ${SITE.role}

> ${SITE.statement}

## About
${SITE.bio}

## Services
${servicesSection}

## Process
${processSection}

## Availability
- ${SITE.availability}

## Key pages
${officialPagesSection}

## Profiles
${profilesSection}`;

const specOfficialPagesSection = SITE.officialPages
  .map((page) => `- [${page.name}](${markdownUrl(page.path)})`)
  .join("\n");

const specProfilesSection = [
  ...SOCIALS.map((social) => `- [${social.name}](${social.url})`),
  `- [Email: ${SITE.email}](mailto:${SITE.email})`,
].join("\n");

export const LLMS_TXT_CORE = `# ${SITE.name} — ${SITE.role}

> ${SITE.statement}

**About**
${SITE.bio}

**Services**
${servicesSection}

**Process**
${processSection}

**Availability**
- ${SITE.availability}

## Key pages
${specOfficialPagesSection}

## Profiles
${specProfilesSection}`;