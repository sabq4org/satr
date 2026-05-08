'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, X, Loader2, Sparkles } from 'lucide-react';
import { CATEGORY_LABELS, arabicTimeAgo, cn } from '@/lib/utils';
import type { Article } from '@/lib/db/schema';

export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // اختصار الكيبورد: cmd/ctrl + K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // قفل التمرير عند الفتح
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // البحث (debounced)
  useEffect(() => {
    if (!open || !query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.articles || []);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [query, open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 pr-3 pl-2 py-2 rounded-full text-sm text-[var(--ink-soft)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        aria-label="بحث"
      >
        <Search className="w-4 h-4" />
        <span className="hidden lg:inline">بحث في الأخبار</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded border border-[var(--border)] text-[var(--ink-faint)] tnum">
          ⌘K
        </kbd>
      </button>

      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2.5 rounded-full text-[var(--ink-soft)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors"
        aria-label="بحث"
      >
        <Search className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="بحث"
          className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[var(--accent-deep)]/40 backdrop-blur-sm fade-in-up"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-xl bg-[var(--paper)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border)]">
            <div className="flex items-center gap-2 px-4 border-b border-[var(--border)]">
              <Search className="w-5 h-5 text-[var(--ink-faint)] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في كل سطور سطر..."
                className="flex-1 py-4 bg-transparent outline-none text-[var(--ink)] placeholder:text-[var(--ink-faint)] text-base"
                autoComplete="off"
              />
              {loading && <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full text-[var(--ink-faint)] hover:bg-[var(--bg)]"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query.trim() ? (
                <div className="p-6 text-center text-sm text-[var(--ink-soft)]">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-[var(--ink)] mb-1">اكتب لتبدأ البحث</p>
                  <p className="text-xs text-[var(--ink-faint)]">
                    ابحث في عناوين الأخبار، السياق، أو الوسوم
                  </p>
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="p-6 text-center text-sm text-[var(--ink-soft)]">
                  <p>لا نتائج لـ <strong>"{query}"</strong></p>
                  <p className="text-xs text-[var(--ink-faint)] mt-1">جرّب كلمة أخرى أو وسماً.</p>
                </div>
              ) : (
                <ul className="py-2">
                  {results.map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/article/${article.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--bg)] transition-colors group"
                      >
                        <span className={cn('cat-badge text-[10px] flex-shrink-0 mt-1', `cat-${article.category}`)}>
                          {CATEGORY_LABELS[article.category]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                            {article.line1}
                          </p>
                          <p className="text-[11px] text-[var(--ink-faint)] mt-0.5">
                            {arabicTimeAgo(article.publishedAt || article.createdAt)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg)] flex items-center justify-between text-[10px] text-[var(--ink-faint)]">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--paper)] font-mono">esc</kbd>
                للإغلاق
              </span>
              <span>كل خبر في ٣ سطور.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
