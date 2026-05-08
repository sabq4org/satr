import Link from 'next/link';
import { Layers, ArrowLeft } from 'lucide-react';

export default function StackButton() {
  return (
    <Link
      href="/stack"
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--paper)] text-[var(--accent)] rounded-full text-sm font-bold border border-[var(--accent-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all group"
      title="عرض الكومة بأسلوب Tinder Swipe"
    >
      <Layers className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
      <span>تصفّح بالكومة</span>
      <ArrowLeft className="w-3 h-3 group-hover:translate-x-[-2px] transition-transform" />
    </Link>
  );
}
