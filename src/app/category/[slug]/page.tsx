import { notFound } from 'next/navigation';
import { db, articles } from '@/lib/db';
import { desc, eq, and } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import EmptyState from '@/components/EmptyState';
import { CATEGORY_LABELS, CATEGORY_EMOJI, toArabicNum } from '@/lib/utils';
import type { Category } from '@/lib/db/schema';
import type { Metadata } from 'next';

const VALID = Object.keys(CATEGORY_LABELS) as Category[];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!VALID.includes(slug as Category)) return { title: 'قسم غير موجود' };
  const label = CATEGORY_LABELS[slug as Category];
  return {
    title: `${label} — سطر`,
    description: `كل أخبار ${label} في ٣ سطور.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (!VALID.includes(slug as Category)) notFound();

  const cat = slug as Category;
  const results = await db.query.articles.findMany({
    where: and(eq(articles.status, 'published'), eq(articles.category, cat)),
    orderBy: [desc(articles.publishedAt)],
    limit: 30,
  });

  return (
    <>
      <Header active={cat} />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="mb-10 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
            style={{ background: `var(--${cat})`, color: 'white' }}
            aria-hidden
          >
            {CATEGORY_EMOJI[cat]}
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase mb-1">
              قسم
            </p>
            <h1 className="headline-display text-3xl md:text-4xl text-[var(--ink)]">
              {CATEGORY_LABELS[cat]}
            </h1>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              {toArabicNum(results.length)} {results.length === 1 ? 'خبر' : 'خبراً'} — كل واحد في ٣ سطور
            </p>
          </div>
        </div>

        {results.length === 0 ? (
          <EmptyState
            title={`لا أخبار بعد في ${CATEGORY_LABELS[cat]}`}
            description="هذا القسم بانتظار خبره الأول. اطلع على الأقسام الأخرى أو فلسفتنا التحريرية."
            ctaHref="/"
            ctaLabel="ارجع للموجز"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
