import rss from '@astrojs/rss';
import { client } from '@/assets/scripts/utils/api/sanityClient';
import { getAllArticles } from '@/assets/scripts/utils/api/api';

export async function GET(context) {
  const articles = await client.fetch(getAllArticles());

  return rss({
    title: "Donaël Walter — Blog",
    description: "Articles on branding, design, front-end development, and the creative process.",
    site: context.site,
    items: articles
      .filter(
        (article) =>
          article?.title &&
          article?.seoDescription &&
          article?.seoSlug?.current &&
          !isNaN(new Date(article._createdAt).getTime())
      )
      .map((article) => {
      return {
        title: article.title,
        description: article.seoDescription,
        pubDate: new Date(article._createdAt),
        categories: article.category ? [article.category] : [],
        link: `/blog/${article.seoSlug.current}/`,
      };
    }),
    customData: '<language>en</language>',
  });
}
