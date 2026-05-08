'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const LINE_LABELS = ['الحدث', 'السياق', 'المعنى'] as const;
const LINE_NUMBERS = ['١', '٢', '٣'] as const;

interface Props {
  line1: string;
  line2: string;
  line3: string;
}

/**
 * عرض الأسطر الثلاثة بإيقاع تحريري:
 * - رقم عربي واضح
 * - تسمية صغيرة ('الحدث' / 'السياق' / 'المعنى')
 * - كشف تتابعي عند الدخول
 */
export default function ThreeLines({ line1, line2, line3 }: Props) {
  const [reveal, setReveal] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    setReveal(true);
  }, []);

  const lines = [line1, line2, line3];

  return (
    <div className="space-y-6 mb-8 relative">
      {lines.map((line, i) => (
        <div
          key={i}
          className={cn(
            'relative pr-14 transition-all',
            reveal && !reduced ? 'line-reveal' : 'opacity-100',
          )}
          style={{ animationDelay: reveal && !reduced ? `${i * 0.18}s` : undefined }}
        >
          {/* رقم */}
          <div
            aria-hidden
            className="absolute right-0 top-0 flex flex-col items-center"
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-black text-base',
                i === 2
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--accent-light)] text-[var(--accent)]',
              )}
            >
              {LINE_NUMBERS[i]}
            </div>
            <span className="text-[10px] font-bold text-[var(--ink-faint)] tracking-widest mt-1.5 uppercase">
              {LINE_LABELS[i]}
            </span>
          </div>

          {/* النص */}
          <p
            className={cn(
              'leading-loose',
              i === 0 && 'text-xl md:text-2xl font-black text-[var(--ink)] tracking-tight',
              i === 1 && 'text-base md:text-lg font-medium text-[var(--ink-soft)]',
              i === 2 && 'text-base md:text-lg font-bold text-[var(--accent)] italic',
            )}
          >
            {line}
          </p>
        </div>
      ))}
    </div>
  );
}
