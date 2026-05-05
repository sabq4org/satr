import { db, articles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import ArticleEditor from '@/components/ArticleEditor';
import { arabicTimeAgo } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!article) notFound();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--ink)]">
              تعديل الخبر
            </h1>
            <div className="flex items-center gap-3 text-sm text-[var(--ink-soft)] mt-1">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  article.status === 'published'
                    ? 'bg-emerald-100 text-emerald-700'
                    : article.status === 'draft'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {article.status === 'published'
                  ? 'منشور'
                  : article.status === 'draft'
                    ? 'مسودة'
                    : article.status}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                آخر تحديث {arabicTimeAgo(article.updatedAt)}
              </span>
            </div>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-full text-sm font-semibold hover:bg-[var(--bg)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Link>
        </div>

        <ArticleEditor mode="edit" article={article} />
      </main>
    </>
  );
}
