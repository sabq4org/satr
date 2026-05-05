import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ArticleEditor from '@/components/ArticleEditor';

export default function NewArticlePage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--ink)]">
              خبر جديد
            </h1>
            <p className="text-sm text-[var(--ink-soft)] mt-1">
              قاعدة الـ3: السطر 1 = الحدث / السطر 2 = السياق / السطر 3 = المعنى
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-full text-sm font-semibold hover:bg-[var(--bg)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Link>
        </div>

        <ArticleEditor mode="create" />
      </main>
    </>
  );
}
