import { notFound } from 'next/navigation';
import { db, articles } from '@/lib/db';
import { desc, eq, and } from 'drizzle-orm';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import { CATEGORY_LABELS } from '@/lib/utils';
import type { Category } from '@/lib/db/schema';

const VALID = Object.keys(CATEGORY_LABELS) as Category[];

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!VALID.includes(slug as Category)) notFound();

  const results = await db.query.articles.findMany({
    where: and(
      eq(articles.status, 'published'),
      eq(articles.category, slug as Category)
    ),
    orderBy: [desc(articles.publishedAt)],
    limit: 30,
  });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[var(--ink)] mb-2">
            {CATEGORY_LABELS[slug as Category]}
          </h1>
          <p className="text-sm text-[var(--ink-soft)]">
            {results.length} خبر — كل واحد في ٣ سطور
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20 text-[var(--ink-soft)]">
            لا توجد أخبار في هذا القسم بعد.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
