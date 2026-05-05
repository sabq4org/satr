import { db, articles } from '@/lib/db';
import { desc, eq, and, gte } from 'drizzle-orm';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import HeroBreaking from '@/components/HeroBreaking';
import LiveBar from '@/components/LiveBar';
import StackButton from '@/components/StackButton';
import { isOffline, currentEngine, currentModel } from '@/lib/ai';
import { Cpu, WifiOff, TrendingUp, Clock, Layers } from 'lucide-react';

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
      <Header />

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

        {/* العنوان مع تاريخ ودعوة الكومة */}
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
            <h1 className="text-3xl md:text-5xl font-black text-[var(--ink)] mb-2 tracking-tight">
              الموجز اليومي
            </h1>
            <p className="text-[var(--ink-soft)] text-sm md:text-base">
              {totalCount} خبر مختصر بعناية. كل خبر في 3 أسطر — لا أكثر.
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
                <span className="text-xl">🔥</span>
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

        {latest.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--ink-soft)] text-lg mb-2">لا توجد أخبار منشورة بعد.</p>
            <p className="text-[var(--ink-faint)] text-sm">سجل دخولك من لوحة التحرير لإضافة أول خبر.</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-24 pt-10 border-t border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="font-black text-[var(--accent)] text-2xl mb-2">سطر</p>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                صحيفة ذكية مختصرة. كل خبر في 3 أسطر فقط — الحدث، السياق، المعنى.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-3 text-[var(--ink)]">القراءة</h3>
              <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
                <li>
                  <a href="/" className="hover:text-[var(--accent)] transition-colors">
                    الموجز اليومي
                  </a>
                </li>
                <li>
                  <a href="/stack" className="hover:text-[var(--accent)] transition-colors">
                    عرض الكومة
                  </a>
                </li>
                <li>
                  <a href="/feed.xml" className="hover:text-[var(--accent)] transition-colors">
                    RSS
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-3 text-[var(--ink)]">المنهج</h3>
              <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
                <li>
                  <a href="/about" className="hover:text-[var(--accent)] transition-colors">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="/manifesto" className="hover:text-[var(--accent)] transition-colors">
                    قاعدة الـ3
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs text-[var(--ink-faint)] pb-6">
            © 2026 سطر. الخبر زبدة.
          </div>
        </footer>
      </main>
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
        <span className="block text-3xl font-black text-[var(--accent-light)] group-hover:text-[var(--accent)] transition-colors leading-none">
          {String(rank).padStart(2, '0')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-[var(--ink)] line-clamp-3 leading-relaxed group-hover:text-[var(--accent)] transition-colors">
          {article.line1}
        </p>
        <p className="text-xs text-[var(--ink-faint)] mt-2">
          {(article.views || 0).toLocaleString('ar-SA')} مشاهدة
        </p>
      </div>
    </a>
  );
}
