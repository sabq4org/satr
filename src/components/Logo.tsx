import Link from 'next/link';

export default function Logo({ size = 'md', showTagline = true, light = false }: { size?: 'sm' | 'md' | 'lg'; showTagline?: boolean; light?: boolean }) {
  const sizes = {
    sm: { text: 'text-2xl', sub: 'text-[10px]', dot: 'w-1.5 h-1.5', gap: 'gap-1' },
    md: { text: 'text-3xl', sub: 'text-xs', dot: 'w-2 h-2', gap: 'gap-1.5' },
    lg: { text: 'text-5xl', sub: 'text-sm', dot: 'w-3 h-3', gap: 'gap-2' },
  };
  const s = sizes[size];
  const textColor = light ? 'text-white' : 'text-[var(--accent)]';
  const dotColor = light ? 'bg-white' : 'bg-[var(--accent)]';
  const subColor = light ? 'text-white/60' : 'text-[var(--ink-soft)]';

  return (
    <Link href="/" className="inline-flex flex-col items-start group" aria-label="سطر — الرئيسية">
      <div className="flex items-baseline gap-2">
        <span className={`${s.text} font-black ${textColor} tracking-tight`}>
          سطر
        </span>
        <span className={`flex items-baseline ${s.gap}`} aria-hidden>
          <span className={`${s.dot} rounded-full ${dotColor} transition-transform group-hover:scale-125`} />
          <span className={`${s.dot} rounded-full ${dotColor} opacity-70 transition-transform delay-75 group-hover:scale-125`} />
          <span className={`${s.dot} rounded-full ${dotColor} opacity-40 transition-transform delay-150 group-hover:scale-125`} />
        </span>
      </div>
      {showTagline && (
        <span className={`${s.sub} ${subColor} font-medium tracking-wide mt-0.5`}>
          كل خبر في 3 سطور
        </span>
      )}
    </Link>
  );
}
