'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Sparkles, Save, Send, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/utils';
import type { Category } from '@/lib/db/schema';

export default function NewArticlePage() {
  const router = useRouter();
  const [rawText, setRawText] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<Category>('local');
  const [source, setSource] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // عدّاد الكلمات لكل سطر
  const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
  const w1 = wordCount(line1);
  const w2 = wordCount(line2);
  const w3 = wordCount(line3);

  // التحقق من قاعدة الأسطر الثلاثة
  const v1 = w1 >= 8 && w1 <= 25;
  const v2 = w2 >= 8 && w2 <= 25;
  const v3 = w3 >= 5 && w3 <= 20;
  const allValid = v1 && v2 && v3 && line1 && line2 && line3;

  async function handleAI() {
    if (rawText.length < 30) {
      setError('النص قصير جداً للتلخيص');
      return;
    }
    setError(null);
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLine1(data.line1 || '');
      setLine2(data.line2 || '');
      setLine3(data.line3 || '');
      setTags(data.tags || []);
    } catch (e: any) {
      setError(e.message || 'فشل التلخيص');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSave(publish: boolean) {
    if (!allValid) {
      setError('تأكد من الالتزام بقاعدة الأسطر الثلاثة');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line1, line2, line3, tags, category, source,
          imageUrl: imageUrl || undefined,
          isBreaking, isFeatured,
          status: publish ? 'published' : 'draft',
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      router.push('/admin');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--accent)] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          عودة
        </button>

        <h1 className="text-3xl font-black text-[var(--ink)] mb-2">خبر جديد</h1>
        <p className="text-sm text-[var(--ink-soft)] mb-8">
          الزم قاعدة الأسطر الثلاثة. لا مزيد، لا أقل.
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* العمود الرئيسي */}
          <div className="lg:col-span-2 space-y-6">
            {/* لصق النص الخام */}
            <div className="satr-card p-5">
              <label className="block text-sm font-bold text-[var(--ink)] mb-2">
                النص الخام (اختياري)
              </label>
              <p className="text-xs text-[var(--ink-soft)] mb-3">
                الصق خبراً طويلاً وسيلخصه الذكاء في 3 أسطر
              </p>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={5}
                placeholder="ألصق الخبر الكامل هنا..."
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:border-[var(--accent)] focus:outline-none text-sm leading-relaxed bg-[var(--bg)]"
              />
              <button
                onClick={handleAI}
                disabled={aiLoading || rawText.length < 30}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-[var(--accent-light)] text-[var(--accent)] rounded-full text-sm font-semibold hover:bg-[var(--accent)] hover:text-white disabled:opacity-50 transition-all"
              >
                <Sparkles className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
                {aiLoading ? 'جاري التلخيص...' : 'لخّص بالذكاء'}
              </button>
            </div>

            {/* الأسطر الثلاثة */}
            <div className="satr-card p-5">
              <h2 className="text-lg font-bold text-[var(--ink)] mb-4 flex items-center gap-2">
                الأسطر الثلاثة
                {allValid && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              </h2>

              <LineInput
                label="السطر 1 — الحدث (15-20 كلمة)"
                value={line1}
                onChange={setLine1}
                count={w1}
                valid={v1}
                placeholder="ماذا حدث، من، أين، متى"
                color="var(--ink)"
                weight="700"
              />
              <LineInput
                label="السطر 2 — السياق (15-20 كلمة)"
                value={line2}
                onChange={setLine2}
                count={w2}
                valid={v2}
                placeholder="لماذا الآن، خلفية، رابط بأحداث سابقة"
                color="var(--ink-soft)"
                weight="500"
              />
              <LineInput
                label="السطر 3 — المعنى (10-15 كلمة)"
                value={line3}
                onChange={setLine3}
                count={w3}
                valid={v3}
                placeholder="التأثير، الدلالة، ماذا يعني للقارئ"
                color="var(--accent)"
                weight="600"
                italic
              />
            </div>

            {/* المعاينة */}
            {(line1 || line2 || line3) && (
              <div className="satr-card p-5 bg-[var(--bg)]">
                <h3 className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wide mb-3">
                  معاينة
                </h3>
                <div className="space-y-3">
                  {line1 && <p className="satr-line satr-line-1">{line1}</p>}
                  {line2 && <p className="satr-line satr-line-2">{line2}</p>}
                  {line3 && <p className="satr-line satr-line-3">{line3}</p>}
                </div>
              </div>
            )}
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-5">
            <div className="satr-card p-5 space-y-4">
              <h3 className="font-bold text-[var(--ink)]">الإعدادات</h3>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-soft)] mb-1.5">
                  القسم
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white"
                >
                  {Object.entries(CATEGORY_LABELS).map(([k, l]) => (
                    <option key={k} value={k}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-soft)] mb-1.5">
                  المصدر
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm"
                  placeholder="واس، رويترز، ..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink-soft)] mb-1.5">
                  رابط الصورة
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 accent-[var(--breaking)]"
                  />
                  <span>عاجل 🔴</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent)]"
                  />
                  <span>مميز ⭐</span>
                </label>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="satr-card p-5">
                <h3 className="font-bold text-[var(--ink)] text-sm mb-3">
                  هاشتاقات
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t, i) => (
                    <span key={i} className="tag">#{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* أزرار الحفظ */}
            <div className="space-y-2 sticky top-32">
              <button
                onClick={() => handleSave(true)}
                disabled={!allValid || saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent)] text-white rounded-full font-bold hover:bg-[var(--accent-soft)] disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4" />
                نشر الآن
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 border border-[var(--border)] rounded-full font-semibold hover:bg-[var(--bg)] disabled:opacity-50 transition-all"
              >
                <Save className="w-4 h-4" />
                حفظ كمسودة
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function LineInput({
  label, value, onChange, count, valid, placeholder, color, weight, italic,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  count: number;
  valid: boolean;
  placeholder: string;
  color: string;
  weight: string;
  italic?: boolean;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-[var(--ink-soft)]">{label}</label>
        <span className={`text-xs font-bold ${valid ? 'text-green-600' : count > 0 ? 'text-amber-600' : 'text-[var(--ink-faint)]'}`}>
          {count} كلمة
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={placeholder}
        style={{ color, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal' }}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none text-base leading-relaxed transition-colors ${
          valid ? 'border-green-300 bg-green-50/30' : 'border-[var(--border)] focus:border-[var(--accent)]'
        }`}
      />
    </div>
  );
}
