import { db, articles } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import StackViewClient from './StackViewClient';

export const dynamic = 'force-dynamic';

export default async function StackPage() {
  const list = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.isFeatured), desc(articles.publishedAt)],
    limit: 30,
  });

  return <StackViewClient articles={list} />;
}
