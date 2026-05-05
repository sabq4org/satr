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
  if (seconds < 3600) return `قبل ${Math.floor(seconds / 60)} دقيقة`;
  if (seconds < 7200) return 'قبل ساعة';
  if (seconds < 86400) return `قبل ${Math.floor(seconds / 3600)} ساعة`;
  if (seconds < 172800) return 'أمس';
  if (seconds < 604800) return `قبل ${Math.floor(seconds / 86400)} أيام`;
  if (seconds < 2592000) return `قبل ${Math.floor(seconds / 604800)} أسابيع`;
  return d.toLocaleDateString('ar-SA');
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
