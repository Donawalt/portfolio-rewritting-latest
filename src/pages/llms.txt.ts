import { CORE } from "@/config/llms";
import { canonical } from "@/config/site";
import { client } from "@/assets/scripts/utils/api/sanityClient";
import { getAllArticles, getAllProjects } from "@/assets/scripts/utils/api/api";

export async function GET() {
  const [projects, articles] = await Promise.all([
    client.fetch(getAllProjects()).catch(() => [] as any[]),
    client.fetch(getAllArticles()).catch(() => [] as any[]),
  ]);

  const categories = ["design", "development", "photography"];
  const projectsCount = categories
    .map((cat) => {
      const count = (projects ?? []).filter((project: any) => project?.category === cat).length;
      return `- ${cat}: ${count} ${count === 1 ? "project" : "projects"}`;
    })
    .join("\n");

  const latestArticles = [...(articles ?? [])]
    .sort(
      (a: any, b: any) =>
        new Date(b?._createdAt || 0).getTime() - new Date(a?._createdAt || 0).getTime()
    )
    .slice(0, 5)
    .map(
      (article: any) =>
        `- ${article?.title} — ${canonical(`/blog/${article?.seoSlug?.current}`)}`
    )
    .join("\n");

  const body = `${CORE}
${projectsCount ? `\n## Projects\n${projectsCount}` : ""}
${latestArticles ? `\n## Latest articles\n${latestArticles}` : ""}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}