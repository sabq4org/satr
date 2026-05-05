'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  articleId: string;
  initialContent?: string | null;
}

export default function DeepenInline({ articleId, initialContent }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string[] | null>(
    initialContent ? tryParse(initialContent) : null,
  );

  async function handleOpen() {
    setOpen(true);
    if (content) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${articleId}/deepen`, { method: 'POST' });
      const data = await res.json();
      setContent(data.paragraphs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="group w-full mt-6 flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border border-dashed border-[var(--accent)]/40 bg-gradient-to-l from-[var(--accent-light)]/30 to-transparent hover:border-[var(--accent)] hover:bg-[var(--accent-light)]/50 transition-all"
      >
        <div className="flex items-center gap-3 text-[var(--accent)]">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold text-sm">وضّح أكثر بالذكاء الاصطناعي</span>
        </div>
        <ChevronDown className="w-4 h-4 text-[var(--accent)] group-hover:translate-y-0.5 transition-transform" />
      </button>
    );
  }

  return (
    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-l from-[var(--accent-light)]/40 to-[var(--accent-light)]/10 border border-[var(--accent-light)]">
      <div className="flex items-center gap-2 mb-4 text-[var(--accent)]">
        <Sparkles className={cn('w-4 h-4', loading && 'animate-pulse')} />
        <span className="text-xs font-bold tracking-wide">توسعة ذكية</span>
        {!loading && (
          <span className="text-[10px] text-[var(--ink-faint)]">— محتوى توليدي قابل للمراجعة</span>
        )}
      </div>
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-3 bg-[var(--accent-light)] rounded animate-pulse"
              style={{ width: `${100 - i * 12}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3 text-[15px] leading-loose text-[var(--ink)]">
          {content?.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function tryParse(raw: string): string[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  // إذا كان نص عادي، اقسمه على الفقرات
  return raw.split(/\n\n+/).filter(Boolean);
}
