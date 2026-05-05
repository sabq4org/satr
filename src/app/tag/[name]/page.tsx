import { db, articles } from '@/lib/db';
import { desc, eq, and, sql } from 'drizzle-orm';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import { Hash, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { name } = await params;
  const tag = decodeURIComponent(name);
  return {
    title: `#${tag} — سطر`,
    description: `جميع الأخبار المتعلقة بـ ${tag} في سطر`,
  };
}

export default async function TagPage({ params }: Props) {
  const { name } = await params;
  const tag = decodeURIComponent(name);

  const list = await db.query.articles.findMany({
    where: and(
      eq(articles.status, 'published'),
      sql`${articles.tags} @> ${JSON.stringify([tag])}::jsonb`,
    ),
    orderBy: [desc(articles.publishedAt)],
    limit: 30,
  });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--accent)] mb-4 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للموجز
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--ink)]">{tag}</h1>
              <p className="text-sm text-[var(--ink-soft)] mt-1">
                {list.length} {list.length === 1 ? 'خبر' : 'أخبار'} بهذا الوسم
              </p>
            </div>
          </div>
        </div>

        {list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--ink-soft)]">
            <p>لا توجد أخبار بهذا الوسم بعد.</p>
          </div>
        )}
      </main>
    </>
  );
}
