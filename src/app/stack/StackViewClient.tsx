'use client';

import { useRouter } from 'next/navigation';
import StackView from '@/components/StackView';
import type { Article } from '@/lib/db/schema';

export default function StackViewClient({ articles }: { articles: Article[] }) {
  const router = useRouter();
  return <StackView articles={articles} onClose={() => router.push('/')} />;
}
