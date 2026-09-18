import { CORE } from "@/config/llms";
import { canonical } from "@/config/site";
import { client } from "@/assets/scripts/utils/api/sanityClient";
import { getAllArticles, getAllLandings, getAllProjects } from "@/assets/scripts/utils/api/api";

export async function GET() {
  const [projects, articles, landings] = await Promise.all([
    client.fetch(getAllProjects()).catch(() => [] as any[]),
    client.fetch(getAllArticles()).catch(() => [] as any[]),
    client.fetch(getAllLandings()).catch(() => [] as any[]),
  ]);

  const categories = ["design", "development", "photography"];
  const projectSections = categories
    .filter((cat) => (projects ?? []).some((project: any) => project?.category === cat))
    .map((cat) => {
      const items = (projects ?? [])
        .filter((project: any) => project?.category === cat)
        .map(
          (project: any) =>
            `- ${project?.name} — ${canonical(
              `/projects/${cat}/${project?.seoSlug?.current}`
            )}`
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
      return `- ${article?.title} — ${canonical(
        `/blog/${article?.seoSlug?.current}`
      )}${date ? ` (${date})` : ""}`;
    })
    .join("\n");

  const landingsSection = (landings ?? [])
    .map((landing: any) => `- ${landing?.name} — ${canonical(landing?.seoSlug?.current)}`)
    .join("\n");

  const body = `${CORE}
${projectSections ? `\n## Projects\n${projectSections}` : ""}
${articlesSection ? `\n## Articles\n${articlesSection}` : ""}
${landingsSection ? `\n## Landing pages\n${landingsSection}` : ""}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}