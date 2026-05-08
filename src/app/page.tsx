import { db, articles } from '@/lib/db';
import { desc, eq, and, gte } from 'drizzle-orm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import LiveBar from '@/components/LiveBar';
import TodaysPulse from '@/components/TodaysPulse';
import EmptyState from '@/components/EmptyState';
import { isOffline, currentEngine, currentModel } from '@/lib/ai';
import { Cpu, WifiOff } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
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

  const latest = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: [desc(articles.publishedAt)],
    limit: 24,
  });

  return (
    <>
      <Header active="home" />
      {breaking.length > 0 && <LiveBar items={breaking} />}

      <main className="max-w-6xl mx-auto px-4 lg:px-6 py-8">

        {/* بانر المحرك */}
        {isOffline() && (
          <div className="mb-6 flex items-center gap-3 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900">
            {currentEngine() === 'ollama' ? <Cpu className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="font-semibold">{currentEngine() === 'ollama' ? 'محرك محلي:' : 'وضع Mock:'}</span>
            <code className="text-xs bg-white px-2 py-0.5 rounded font-mono">{currentModel()}</code>
          </div>
        )}

        {latest.length > 0 ? (
          <>
            <TodaysPulse articles={latest} breakingCount={breaking.length} />

            {/* شبكة موحدة — كل البطاقات بنفس الحجم */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="لا توجد أخبار منشورة بعد"
            description="سطر يقدّم كل خبر في ٣ سطور — الحدث، السياق، المعنى."
            ctaHref="/manifesto"
            ctaLabel="اقرأ قاعدة الـ٣"
          />
        )}
      </main>

      <Footer />
    </>
  );
}
