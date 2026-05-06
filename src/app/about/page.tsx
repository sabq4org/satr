import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Code2 } from 'lucide-react';

export const metadata = {
  title: 'من نحن',
  description: 'سطر — صحيفة ذكية مختصرة. كل خبر في ٣ سطور.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 lg:px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-black mb-3 text-[var(--ink)]">من نحن</h1>
        <p className="text-lg text-[var(--ink-soft)] mb-10 leading-relaxed">
          نحن لا نضيف ضوضاء جديدة لعالمك. نختصر الكثير من الضوضاء إلى جوهر يستحق وقتك.
        </p>

        <div className="space-y-8">
          <Box title="الفكرة">
            <p>
              <strong>سطر</strong> صحيفة إلكترونية ذكية تقدّم كل خبر في ٣ سطور فقط:{' '}
              <em>الحدث، السياق، المعنى</em>. ليس اختصاراً متعجلاً، بل تحريراً مكثفاً يحوّل الخبر إلى منتج
              تحريري كامل بحجم تغريدة.
            </p>
          </Box>

          <Box title="الجمهور">
            <ul className="space-y-2 list-disc pr-5">
              <li>المهني المشغول الذي يلتقط الجوهر بين الاجتماعات.</li>
              <li>الأم العاملة التي تحتاج موجزاً سريعاً.</li>
              <li>الطالب الجامعي يبحث عن ثقافة عامة سريعة.</li>
              <li>كل من يقدّر وقته ولا يحب الحشو.</li>
            </ul>
          </Box>

          <Box title="التقنية">
            <p>
              مبنية بـ <strong>Next.js 16</strong> و <strong>React 19</strong>، مع طبقة ذكاء اصطناعي مرنة
              تدعم Ollama (محلي) و OpenAI (سحابي). قاعدة البيانات على Neon Postgres. الكود مفتوح
              المصدر لطلاب الإعلام والمطورين.
            </p>
          </Box>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-full font-bold text-sm hover:bg-[var(--accent-soft)] transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            قاعدة الـ٣
          </Link>
          <a
            href="https://github.com/sabq4org/satr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] rounded-full font-semibold text-sm hover:border-[var(--accent)] transition-colors"
          >
            <Code2 className="w-4 h-4" />
            GitHub
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] rounded-full font-semibold text-sm hover:border-[var(--accent)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للموجز
          </Link>
        </div>
      </main>
    </>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="satr-card p-6 md:p-8">
      <h2 className="text-xl font-black mb-3 text-[var(--ink)]">{title}</h2>
      <div className="text-[var(--ink-soft)] leading-relaxed">{children}</div>
    </section>
  );
}
