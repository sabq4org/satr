# Changelog

كل التغييرات الملحوظة في مشروع سطر — موثّقة.

النسق يتبع [Keep a Changelog](https://keepachangelog.com/ar/).

---

## [0.2.0] — 2026-05-05 — "صحيفة حقيقية"

### ✨ مضاف

#### منصة القراءة
- **صفحة خبر مفردة** `/article/[id]` بتصميم رسمي + OG meta كامل
- **شريط العاجل** ديناميكي يدوّر آخر الأخبار العاجلة (24 ساعة)
- **Hero عملاق** للموجز المميز بتقسيم 50/50 صورة/نص
- **قسم الأكثر قراءة** (الترند) بترتيب رقمي
- **Reading Progress Bar** أعلى الصفحة في صفحات الأخبار
- **Share Bar عائم** (WhatsApp + X + نسخ + Web Share API + Like + Save)
- **DeepenInline** بتصميم محسّن مع skeleton loader

#### الميزة الإبداعية الكبرى: Stack View 🎴
- صفحة `/stack` بتصفّح Tinder-style
- Swipe gestures (drag للأعلى/الأسفل/الجانبين)
- اختصارات لوحة المفاتيح (↑↓ السهام، L للإعجاب، B للحفظ، X للتخطي)
- Animations سلسة بـ Framer Motion
- Progress bars + شاشة نهاية إحصائية
- معاينة 3 بطاقات متراكمة (Stack Effect)

#### لوحة التحرير
- **نظام Auth كامل**: password + JWT signed cookies + middleware
- صفحة تسجيل دخول `/admin/login` بتصميم مخصص
- زر تسجيل خروج في الـ Header
- **صفحة تعديل/حذف** `/admin/edit/[id]`
- مكوّن `ArticleEditor` موحّد للإنشاء والتعديل
- إدارة وسوم تفاعلية (إضافة/حذف بنقرة)
- معاينة صورة فورية + رابط مصدر

#### صفحات إضافية
- `/manifesto` — قاعدة الـ٣ بشكل توضيحي إبداعي
- `/about` — من نحن
- `/tag/[name]` — تصفّح الأخبار حسب الوسم
- `/feed.xml` — RSS feed كامل
- `/sitemap.xml` — ديناميكي
- `/robots.txt` — يحمي `/admin` و `/api`
- `/not-found` — صفحة 404 بهوية سطر

#### Production-Ready
- Favicon SVG + theme color (`#1a3a5e`)
- Meta tags كاملة (Open Graph + Twitter Card)
- preconnect/preload للخطوط
- Edge-safe middleware
- متغيرات بيئة موثّقة بالكامل

### 🔧 محسّن
- `ArticleCard` يصير قابل للنقر بالكامل (الرابط يغطي الكارد)
- `Header` ديناميكي بحسب حالة المصادقة
- زر "تصفّح بالكومة" بارز في الموجز

### 🛡️ الأمان
- Middleware يحمي `/admin/*` و POST/PUT/DELETE على `/api/articles*`
- HMAC-SHA256 للتوقيع
- timing-safe password comparison
- httpOnly + sameSite=lax cookies

### 📊 الإحصائيات
- **+15 ملف جديد** (صفحات + كومبوننتس + APIs)
- **21 مسار** كامل في التطبيق
- **0 أخطاء TypeScript**
- البناء النظيف يأخذ ~1.5 ثانية

---

## [0.1.0] — 2026-05-02 — "MVP"

### مضاف
- بنية Next.js 16 + React 19 + TypeScript + Tailwind v4
- Drizzle ORM + Neon PostgreSQL
- طبقة AI ثلاثية (Ollama + OpenAI + Mock)
- صفحة الموجز اليومي
- 7 صفحات أقسام
- ArticleCard بـ 3 أسطر
- محرر `/admin/new` مع AI summarize
- 10 أخبار تجريبية في seed
- توقيت عربي نسبي
