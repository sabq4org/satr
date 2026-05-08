'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/db/schema';

export default function LiveBar({ items }: { items: Article[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, 5500);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const current = items[idx];

  return (
    <div className="bg-[var(--breaking)] text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center gap-3 py-2 overflow-hidden">
        <span className="flex items-center gap-1.5 flex-shrink-0 font-bold text-[10.5px] tracking-[0.18em] uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          عاجل
        </span>
        <span aria-hidden className="w-px h-3 bg-white/25 flex-shrink-0" />
        <Link
          key={current.id}
          href={`/article/${current.id}`}
          className="flex-1 text-[13px] font-medium truncate hover:underline fade-in-up"
        >
          {current.line1}
        </Link>
        <div className="hidden sm:flex gap-1 flex-shrink-0">
          {items.map((_, i) => (
            <span
              key={i}
              className={`w-1 h-1 rounded-full transition-all ${
                i === idx ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
