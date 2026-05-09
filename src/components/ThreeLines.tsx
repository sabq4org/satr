'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const LINE_LABELS = ['الحدث', 'السياق', 'المعنى'] as const;
const LINE_NUMBERS = ['1', '2', '3'] as const;

interface Props {
  line1: string;
  line2: string;
  line3: string;
}

/**
 * عرض الأسطر الثلاثة في صفحة المقال — إيقاع مجلة راقٍ:
 *  • رقم وتسمية صغيرة على الجنب (الحدث / السياق / المعنى)
 *  • فواصل ناعمة بين الأسطر
 *  • كشف تتابعي عند الدخول (line-reveal)
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
    <div className="my-2">
      {lines.map((line, i) => (
        <div
          key={i}
          className={cn(
            'relative pr-12 md:pr-14 py-5',
            i > 0 && 'border-t border-[var(--border-soft)]',
            reveal && !reduced ? 'line-reveal' : 'opacity-100',
          )}
          style={{ animationDelay: reveal && !reduced ? `${i * 0.18}s` : undefined }}
        >
          {/* رقم + تسمية */}
          <div aria-hidden className="absolute right-0 top-5 flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-black text-sm',
                i === 2
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--accent-wash)] text-[var(--accent)]',
              )}
            >
              {LINE_NUMBERS[i]}
            </div>
            <span className="text-[9px] font-bold text-[var(--ink-faint)] tracking-[0.18em] uppercase">
              {LINE_LABELS[i]}
            </span>
          </div>

          {/* النص */}
          <p
            className={cn(
              'leading-loose',
              i === 0 && 'text-xl md:text-[1.75rem] font-black text-[var(--ink)] tracking-tight',
              i === 1 && 'text-base md:text-[17px] font-medium text-[var(--ink-soft)]',
              i === 2 && 'text-base md:text-[17px] font-bold text-[var(--accent)] italic',
            )}
          >
            {line}
          </p>
        </div>
      ))}
    </div>
  );
}
