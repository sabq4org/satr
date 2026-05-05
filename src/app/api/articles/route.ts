import { NextRequest, NextResponse } from 'next/server';
import { db, articles } from '@/lib/db';
import { desc, eq, and } from 'drizzle-orm';
import type { Category } from '@/lib/db/schema';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') as Category | null;
  const limit = Number(searchParams.get('limit') || '20');

  const conditions = [eq(articles.status, 'published')];
  if (category) conditions.push(eq(articles.category, category));

  const results = await db.query.articles.findMany({
    where: and(...conditions),
    orderBy: [desc(articles.publishedAt)],
    limit,
  });

  return NextResponse.json({ articles: results });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // التحقق من قاعدة الأسطر الثلاثة
  if (!body.line1 || !body.line2 || !body.line3) {
    return NextResponse.json(
      { error: 'الأسطر الثلاثة إلزامية' },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(articles)
    .values({
      line1: body.line1,
      line2: body.line2,
      line3: body.line3,
      category: body.category || 'local',
      tags: body.tags || [],
      source: body.source,
      sourceTrust: body.sourceTrust || 'agency',
      sourceUrl: body.sourceUrl,
      imageUrl: body.imageUrl,
      isBreaking: body.isBreaking || false,
      isFeatured: body.isFeatured || false,
      status: body.status || 'draft',
      publishedAt: body.status === 'published' ? new Date() : null,
    })
    .returning();

  return NextResponse.json({ article: created }, { status: 201 });
}
