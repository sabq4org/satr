import { db, articles } from '@/lib/db';
import { sql } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import { Hash, ArrowRight } from 'lucide-react';
import { toArabicNum } from '@/lib/utils';

export const metadata = {
  title: 'كل الوسوم — سطر',
  description: 'تصفّح كل الكلمات المفتاحية في صحيفة سطر — كل خبر في ٣ سطور.',
};

export const revalidate = 300; // 5 min ISR

interface TagCount {
  tag: string;
  count: number;
}

async function getAllTags(): Promise<TagCount[]> {
  // jsonb_array_elements_text يفكّك المصفوفة إلى صفوف
  const result = (await db.execute<{ tag: string; count: number | string }>(sql`
    SELECT tag, COUNT(*)::int as count
    FROM ${articles}, jsonb_array_elements_text(${articles.tags}) AS tag
    WHERE ${articles.status} = 'published'
    GROUP BY tag
    ORDER BY count DESC, tag ASC
    LIMIT 200
  `)) as unknown as { tag: string; count: number | string }[];

  return result.map((r) => ({
    tag: r.tag,
    count: typeof r.count === 'string' ? parseInt(r.count, 10) : r.count,
  }));
}

// حجم الكلمة في السحابة بناءً على شيوعها
function tagSize(count: number, max: number): string {
  const ratio = count / Math.max(max, 1);
  if (ratio > 0.7) return 'text-3xl md:text-4xl font-black';
  if (ratio > 0.4) return 'text-2xl md:text-3xl font-black';
  if (ratio > 0.2) return 'text-xl md:text-2xl font-bold';
  if (ratio > 0.1) return 'text-lg md:text-xl font-bold';
  return 'text-base md:text-lg font-semibold';
}

function tagOpacity(count: number, max: number): string {
  const ratio = count / Math.max(max, 1);
  if (ratio > 0.5) return 'opacity-100';
  if (ratio > 0.25) return 'opacity-90';
  if (ratio > 0.1) return 'opacity-75';
  return 'opacity-60';
}

export default async function TagsIndexPage() {
  const tags = await getAllTags();
  const total = tags.length;
  const totalArticles = tags.reduce((sum, t) => sum + t.count, 0);
  const max = tags[0]?.count ?? 1;

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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase mb-1">
                المعجم
              </p>
              <h1 className="headline-display text-3xl md:text-4xl text-[var(--ink)]">كل الوسوم</h1>
              <p className="text-sm text-[var(--ink-soft)] mt-1">
                {toArabicNum(total)} وسماً · {toArabicNum(totalArticles)} ربط بالأخبار
              </p>
            </div>
          </div>
        </div>

        {tags.length > 0 ? (
          <>
            {/* Tag Cloud */}
            <section className="satr-card p-6 md:p-10 mb-8">
              <div className="flex flex-wrap gap-x-4 gap-y-3 items-baseline justify-center">
                {tags.map((t) => (
                  <Link
                    key={t.tag}
                    href={`/tag/${encodeURIComponent(t.tag)}`}
                    className={`${tagSize(t.count, max)} ${tagOpacity(
                      t.count,
                      max,
                    )} text-[var(--accent)] hover:text-[var(--ink)] hover:scale-105 transition-all duration-200 inline-flex items-baseline gap-1`}
                    title={`${t.count} ${t.count === 1 ? 'خبر' : 'أخبار'}`}
                  >
                    <span>#{t.tag}</span>
                    <span className="text-[10px] font-medium text-[var(--ink-faint)] tnum">
                      {toArabicNum(t.count)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* قائمة كاملة بدقة أعلى */}
            <section className="satr-card p-6">
              <h2 className="text-sm font-bold text-[var(--ink-soft)] mb-4 uppercase tracking-widest">
                مرتّبة حسب الشهرة
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {tags.map((t) => (
                  <li key={t.tag}>
                    <Link
                      href={`/tag/${encodeURIComponent(t.tag)}`}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-[var(--accent-light)] group transition-colors"
                    >
                      <span className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] truncate">
                        #{t.tag}
                      </span>
                      <span className="text-xs font-bold text-[var(--ink-faint)] tnum">
                        {toArabicNum(t.count)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <EmptyState
            title="لا توجد وسوم بعد"
            description="عند نشر أول خبر بوسم، ستظهر سحابة الكلمات هنا — معجم سطر بصرياً."
            ctaHref="/"
            ctaLabel="ارجع للموجز"
          />
        )}
      </main>
      <Footer />
    </>
  );
}
