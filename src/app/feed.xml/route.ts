import { db, articles } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  const items = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.publishedAt)],
    limit: 50,
  });

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xml:lang="ar">
<channel>
  <title>سطر — كل خبر في ٣ سطور</title>
  <link>${origin}</link>
  <description>صحيفة ذكية مختصرة. كل خبر في ٣ سطور.</description>
  <language>ar</language>
  <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" />
  ${items
    .map((a) => {
      const link = `${origin}/article/${a.id}`;
      const desc = `${a.line1}\n\n${a.line2}\n\n${a.line3}`;
      const date = (a.publishedAt || a.createdAt).toUTCString();
      return `
  <item>
    <title>${escapeXml(a.line1)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${date}</pubDate>
    <description>${escapeXml(desc)}</description>
    <category>${escapeXml(a.category)}</category>
  </item>`;
    })
    .join('')}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    },
  });
}
