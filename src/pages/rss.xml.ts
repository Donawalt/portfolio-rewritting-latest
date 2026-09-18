import rss from '@astrojs/rss';
import { client } from '@/assets/scripts/utils/api/sanityClient';
import { getAllArticles } from '@/assets/scripts/utils/api/api';
import { urlImageBuilder } from '@/assets/scripts/utils/api/urlBuilder';

export async function GET(context) {
  const articles = await client.fetch(getAllArticles());

  return rss({
    title: "Donaël Walter — Blog",
    description: "Articles on branding, design, front-end development, and the creative process.",
    site: context.site,
    items: articles.map((article) => {
      const imageUrl = article?.seoImage?.asset?._ref
        ? urlImageBuilder(article.seoImage.asset._ref)
        : undefined;

      return {
        title: article.title,
        description: article.seoDescription,
        pubDate: new Date(article._createdAt),
        categories: article.category ? [article.category] : [],
        link: `/blog/${article.seoSlug?.current}/`,
        ...(imageUrl && { enclosure: { url: imageUrl, type: 'image/jpeg' } }),
      };
    }),
    customData: '<language>en</language>',
  });
}
