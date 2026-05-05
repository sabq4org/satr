import { NextRequest, NextResponse } from 'next/server';
import { db, articles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { deepenArticle } from '@/lib/ai';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const article = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });

  if (!article) {
    return NextResponse.json({ error: 'الخبر غير موجود' }, { status: 404 });
  }

  // لو موجود من قبل في DB، رجعه
  if (article.expandedContent) {
    try {
      const cached = JSON.parse(article.expandedContent);
      return NextResponse.json(cached);
    } catch { /* ignore */ }
  }

  // ولّد جديد
  const result = await deepenArticle({
    line1: article.line1,
    line2: article.line2,
    line3: article.line3,
  });

  // خزّنه في DB
  await db
    .update(articles)
    .set({ expandedContent: JSON.stringify(result) })
    .where(eq(articles.id, id));

  return NextResponse.json(result);
}
