'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Heart,
  Bookmark,
  X,
  Sparkles,
  Eye,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import type { Article } from '@/lib/db/schema';
import { CATEGORY_LABELS, SOURCE_TRUST_LABELS, arabicTimeAgo, cn } from '@/lib/utils';

interface Props {
  articles: Article[];
  initialIndex?: number;
  onClose?: () => void;
}

export default function StackView({ articles, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [actions, setActions] = useState<Record<string, 'liked' | 'saved' | 'skip' | undefined>>(
    {},
  );
  const total = articles.length;

  function next() {
    setIndex((i) => Math.min(total, i + 1));
  }
  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function handleAction(action: 'liked' | 'saved' | 'skip') {
    const article = articles[index];
    if (article) setActions((p) => ({ ...p, [article.id]: action }));
    next();
  }

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'h' || e.key === 'l') {
        handleAction('liked');
      } else if (e.key === 'b' || e.key === 's') {
        handleAction('saved');
      } else if (e.key === 'x') {
        handleAction('skip');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (total === 0) return null;

  if (index >= total) {
    return <EndScreen onRestart={() => setIndex(0)} actions={actions} articles={articles} onClose={onClose} />;
  }

  // اعرض البطاقة الحالية + خلفها بطاقة (للعمق)
  const current = articles[index];
  const behind = articles[index + 1];

  return (
    <div className="fixed inset-0 z-[80] bg-gradient-to-br from-[var(--accent)] via-[#0d2440] to-[#1a3a5e] overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-30 px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="إغلاق"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5 text-white/70 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>
            {index + 1} / {total}
          </span>
        </div>
      </div>

      {/* Progress bars */}
      <div className="absolute top-16 inset-x-0 px-4 z-20 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full bg-white transition-all duration-300',
                i < index ? 'w-full' : i === index ? 'w-full' : 'w-0',
              )}
            />
          </div>
        ))}
      </div>

      {/* منطقة البطاقات */}
      <div className="absolute inset-0 pt-20 pb-36 px-4 flex items-center justify-center">
        <div className="relative w-full max-w-md h-full max-h-[640px]">
          {/* بطاقة الخلف (ثابتة، بدون animations مزعجة) */}
          {behind && (
            <div
              className="absolute inset-0 satr-card overflow-hidden pointer-events-none"
              style={{
                transform: 'translateY(10px) scale(0.96)',
                opacity: 0.6,
                zIndex: 1,
              }}
            >
              <div className="h-full bg-[var(--paper)]" />
            </div>
          )}

          {/* البطاقة الحالية - تدخل من تحت، تخرج لفوق */}
          <AnimatePresence mode="popLayout">
            <SwipeCard
              key={current.id}
              article={current}
              onSwipeUp={next}
              onSwipeDown={prev}
              onLike={() => handleAction('liked')}
              onSave={() => handleAction('saved')}
              onSkip={() => handleAction('skip')}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* الأزرار السفلية */}
      <div className="absolute bottom-0 inset-x-0 z-30 pb-7 pt-3 px-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
        <div className="flex items-center justify-center gap-4 mb-2">
          <ActionButton
            onClick={() => handleAction('skip')}
            color="bg-white/15 hover:bg-white/25"
            icon={<X className="w-5 h-5" />}
            label="تخطي"
          />
          <ActionButton
            onClick={() => handleAction('liked')}
            color="bg-rose-500 hover:bg-rose-600"
            icon={<Heart className="w-6 h-6 fill-current" />}
            label="إعجاب"
            big
          />
          <ActionButton
            onClick={() => handleAction('saved')}
            color="bg-amber-400 hover:bg-amber-500 text-[#1a3a5e]"
            icon={<Bookmark className="w-5 h-5 fill-current" />}
            label="حفظ"
          />
        </div>
        <p className="text-center text-[10px] text-white/50">
          اسحب للأعلى للتالي • اسحب للأسفل للسابق • Esc للخروج
        </p>
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  color,
  icon,
  label,
  big,
}: {
  onClick: () => void;
  color: string;
  icon: React.ReactNode;
  label: string;
  big?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95',
        color,
        big ? 'w-16 h-16' : 'w-12 h-12',
      )}
      aria-label={label}
    >
      {icon}
    </button>
  );
}

function SwipeCard({
  article,
  onSwipeUp,
  onSwipeDown,
  onLike,
  onSave,
  onSkip,
}: {
  article: Article;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onLike: () => void;
  onSave: () => void;
  onSkip: () => void;
}) {
  const [showDeepen, setShowDeepen] = useState(false);
  const [deepenContent, setDeepenContent] = useState<string[] | null>(null);
  const [deepening, setDeepening] = useState(false);
  const [deepenError, setDeepenError] = useState<string | null>(null);
  const trust = article.sourceTrust ? SOURCE_TRUST_LABELS[article.sourceTrust] : null;

  async function handleDeepen() {
    setShowDeepen(true);
    if (deepenContent) return;
    setDeepening(true);
    setDeepenError(null);
    try {
      const res = await fetch(`/api/articles/${article.id}/deepen`, { method: 'POST' });
      if (!res.ok) throw new Error('فشل التوسعة');
      const data = await res.json();
      setDeepenContent(data.paragraphs || []);
    } catch (e) {
      setDeepenError((e as Error).message);
    } finally {
      setDeepening(false);
    }
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    const T = 100;
    if (info.offset.y < -T || info.velocity.y < -500) onSwipeUp();
    else if (info.offset.y > T || info.velocity.y > 500) onSwipeDown();
    else if (info.offset.x < -T) onSkip();
    else if (info.offset.x > T) onLike();
  }

  // هل في صورة؟
  const hasImage = Boolean(article.imageUrl);

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.5}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -300, scale: 0.85, transition: { duration: 0.22 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 32, mass: 0.8 }}
      className="absolute inset-0 satr-card overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
      style={{ zIndex: 10 }}
    >
      {/* الترويسة - شارات + قسم */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`cat-badge cat-${article.category}`}>
            {CATEGORY_LABELS[article.category]}
          </span>
          {article.isBreaking && <span className="breaking-badge">عاجل</span>}
        </div>
        <span className="text-[10px] text-[var(--ink-faint)]">
          {arabicTimeAgo(article.publishedAt || article.createdAt)}
        </span>
      </div>

      {/* الصورة - حجم محدود */}
      {hasImage && (
        <div className="flex-shrink-0 relative h-40 mx-5 rounded-xl overflow-hidden bg-[var(--accent-light)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl!}
            alt={article.imageAlt || article.line1}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      )}

      {/* المحتوى - يأخذ كل المساحة المتبقية */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-5 py-4 overscroll-contain"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* الأسطر الثلاثة */}
        <div className="space-y-3.5 mb-4">
          <div className="relative pr-9">
            <span className="absolute right-0 top-0 w-7 h-7 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-black flex items-center justify-center">
              ١
            </span>
            <p className="text-[17px] font-black leading-[1.7] text-[var(--ink)]">
              {article.line1}
            </p>
          </div>
          <div className="relative pr-9">
            <span className="absolute right-0 top-0 w-7 h-7 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-black flex items-center justify-center">
              ٢
            </span>
            <p className="text-[15px] font-medium leading-[1.7] text-[var(--ink-soft)]">
              {article.line2}
            </p>
          </div>
          <div className="relative pr-9">
            <span className="absolute right-0 top-0 w-7 h-7 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-xs font-black flex items-center justify-center">
              ٣
            </span>
            <p className="text-[15px] font-bold italic leading-[1.7] text-[var(--accent)]">
              {article.line3}
            </p>
          </div>
        </div>

        {/* Deepen */}
        {showDeepen && (
          <div className="mb-3 p-4 rounded-xl bg-[var(--accent-light)]/40 border border-[var(--accent-light)]">
            {deepening ? (
              <div className="flex items-center gap-2 text-sm text-[var(--accent)]">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>جاري التوسعة...</span>
              </div>
            ) : deepenError ? (
              <p className="text-sm text-rose-600">⚠ {deepenError}</p>
            ) : (
              <div className="space-y-2 text-[13px] leading-relaxed text-[var(--ink)]">
                {deepenContent?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* الفوتر - ثابت في الأسفل */}
      <div className="flex-shrink-0 px-5 py-3 border-t border-[var(--border)] flex items-center justify-between gap-2 bg-[var(--paper)]">
        <div className="flex items-center gap-1.5 text-[var(--ink-faint)]">
          {trust && <span className="text-xs" title={trust.label}>{trust.icon}</span>}
        </div>
        <div className="flex items-center gap-2">
          {!showDeepen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeepen();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-[var(--accent)] bg-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              <Sparkles className="w-3 h-3" />
              وضّح
            </button>
          )}
          <Link
            href={`/article/${article.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-[var(--ink-soft)] bg-[var(--bg)] hover:bg-[var(--accent-light)] transition-all"
          >
            <Eye className="w-3 h-3" />
            تابع
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function EndScreen({
  onRestart,
  actions,
  articles,
  onClose,
}: {
  onRestart: () => void;
  actions: Record<string, string | undefined>;
  articles: Article[];
  onClose?: () => void;
}) {
  const liked = articles.filter((a) => actions[a.id] === 'liked');
  const saved = articles.filter((a) => actions[a.id] === 'saved');

  return (
    <div className="fixed inset-0 z-[80] bg-gradient-to-br from-[var(--accent)] via-[#0d2440] to-[#1a3a5e] flex items-center justify-center p-6">
      <div className="text-center text-white max-w-sm">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
          <Layers className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black mb-3">تمت قراءة الموجز ✨</h2>
        <p className="text-white/70 mb-6 leading-relaxed">
          خلصت الـ {articles.length} خبر اللي عندنا اليوم.
          {(liked.length > 0 || saved.length > 0) && (
            <>
              {' '}
              <br />
              {liked.length > 0 && `أعجبك ${liked.length}`}
              {liked.length > 0 && saved.length > 0 && '، '}
              {saved.length > 0 && `حفظت ${saved.length}`}.
            </>
          )}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-white text-[var(--accent)] rounded-full font-bold hover:bg-white/90 transition-all"
          >
            أعد المراجعة
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold hover:bg-white/20 transition-all"
          >
            رجوع للموجز
          </button>
        </div>
      </div>
    </div>
  );
}
