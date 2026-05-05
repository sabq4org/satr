'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/utils';
import type { Article, Category } from '@/lib/db/schema';

interface Props {
  mode: 'create' | 'edit';
  article?: Article;
}

export default function ArticleEditor({ mode, article }: Props) {
  const router = useRouter();
  const [rawText, setRawText] = useState('');
  const [line1, setLine1] = useState(article?.line1 || '');
  const [line2, setLine2] = useState(article?.line2 || '');
  const [line3, setLine3] = useState(article?.line3 || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState<Category>(article?.category || 'local');
  const [source, setSource] = useState(article?.source || '');
  const [sourceUrl, setSourceUrl] = useState(article?.sourceUrl || '');
  const [imageUrl, setImageUrl] = useState(article?.imageUrl || '');
  const [isBreaking, setIsBreaking] = useState(article?.isBreaking || false);
  const [isFeatured, setIsFeatured] = useState(article?.isFeatured || false);

  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
  const w1 = wordCount(line1);
  const w2 = wordCount(line2);
  const w3 = wordCount(line3);
  const v1 = w1 >= 8 && w1 <= 25;
  const v2 = w2 >= 8 && w2 <= 25;
  const v3 = w3 >= 5 && w3 <= 20;
  const allValid = v1 && v2 && v3 && Boolean(line1) && Boolean(line2) && Boolean(line3);

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
      if (Array.isArray(data.tags)) setTags(data.tags);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'فشل التلخيص');
    } finally {
      setAiLoading(false);
    }
  }

  function addTag() {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  }

  async function handleSave(publish: boolean) {
    if (!allValid) {
      setError('تأكد من الالتزام بقاعدة الأسطر الثلاثة');
      return;
    }
    setError(null);
    setSuccess(null);
    setSaving(true);

    const payload = {
      line1,
      line2,
      line3,
      tags,
      category,
      source: source || undefined,
      sourceUrl: sourceUrl || undefined,
      imageUrl: imageUrl || undefined,
      isBreaking,
      isFeatured,
      status: publish ? 'published' : article?.status === 'published' ? 'published' : 'draft',
    };

    try {
      const url = mode === 'create' ? '/api/articles' : `/api/articles/${article!.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الحفظ');

      setSuccess(mode === 'create' ? 'تم إنشاء الخبر بنجاح' : 'تم حفظ التغييرات');
      setTimeout(() => {
        if (mode === 'create' && data.article?.id) {
          router.push(`/admin/edit/${data.article.id}`);
        } else {
          router.refresh();
        }
      }, 800);
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!article) return;
    if (!confirm('متأكد من حذف هذا الخبر نهائياً؟')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${article.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('فشل الحذف');
      router.push('/admin');
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* العمود الأيمن - المحتوى */}
      <div className="space-y-5 order-2 lg:order-1">
        {/* رسائل */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* AI Quick Summarize - فقط في وضع إنشاء */}
        {mode === 'create' && (
          <div className="satr-card p-5">
            <h2 className="text-lg font-bold text-[var(--ink)] mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              لخّص بالذكاء
            </h2>
            <p className="text-sm text-[var(--ink-soft)] mb-3">
              ألصق النص الخام للخبر، وسيقوم الذكاء بتحويله إلى 3 أسطر فوراً.
            </p>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={5}
              placeholder="ألصق نص الخبر الخام هنا..."
              className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-xl focus:border-[var(--accent)] focus:outline-none text-sm resize-none"
            />
            <button
              onClick={handleAI}
              disabled={aiLoading || rawText.length < 30}
              className="mt-3 px-5 py-2.5 bg-[var(--accent)] text-white rounded-full font-bold text-sm hover:bg-[var(--accent-soft)] disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${aiLoading && 'animate-pulse'}`} />
              {aiLoading ? 'جاري التلخيص...' : 'لخّص بالذكاء'}
            </button>
          </div>
        )}

        {/* الأسطر الثلاثة */}
        <div className="satr-card p-5">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-4 flex items-center gap-2">
            الأسطر الثلاثة
            {allValid && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
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
            <h3 className="text-xs font-bold text-[var(--ink-soft)] uppercase tracking-wide mb-3 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
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
      <div className="space-y-5 order-1 lg:order-2">
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
                <option key={k} value={k}>
                  {l}
                </option>
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
              رابط المصدر
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm font-mono"
              placeholder="https://..."
              dir="ltr"
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
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm font-mono"
              placeholder="https://..."
              dir="ltr"
            />
            {imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-[var(--border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="w-full h-32 object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink-soft)] mb-1.5">
              وسوم
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg text-sm"
                placeholder="اضغط Enter لإضافة"
              />
              <button
                onClick={addTag}
                type="button"
                className="px-3 py-2 bg-[var(--accent-light)] text-[var(--accent)] rounded-lg text-sm font-bold hover:bg-[var(--accent)] hover:text-white transition-colors"
              >
                +
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 tag cursor-pointer"
                    onClick={() => setTags(tags.filter((x) => x !== t))}
                  >
                    #{t}
                    <X className="w-3 h-3" />
                  </span>
                ))}
              </div>
            )}
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

        {/* أزرار الحفظ */}
        <div className="space-y-2 lg:sticky lg:top-32">
          <button
            onClick={() => handleSave(true)}
            disabled={!allValid || saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent)] text-white rounded-full font-bold hover:bg-[var(--accent-soft)] disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
            {mode === 'create' ? 'نشر الآن' : 'حفظ ونشر'}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 border border-[var(--border)] rounded-full font-semibold hover:bg-[var(--bg)] disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {mode === 'create' ? 'حفظ كمسودة' : 'حفظ التعديلات'}
          </button>

          {mode === 'edit' && article && (
            <>
              <a
                href={`/article/${article.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 border border-[var(--border)] rounded-full font-semibold hover:bg-[var(--bg)] transition-all text-sm"
              >
                <Eye className="w-4 h-4" />
                معاينة في الموقع
              </a>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-red-600 hover:bg-red-50 rounded-full font-semibold transition-all text-sm"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? 'جاري الحذف...' : 'حذف نهائياً'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LineInput({
  label,
  value,
  onChange,
  count,
  valid,
  placeholder,
  color,
  weight,
  italic,
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
        <span
          className={`text-xs font-bold ${
            valid
              ? 'text-emerald-600'
              : count > 0
                ? 'text-amber-600'
                : 'text-[var(--ink-faint)]'
          }`}
        >
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
          valid
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-[var(--border)] focus:border-[var(--accent)]'
        }`}
      />
    </div>
  );
}
