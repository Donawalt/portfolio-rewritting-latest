import { CORE, markdownUrl } from "@/config/llms";
import { getArticles, getLandings, getProjects } from "@/assets/scripts/utils/api/data";

export async function GET() {
  const [projects, articles, landings] = await Promise.all([
    getProjects().catch(() => [] as any[]),
    getArticles().catch(() => [] as any[]),
    getLandings().catch(() => [] as any[]),
  ]);

  const categories = ["design", "development", "photography"];
  const projectSections = categories
    .filter((cat) => (projects ?? []).some((project: any) => project?.category === cat))
    .map((cat) => {
      const items = (projects ?? [])
        .filter((project: any) => project?.category === cat)
        .map(
          (project: any) =>
            `- [${project?.name}](${markdownUrl(
              `/projects/${cat}/${project?.seoSlug?.current}`
            )})`
        )
        .join("\n");
      return `### ${cat}\n${items}`;
    })
    .join("\n\n");

  const articlesSection = (articles ?? [])
    .map((article: any) => {
      const date = article?._createdAt
        ? new Date(article._createdAt).toISOString().split("T")[0]
        : "";
      return `- [${article?.title}](${markdownUrl(
        `/blog/${article?.seoSlug?.current}`
      )})${date ? ` (${date})` : ""}`;
    })
    .join("\n");

  const landingsSection = (landings ?? [])
    .map((landing: any) => `- [${landing?.name}](${markdownUrl(landing?.seoSlug?.current)})`)
    .join("\n");

  const body = `${CORE}
${projectSections ? `\n## Projects\n${projectSections}` : ""}
${articlesSection ? `\n## Articles\n${articlesSection}` : ""}
${landingsSection ? `\n## Landing pages\n${landingsSection}` : ""}

## Frequently Asked Questions (FAQ) 

### What services does Donaël Walter offer as a Design Engineer? 
Donaël Walter provides a unified hybrid workflow spanning brand identity design, UI/UX design systems in Figma, and high-performance frontend engineering (Astro, React, Next.js, Three.js, GSAP, and Tailwind CSS).

### Does Donaël Walter offer recurring retainer contracts? 
Yes. Donaël offers an \*\*Embedded Design Engineer Retainer\*\* plan (€3,540 / US$3,900 per month) designed for tech startups, product teams, and digital agencies. Acting as a part-time embedded team member, he provides ongoing product design, frontend engineering, design system maintenance, CMS/API/AI integrations, and iteration support with flexible "cancel anytime" terms. 

### What is the "Agency Overflow — Design &amp; Build" option? 
For agencies needing immediate sprint bandwidth or white-label execution, Donaël provides an \*\*Agency Overflow\*\* day-rate model (€600 / US$650 per day) covering concept-to-production builds, advanced frontend engineering, and QA.

### What performance benchmarks and quality standards are guaranteed? 
All development deliverables target Core Web Vitals optimization (sub-2.5s LCP), 90+ Lighthouse audit scores, WCAG AA accessibility compliance, and stable 60 FPS WebGL canvas rendering.

### What are the timezone and remote working conditions? 
Donaël is based in Lyon, France (CET/CEST timezone) and operates remotely with startups and digital agencies globally. 

### How do teams lock in retainer spots or request a consultation? 
Retainer availability is strictly capped to ensure craft quality. Teams can book a discovery brief by emailing contact@donaelwalter.com.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}