'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="p-2 text-[var(--ink-soft)] hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
      aria-label="تسجيل خروج"
      title="تسجيل خروج"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
