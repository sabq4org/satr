import { db, articles } from '@/lib/db';
import { eq, and, ne, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';
import ShareBar from '@/components/ShareBar';
import ReadingProgress from '@/components/ReadingProgress';
import DeepenInline from '@/components/DeepenInline';
import ThreeLines from '@/components/ThreeLines';
import {
  CATEGORY_LABELS,
  SOURCE_TRUST_LABELS,
  arabicTimeAgo,
  readTime,
  toArabicNum,
} from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeft, Eye, Calendar, Tag as TagIcon, Clock3 } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!article) return { title: 'الخبر غير موجود — سطر' };

  const description = `${article.line1} • ${article.line2} • ${article.line3}`;
  return {
    title: `${article.line1} — سطر`,
    description,
    openGraph: {
      title: article.line1,
      description,
      type: 'article',
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.line1,
      description,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await db.query.articles.findFirst({ where: eq(articles.id, id) });

  if (!article || article.status !== 'published') notFound();

  // زيادة عداد المشاهدات (fire-and-forget، آمن لو فشل)
  db.update(articles)
    .set({ views: (article.views || 0) + 1 })
    .where(eq(articles.id, id))
    .catch(() => {});

  // أخبار ذات صلة (نفس التصنيف)
  const related = await db.query.articles.findMany({
    where: and(
      eq(articles.status, 'published'),
      eq(articles.category, article.category),
      ne(articles.id, article.id),
    ),
    orderBy: [desc(articles.publishedAt)],
    limit: 4,
  });

  const trust = article.sourceTrust ? SOURCE_TRUST_LABELS[article.sourceTrust] : null;
  const url = `/article/${article.id}`;
  const fullText = `${article.line1}\n\n${article.line2}\n\n${article.line3}`;
  const seconds = readTime(article.line1, article.line2, article.line3);

  return (
    <>
      <ReadingProgress />
      <Header active={article.category} />

      <main className="max-w-3xl mx-auto px-4 lg:px-6 py-8">
        {/* مسار التنقل */}
        <nav
          className="flex items-center gap-2 text-sm text-[var(--ink-soft)] mb-6"
          aria-label="مسار التنقل"
        >
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">
            الموجز
          </Link>
          <ChevronLeft className="w-4 h-4" aria-hidden />
          <Link
            href={`/category/${article.category}`}
            className="hover:text-[var(--accent)] transition-colors"
          >
            {CATEGORY_LABELS[article.category]}
          </Link>
        </nav>

        {/* البطاقة الرئيسية */}
        <article className="satr-card overflow-hidden">
          {/* الصورة */}
          {article.imageUrl && (
            <div className="relative w-full h-72 md:h-96 overflow-hidden bg-[var(--accent-light)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.imageAlt || article.line1}
                className="w-full h-full object-cover"
              />
              {article.isBreaking && (
                <div className="absolute top-4 right-4">
                  <span className="breaking-badge text-sm">عاجل</span>
                </div>
              )}
              {/* تدرج خفيف من الأسفل */}
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* meta علوي */}
            <div className="flex flex-wrap items-center gap-3 mb-7 text-sm">
              <span className={`cat-badge cat-${article.category}`}>
                {CATEGORY_LABELS[article.category]}
              </span>
              {article.isBreaking && !article.imageUrl && (
                <span className="breaking-badge">عاجل</span>
              )}
              <span className="flex items-center gap-1 text-[var(--ink-faint)]">
                <Calendar className="w-3.5 h-3.5" />
                {arabicTimeAgo(article.publishedAt || article.createdAt)}
              </span>
              <span className="flex items-center gap-1 text-[var(--ink-faint)]">
                <Eye className="w-3.5 h-3.5" />
                {toArabicNum((article.views || 0).toLocaleString('ar-SA'))} مشاهدة
              </span>
              <span className="read-time">
                <Clock3 className="w-3 h-3" />
                {toArabicNum(seconds)} ث قراءة
              </span>
            </div>

            {/* الأسطر الثلاثة بإيقاع تحريري + كشف تتابعي */}
            <ThreeLines line1={article.line1} line2={article.line2} line3={article.line3} />

            {/* AI Deepen — بشكل مدمج وأنيق */}
            <DeepenInline articleId={article.id} initialContent={article.expandedContent || null} />

            {/* المصدر والثقة */}
            {(article.source || trust) && (
              <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-[var(--border)]">
                {trust && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--accent-light)] text-[var(--accent)]"
                    title={trust.label}
                  >
                    <span aria-hidden>{trust.icon}</span>
                    <span>{trust.label}</span>
                  </span>
                )}
                {article.source && (
                  <span className="text-sm text-[var(--ink-soft)]">
                    المصدر:{' '}
                    {article.sourceUrl ? (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline font-semibold"
                      >
                        {article.source}
                      </a>
                    ) : (
                      <span className="font-semibold">{article.source}</span>
                    )}
                  </span>
                )}
              </div>
            )}

            {/* الوسوم */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-6 flex-wrap">
                <TagIcon className="w-4 h-4 text-[var(--ink-faint)]" />
                {article.tags.map((tag) => (
                  <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} className="tag">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* شريط المشاركة */}
        <ShareBar articleId={article.id} url={url} text={fullText} title={article.line1} />

        {/* أخبار ذات صلة */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="section-divider">
              <h2>المزيد من {CATEGORY_LABELS[article.category]}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} variant="default" />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
