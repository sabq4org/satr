import { db, articles } from '@/lib/db';
import { desc } from 'drizzle-orm';
import Header from '@/components/Header';
import Link from 'next/link';
import { Plus, FileText, Eye, EyeOff } from 'lucide-react';
import { CATEGORY_LABELS, arabicTimeAgo } from '@/lib/utils';

export default async function AdminPage() {
  const all = await db.query.articles.findMany({
    orderBy: [desc(articles.createdAt)],
    limit: 50,
  });

  const stats = {
    total: all.length,
    published: all.filter((a) => a.status === 'published').length,
    draft: all.filter((a) => a.status === 'draft').length,
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--ink)]">لوحة التحرير</h1>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              {stats.total} خبر — {stats.published} منشور — {stats.draft} مسودة
            </p>
          </div>
          <Link
            href="/admin/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-soft)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            خبر جديد
          </Link>
        </div>

        {/* جدول الأخبار */}
        <div className="satr-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
                <tr>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--ink-soft)]">
                    الخبر
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--ink-soft)]">
                    القسم
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--ink-soft)]">
                    الحالة
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--ink-soft)]">
                    التاريخ
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--ink-soft)]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {all.map((article) => (
                  <tr key={article.id} className="hover:bg-[var(--bg)] transition-colors">
                    <td className="px-4 py-3 max-w-md">
                      <p className="font-semibold text-[var(--ink)] truncate">
                        {article.line1}
                      </p>
                      <p className="text-xs text-[var(--ink-faint)] truncate mt-1">
                        {article.line3}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`cat-badge cat-${article.category}`}>
                        {CATEGORY_LABELS[article.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {article.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                          <Eye className="w-3 h-3" /> منشور
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--ink-faint)]">
                          <EyeOff className="w-3 h-3" /> مسودة
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--ink-faint)]">
                      {arabicTimeAgo(article.publishedAt || article.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <Link
                        href={`/admin/edit/${article.id}`}
                        className="text-[var(--accent)] hover:underline text-xs font-semibold"
                      >
                        تعديل
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {all.length === 0 && (
          <div className="text-center py-20 text-[var(--ink-soft)]">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد أخبار بعد.</p>
          </div>
        )}
      </main>
    </>
  );
}
