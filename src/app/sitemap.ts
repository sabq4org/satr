import type { MetadataRoute } from 'next';
import { db, articles } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { CATEGORY_LABELS } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3007';

  const list = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.publishedAt)],
    limit: 1000,
  });

  const articleUrls: MetadataRoute.Sitemap = list.map((a) => ({
    url: `${base}/article/${a.id}`,
    lastModified: a.updatedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = Object.keys(CATEGORY_LABELS).map((c) => ({
    url: `${base}/category/${c}`,
    changeFrequency: 'hourly',
    priority: 0.7,
  }));

  return [
    {
      url: base,
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${base}/stack`,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
