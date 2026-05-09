'use client';

import { useEffect, useState } from 'react';

export default function HeaderScrollWrapper({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 10);
      // إخفاء عند التمرير لأسفل، إظهار عند التمرير لأعلى
      if (y > lastY && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastY(y);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  return (
    <div
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'shadow-[0_2px_16px_rgba(139,26,43,0.12)]' : '',
        hidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
