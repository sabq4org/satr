import type { Category } from './db/schema';

export const CATEGORY_LABELS: Record<Category, string> = {
  local: 'محلي',
  world: 'عالمي',
  economy: 'اقتصاد',
  sport: 'رياضة',
  tech: 'تقنية',
  culture: 'ثقافة وفن',
  misc: 'منوعات',
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  local: '🇸🇦',
  world: '🌍',
  economy: '📈',
  sport: '⚽️',
  tech: '💻',
  culture: '🎭',
  misc: '✨',
};

export const SOURCE_TRUST_LABELS = {
  official: { label: 'رسمي', icon: '🟢' },
  agency: { label: 'وكالة', icon: '🟡' },
  partner: { label: 'شريكة', icon: '🔵' },
} as const;

// التوقيت العربي النسبي
export function arabicTimeAgo(date: Date | string | null): string {
  if (!date) return 'الآن';
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  if (seconds < 60) return 'الآن';
  if (seconds < 120) return 'قبل دقيقة';
  if (seconds < 3600) return `قبل ${toArabicNum(Math.floor(seconds / 60))} دقيقة`;
  if (seconds < 7200) return 'قبل ساعة';
  if (seconds < 86400) return `قبل ${toArabicNum(Math.floor(seconds / 3600))} ساعة`;
  if (seconds < 172800) return 'أمس';
  if (seconds < 604800) return `قبل ${toArabicNum(Math.floor(seconds / 86400))} أيام`;
  if (seconds < 2592000) return `قبل ${toArabicNum(Math.floor(seconds / 604800))} أسابيع`;
  return d.toLocaleDateString('ar-SA');
}

// الأرقام بالصيغة الغربية (123) — قرار تصميمي
export function toArabicNum(n: number | string): string {
  return String(n);
}

// تحية حسب الوقت بالساعة المحلية
export function arabicGreeting(date: Date = new Date()): { greeting: string; period: string; emoji: string } {
  const h = date.getHours();
  if (h >= 5 && h < 12) return { greeting: 'صباح الخير', period: 'صباح', emoji: '☀️' };
  if (h >= 12 && h < 16) return { greeting: 'ظهيرة سعيدة', period: 'ظهر', emoji: '🌤' };
  if (h >= 16 && h < 19) return { greeting: 'عصر هادئ', period: 'عصر', emoji: '🌅' };
  if (h >= 19 && h < 22) return { greeting: 'مساء الخير', period: 'مساء', emoji: '🌙' };
  return { greeting: 'هدوء الليل', period: 'ليل', emoji: '🌙' };
}

// تقدير وقت القراءة لـ ٣ أسطر (10-15 ثانية تقريبية)
export function readTime(line1: string, line2: string, line3: string): number {
  const words = (line1 + ' ' + line2 + ' ' + line3).trim().split(/\s+/).length;
  // قارئ عربي متوسط: ~3 كلمات/ثانية
  const seconds = Math.max(8, Math.round(words / 3));
  return seconds;
}

// تنسيق وقت القراءة الكلي للموجز ("٣ دقائق")
export function totalReadTime(articleCount: number): string {
  const seconds = articleCount * 12; // ~12s/خبر
  if (seconds < 60) return `${toArabicNum(seconds)} ثانية`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${toArabicNum(minutes)} دقيقة`;
  const hours = Math.round(minutes / 60);
  return `${toArabicNum(hours)} ساعة`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
