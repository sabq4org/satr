import Link from 'next/link';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { text: 'text-2xl', sub: 'text-[10px]' },
    md: { text: 'text-3xl', sub: 'text-xs' },
    lg: { text: 'text-5xl', sub: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <Link href="/" className="inline-flex flex-col items-start group">
      <div className="flex items-baseline gap-2">
        <span className={`${s.text} font-black text-[var(--accent)] tracking-tight`}>
          سطر
        </span>
        <span className="w-8 h-[3px] bg-[var(--accent)] rounded-full mb-1 group-hover:w-12 transition-all" />
      </div>
      <span className={`${s.sub} text-[var(--ink-soft)] font-medium tracking-wide`}>
        الخبر زبدة
      </span>
    </Link>
  );
}
