import Link from 'next/link';
import { Layers, ArrowLeft } from 'lucide-react';

export default function StackButton() {
  return (
    <Link
      href="/stack"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-black tracking-wide text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group"
      style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)',
      }}
      title="عرض الكومة بأسلوب Tinder Swipe"
    >
      <Layers className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
      <span>تصفّح بالكومة</span>
      <ArrowLeft className="w-3 h-3 group-hover:translate-x-[-2px] transition-transform opacity-80" />
    </Link>
  );
}
