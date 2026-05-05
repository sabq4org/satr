import Link from 'next/link';
import { Layers } from 'lucide-react';

export default function StackButton() {
  return (
    <Link
      href="/stack"
      className="self-start inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-l from-[var(--accent)] to-[#2a4a6e] text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all group"
    >
      <Layers className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      <span>تصفّح بالكومة</span>
      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
        Tinder Style
      </span>
    </Link>
  );
}
