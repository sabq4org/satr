import type { MetadataRoute } from 'next';
import { db, articles } from '@/lib/db';
import { eq, desc, sql } from 'drizzle-orm';
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

  // Tags: pull distinct tags from published articles
  const tagRows = (await db.execute<{ tag: string }>(sql`
    SELECT DISTINCT tag
    FROM ${articles}, jsonb_array_elements_text(${articles.tags}) AS tag
    WHERE ${articles.status} = 'published'
    LIMIT 500
  `)) as unknown as { tag: string }[];
  const tagUrls: MetadataRoute.Sitemap = tagRows.map((r) => ({
    url: `${base}/tag/${encodeURIComponent(r.tag)}`,
    changeFrequency: 'daily',
    priority: 0.6,
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
    {
      url: `${base}/tags`,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...categoryUrls,
    ...tagUrls,
    ...articleUrls,
  ];
}
