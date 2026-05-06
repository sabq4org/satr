import Header from '@/components/Header';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'قاعدة الـ3',
  description: 'فلسفة سطر: كل خبر في ٣ سطور — الحدث، السياق، المعنى.',
};

export default function ManifestoPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 lg:px-6 py-12">
        <p className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase mb-4 text-center">
          الفلسفة
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-center mb-3 leading-tight">
          قاعدة الـ٣
        </h1>
        <p className="text-center text-lg text-[var(--ink-soft)] mb-12">
          كل خبر يستحق ثلاثة أسطر فقط. <br className="md:hidden" />
          الزائد عبء، والناقص خداع.
        </p>

        {/* البطاقة الإيضاحية */}
        <div className="satr-card p-8 md:p-12 mb-10 bg-gradient-to-br from-[var(--paper)] to-[var(--accent-light)]/30">
          <div className="space-y-8">
            {[
              {
                num: '١',
                title: 'الحدث',
                color: 'var(--ink)',
                desc: 'ماذا حدث؟ من؟ أين؟ متى؟ — حقائق صرفة بدون تأويل، في 15-20 كلمة. هذه هي القشرة الصلبة للخبر.',
                example: 'أرامكو تخفض إنتاجها 500 ألف برميل يومياً.',
              },
              {
                num: '٢',
                title: 'السياق',
                color: 'var(--ink-soft)',
                desc: 'لماذا الآن؟ ما الخلفية؟ ما الذي سبق هذا الحدث؟ — الجسر بين الخبر وما حوله، في 15-20 كلمة.',
                example: 'الثالث منذ 2024، رد على ضعف الطلب الصيني.',
              },
              {
                num: '٣',
                title: 'المعنى',
                color: 'var(--accent)',
                desc: 'ماذا يعني هذا للقارئ؟ ما التأثير؟ — الخلاصة الذكية في 10-15 كلمة. هذا ما يفرّق سطراً عن مجرد عنوان.',
                example: 'النفط يرتفع، السوق السعودي يتأثر إيجاباً.',
              },
            ].map((line) => (
              <div key={line.num} className="flex gap-5">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center"
                  style={{ color: line.color }}
                >
                  <span className="text-2xl font-black">{line.num}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-1.5" style={{ color: line.color }}>
                    {line.title}
                  </h3>
                  <p className="text-[var(--ink-soft)] leading-relaxed mb-3">{line.desc}</p>
                  <div className="px-4 py-3 rounded-xl bg-[var(--bg)] border-r-4 border-[var(--accent)]">
                    <p className="text-sm italic font-semibold" style={{ color: line.color }}>
                      "{line.example}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* لماذا */}
        <div className="space-y-8 mb-12">
          <Section title="لماذا ٣ سطور؟" icon={<Sparkles className="w-5 h-5" />}>
            <p>
              متوسط وقت القراءة على الموبايل اليوم لا يتجاوز <strong>8 ثوانٍ</strong>. 70% من القراء لا يكملون
              خبراً يتجاوز 600 كلمة. السوشال ميديا غيّرت "نَفَس" القارئ، وقتله الجبّار يطلب جوهراً مكثفاً.
            </p>
            <p>
              قاعدة الـ3 ليست اختصاراً متهوّراً — هي <strong>تحرير ذكي مكثف</strong>. كل سطر هنا يساوي
              عمود رأي كامل في صحيفة تقليدية، لكن بحجم تغريدة.
            </p>
          </Section>

          <Section title="منهجنا التحريري">
            <ul className="space-y-3 list-none pr-0">
              {[
                'الذكاء يقترح، البشري يحرر — ولا نشر بدون مراجعة بشرية.',
                'كل خبر يحمل شارة ثقة المصدر (🟢 رسمي / 🟡 وكالة / 🔵 شريكة).',
                'لا عناوين مضللة، لا "ستصدمك"، لا قنابل عاطفية.',
                'إذا كان الخبر يحتاج أكثر من ٣ سطور، فإما أنه عدة أخبار، أو لم يُحرَّر بعد.',
              ].map((p, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-black flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-[var(--ink)]">{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-full font-bold hover:bg-[var(--accent-soft)] transition-colors"
          >
            ابدأ القراءة
          </Link>
        </div>
      </main>
    </>
  );
}

function Section({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <section className="satr-card p-6 md:p-8">
      <h2 className="text-xl font-black mb-4 flex items-center gap-2 text-[var(--ink)]">
        {icon && <span className="text-[var(--accent)]">{icon}</span>}
        {title}
      </h2>
      <div className="space-y-3 leading-relaxed text-[var(--ink-soft)]">{children}</div>
    </section>
  );
}
