import { SITE, SITE_URL } from "@/config/site";

export async function GET() {
  const aiBots = SITE.aiBots.map((bot) => `User-agent: ${bot}\nAllow: /`).join("\n\n");
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    "# AI bots — explicitly allowed",
    aiBots,
    "",
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}