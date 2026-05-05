import { NextRequest, NextResponse } from 'next/server';
import { db, articles } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const article = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!article) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  const existing = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!existing) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  // الحقول القابلة للتحديث
  const fields = [
    'line1',
    'line2',
    'line3',
    'category',
    'tags',
    'source',
    'sourceTrust',
    'sourceUrl',
    'imageUrl',
    'imageAlt',
    'isBreaking',
    'isFeatured',
    'status',
  ] as const;

  for (const f of fields) {
    if (f in body) updates[f] = body[f];
  }

  // عند النشر، حدّث publishedAt
  if (body.status === 'published' && existing.status !== 'published') {
    updates.publishedAt = new Date();
  }

  const [updated] = await db
    .update(articles)
    .set(updates)
    .where(eq(articles.id, id))
    .returning();

  return NextResponse.json({ article: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [deleted] = await db.delete(articles).where(eq(articles.id, id)).returning();
  if (!deleted) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
