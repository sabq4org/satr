import { db, articles } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import { isOffline, currentEngine, currentModel } from '@/lib/ai';
import { WifiOff, Cpu, Cloud } from 'lucide-react';

export default async function HomePage() {
  // الموجز اليومي - 5 الأبرز
  const featured = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.isFeatured), desc(articles.publishedAt)],
    limit: 5,
  });

  // أحدث الأخبار
  const latest = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.publishedAt)],
    limit: 20,
  });

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* بانر المحرك الحالي */}
        {isOffline() && (
          <div className="mb-6 flex items-center gap-3 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900">
            {currentEngine() === 'ollama' ? <Cpu className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="font-semibold">
              {currentEngine() === 'ollama' ? 'محرك محلي:' : 'وضع Mock:'}
            </span>
            <code className="text-xs bg-white px-2 py-0.5 rounded font-mono">{currentModel()}</code>
            <span className="text-emerald-700/80">— في Ollama على جهازك. لا انترنت مطلوب.</span>
          </div>
        )}

        {/* عنوان الترحيب */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-[var(--ink)] mb-2">
            الموجز اليومي
          </h1>
          <p className="text-[var(--ink-soft)] text-sm">
            كل ما يهمك. في 3 أسطر فقط.
          </p>
        </div>

        {/* البطاقة المميزة (Hero) */}
        {featured[0] && (
          <div className="mb-10">
            <ArticleCard article={featured[0]} variant="featured" />
          </div>
        )}

        {/* بقية المميزة */}
        <section className="section-divider">
          <h2>أبرز الأخبار</h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {featured.slice(1).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* أحدث الأخبار */}
        <section className="section-divider">
          <h2>الأحدث</h2>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {latest.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-[var(--border)] text-center text-sm text-[var(--ink-soft)]">
          <p className="mb-2 font-semibold text-[var(--accent)]">سطر — الخبر زبدة</p>
          <p>© 2026 سطر. صحيفة ذكية مختصرة.</p>
        </footer>
      </main>
    </>
  );
}
