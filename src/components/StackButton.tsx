import Link from 'next/link';
import { Layers, ArrowLeft } from 'lucide-react';

export default function StackButton() {
  return (
    <Link
      href="/stack"
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[12.5px] font-bold bg-[var(--paper)] text-[var(--accent)] border border-[var(--border)] hover:border-[var(--accent-light)] hover:bg-[var(--accent-wash)] hover:-translate-y-0.5 transition-all group"
      title="عرض الكومة بأسلوب Tinder Swipe"
    >
      <Layers className="w-3.5 h-3.5 opacity-80 group-hover:rotate-12 transition-transform" />
      <span>تصفّح بالكومة</span>
      <ArrowLeft className="w-3 h-3 opacity-60 group-hover:translate-x-[-2px] transition-transform" />
    </Link>
  );
}
