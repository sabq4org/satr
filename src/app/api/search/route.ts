import { NextRequest, NextResponse } from 'next/server';
import { db, articles } from '@/lib/db';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ articles: [] });
  }

  // بحث في الأسطر الثلاثة، المصدر، والوسوم
  const pattern = `%${q}%`;
  const list = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.status, 'published'),
        or(
          ilike(articles.line1, pattern),
          ilike(articles.line2, pattern),
          ilike(articles.line3, pattern),
          ilike(articles.source, pattern),
          // البحث ضمن JSON tags
          sql`${articles.tags}::text ILIKE ${pattern}`,
        ),
      ),
    )
    .orderBy(desc(articles.publishedAt))
    .limit(8);

  return NextResponse.json({ articles: list });
}
