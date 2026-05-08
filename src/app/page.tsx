import { db, articles } from '@/lib/db';
import { desc, eq, and, gte } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import HeroBreaking from '@/components/HeroBreaking';
import LiveBar from '@/components/LiveBar';
import StackButton from '@/components/StackButton';
import TodaysPulse from '@/components/TodaysPulse';
import EmptyState from '@/components/EmptyState';
import { isOffline, currentEngine, currentModel } from '@/lib/ai';
import { toArabicNum } from '@/lib/utils';
import { Cpu, WifiOff, TrendingUp, Clock, Flame } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // العاجل آخر 24 ساعة
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const breaking = await db.query.articles.findMany({
    where: and(
      eq(articles.status, 'published'),
      eq(articles.isBreaking, true),
      gte(articles.publishedAt, since),
    ),
    orderBy: [desc(articles.publishedAt)],
    limit: 5,
  });

  const featured = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.isFeatured), desc(articles.publishedAt)],
    limit: 5,
  });

  const latest = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.publishedAt)],
    limit: 20,
  });

  // الترند: الأكثر مشاهدة
  const trending = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.views)],
    limit: 4,
  });

  const featuredIds = new Set(featured.map((a) => a.id));
  const latestFiltered = latest.filter((a) => !featuredIds.has(a.id));
  const totalCount = latest.length;

  return (
    <>
      <Header active="home" />

      {/* شريط العاجل (إن وجد) */}
      {breaking.length > 0 && <LiveBar items={breaking} />}

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* بانر المحرك */}
        {isOffline() && (
          <div className="mb-6 flex items-center gap-3 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900">
            {currentEngine() === 'ollama' ? (
              <Cpu className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span className="font-semibold">
              {currentEngine() === 'ollama' ? 'محرك محلي:' : 'وضع Mock:'}
            </span>
            <code className="text-xs bg-white px-2 py-0.5 rounded font-mono">
              {currentModel()}
            </code>
            <span className="text-emerald-700/80">— على جهازك، بلا إنترنت.</span>
          </div>
        )}

        {totalCount > 0 ? (
          <>
            {/* نبض اليوم — التحية + الإحصائيات الإبداعية */}
            <TodaysPulse articles={latest} breakingCount={breaking.length} />

            {/* صف العنوان + زر الكومة */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase mb-2">
                  {new Intl.DateTimeFormat('ar-SA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date())}
                </p>
                <h1 className="headline-display text-3xl md:text-5xl mb-2 text-[var(--ink)]">
                  الموجز اليومي
                </h1>
                <p className="text-[var(--ink-soft)] text-sm md:text-base">
                  {toArabicNum(totalCount)} {totalCount === 1 ? 'خبر' : 'خبراً'} مكثّفاً بعناية. كل خبر في ٣ سطور — لا أكثر.
                </p>
              </div>
              <StackButton />
            </div>

            {/* البطاقة المميزة (Hero) */}
            {featured[0] && <HeroBreaking article={featured[0]} />}

            {/* بقية المميزة */}
            {featured.length > 1 && (
              <>
                <section className="section-divider">
                  <h2 className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
                    أبرز ما تأخذه
                  </h2>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                  {featured.slice(1).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            )}

            {/* الترند */}
            {trending.some((a) => (a.views || 0) > 0) && (
              <>
                <section className="section-divider">
                  <h2 className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[var(--breaking)]" />
                    الأكثر قراءة
                  </h2>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                  {trending.map((article, i) => (
                    <RankedCard key={article.id} article={article} rank={i + 1} />
                  ))}
                </div>
              </>
            )}

            {/* أحدث */}
            <section className="section-divider">
              <h2 className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--accent)]" />
                تتابع الأخبار
              </h2>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestFiltered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="لا توجد أخبار منشورة بعد"
            description="سطر يقدّم كل خبر في ٣ سطور — الحدث، السياق، المعنى. أول الأخبار قادم. اكتشف فلسفتنا التحريرية في انتظار الموجز."
            ctaHref="/manifesto"
            ctaLabel="اقرأ قاعدة الـ٣"
          />
        )}
      </main>

      <Footer />
    </>
  );
}

function RankedCard({ article, rank }: { article: typeof articles.$inferSelect; rank: number }) {
  return (
    <a
      href={`/article/${article.id}`}
      className="satr-card p-4 flex gap-3 group hover:border-[var(--accent)]"
    >
      <div className="flex-shrink-0">
        <span className="block stat-num text-[2.5rem] text-[var(--accent-light)] group-hover:text-[var(--accent)] transition-colors leading-none">
          {toArabicNum(String(rank).padStart(2, '0'))}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-[var(--ink)] line-clamp-3 leading-relaxed group-hover:text-[var(--accent)] transition-colors">
          {article.line1}
        </p>
        <p className="text-xs text-[var(--ink-faint)] mt-2 tnum">
          {toArabicNum((article.views || 0).toLocaleString('ar-SA'))} مشاهدة
        </p>
      </div>
    </a>
  );
}
