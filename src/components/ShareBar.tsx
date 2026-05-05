'use client';

import { useState } from 'react';
import { Share2, Link2, Check, Heart, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  articleId: string;
  url: string;
  text: string;
  title: string;
}

export default function ShareBar({ articleId, url, text, title }: Props) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  const shareText = `${text}\n\n— من سطر`;

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleNativeShare() {
    if (navigator.share) {
      navigator
        .share({ title, text: shareText, url: fullUrl })
        .catch(() => {});
    } else {
      handleCopy();
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${fullUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`;

  return (
    <div className="sticky bottom-4 mt-8 mx-auto max-w-md z-30">
      <div className="bg-[var(--paper)]/95 backdrop-blur-md border border-[var(--border)] rounded-full shadow-lg p-1.5 flex items-center justify-between gap-1">
        {/* Like */}
        <button
          onClick={() => setLiked(!liked)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all',
            liked
              ? 'bg-red-50 text-red-500'
              : 'text-[var(--ink-soft)] hover:bg-[var(--accent-light)]',
          )}
          aria-label="إعجاب"
        >
          <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
          <span className="hidden sm:inline">إعجاب</span>
        </button>

        {/* Save */}
        <button
          onClick={() => setSaved(!saved)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all',
            saved
              ? 'bg-[var(--accent-light)] text-[var(--accent)]'
              : 'text-[var(--ink-soft)] hover:bg-[var(--accent-light)]',
          )}
          aria-label="حفظ"
        >
          <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
          <span className="hidden sm:inline">حفظ</span>
        </button>

        <div className="w-px h-6 bg-[var(--border)]" />

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 rounded-full text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
          aria-label="مشاركة عبر واتساب"
          title="واتساب"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>

        {/* Twitter/X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--ink-soft)] hover:bg-[var(--accent-light)] transition-colors"
          aria-label="مشاركة على X"
          title="X (تويتر)"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center w-9 h-9 rounded-full text-[var(--ink-soft)] hover:bg-[var(--accent-light)] transition-colors"
          aria-label="نسخ الرابط"
          title="نسخ الرابط"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </button>

        {/* Native share */}
        <button
          onClick={handleNativeShare}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-soft)] transition-colors"
          aria-label="مشاركة"
          title="مشاركة"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
