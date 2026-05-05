# 📰 سطر — الخبر زبدة

> صحيفة إلكترونية ذكية تقدم كل خبر في **3 أسطر فقط**. لا حشو، لا قشور.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

---

## 🧠 الفكرة

كل خبر يلتزم بـ **قاعدة الأسطر الثلاثة**:

- **السطر ١:** الحدث (15-20 كلمة) — ماذا، من، أين، متى
- **السطر ٢:** السياق (15-20 كلمة) — لماذا الآن، الخلفية، الربط
- **السطر ٣:** المعنى (10-15 كلمة) — التأثير، الدلالة، ماذا يعني للقارئ

ليس مجرد اختصار — بل **تحرير ذكي مكثف** يحوّل كل خبر إلى منتج تحريري كامل بحجم تغريدة.

---

## ✨ الميزات الرئيسية

### 📰 منصة قراءة
- ✅ **الموجز اليومي** — Hero ديناميكي + الأكثر قراءة + تتابع الأخبار
- ✅ **شريط العاجل** يدوّر آخر الأخبار العاجلة في آخر 24 ساعة
- ✅ **صفحة خبر مفردة** مع OG meta كامل ومشاركة عبر WhatsApp/X/نسخ
- ✅ **AI Deepen** — كل خبر يمكن توسعته بالذكاء (تخزين دائم بعد أول توليد)
- ✅ **Reading Progress Ring** أعلى الصفحة
- ✅ **7 أقسام** + صفحات وسوم `/tag/[name]`
- ✅ **Stack View** (الميزة المميزة) — تصفّح الأخبار بأسلوب Tinder swipe

### 🔐 لوحة تحرير محمية
- ✅ **Auth بسيط** بـ password + JWT cookie + middleware حماية
- ✅ **محرر ذكي** بعدّاد كلمات حي وتحقق فوري لقاعدة الـ٣
- ✅ **AI لخّص** — ألصق نص خام يطلع 3 أسطر + تاجز
- ✅ **معاينة لحظية** + معاينة في الموقع
- ✅ **تعديل/حذف** + نشر/مسودة
- ✅ **إعدادات تفصيلية**: مصدر، رابط، صورة، عاجل، مميز، تاجز

### 🤖 طبقة AI ثلاثية
- ✅ **Ollama** (محلي 100% — qwen2.5/gemma) — Default
- ✅ **OpenAI** (سحابي)
- ✅ **Mock** (احتياطي بدون شبكة)

### 🚀 جاهز للإنتاج
- ✅ **RSS feed** على `/feed.xml`
- ✅ **Sitemap.xml** ديناميكي
- ✅ **robots.txt** ذكي
- ✅ **OG Meta + Twitter Card** لكل خبر
- ✅ **404 page** مصممة بهوية سطر
- ✅ **PWA-ready** (favicon SVG + theme color)

---

## 🚀 البدء السريع

### المتطلبات
- Node.js 22+
- PostgreSQL محلي أو [Neon](https://neon.tech) (سحابي مجاني)
- (اختياري) Ollama للذكاء المحلي

### الإعداد

```bash
# 1. الحزم
npm install

# 2. متغيرات البيئة
cp .env.example .env.local
# عدّل القيم — على الأقل: DATABASE_URL و ADMIN_PASSWORD

# 3. تطبيق المخطط
npm run db:push

# 4. بذر 10 أخبار تجريبية
npm run db:seed

# 5. التشغيل
PORT=3007 npm run dev
```

افتح:
- **الموقع:** http://localhost:3007
- **لوحة التحرير:** http://localhost:3007/admin (كلمة السر من `.env.local`)

---

## 🤖 طبقة الذكاء الاصطناعي

### Ollama (محلي — موصى به)

```bash
# .env.local
AI_ENGINE=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:14b
```

**أداء مختبَر:** تلخيص 3 أسطر في ~3-5 ثوانٍ، توسعة AI في ~9 ثوانٍ.

### OpenAI (سحابي)

```bash
AI_ENGINE=openai
OPENAI_API_KEY=sk-...
```

### Mock (للأوفلاين الكامل)

```bash
USE_AI_MOCK=true
```

---

## 🗂 بنية المشروع

```
src/
├── app/
│   ├── page.tsx                  # الموجز اليومي
│   ├── article/[id]/page.tsx     # صفحة الخبر المفردة
│   ├── stack/                    # Stack View (Tinder-style)
│   ├── category/[slug]/          # صفحات الأقسام
│   ├── tag/[name]/               # صفحات الوسوم
│   ├── about/, manifesto/        # عن سطر + قاعدة الـ3
│   ├── admin/
│   │   ├── login/                # تسجيل الدخول
│   │   ├── new/                  # إضافة خبر
│   │   └── edit/[id]/            # تعديل/حذف
│   ├── api/
│   │   ├── articles/             # CRUD
│   │   ├── auth/                 # login/logout
│   │   └── ai/                   # summarize + deepen
│   ├── feed.xml/, sitemap.ts, robots.ts
│   └── not-found.tsx
├── components/
│   ├── Header, Footer, Logo
│   ├── ArticleCard, ArticleEditor
│   ├── HeroBreaking, LiveBar     # عناصر إبداعية
│   ├── StackView                  # المكوّن المميز
│   ├── ShareBar, ReadingProgress
│   └── DeepenInline
├── lib/
│   ├── auth.ts                    # JWT cookie + password
│   ├── ai/index.ts                # طبقة Ollama/OpenAI/Mock
│   ├── db/                        # Drizzle schema
│   └── utils.ts
└── middleware.ts                  # حماية /admin و /api
```

---

## 🎨 الهوية البصرية

- **الخط:** Tajawal
- **اللون الأساسي:** أزرق ليلي `#1a3a5e`
- **الخلفية:** كريم دافئ `#faf7f2`
- **العاجل:** أحمر `#c41e3a` بنبض حي
- **الفلسفة:** هدوء بصري + تركيز على المحتوى

---

## 📐 الأوامر

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | التشغيل (PORT=3007 موصى به) |
| `npm run build` | بناء الإنتاج |
| `npm run start` | تشغيل البناء |
| `npm run db:push` | تطبيق المخطط على DB |
| `npm run db:seed` | بذر بيانات تجريبية |
| `npm run db:studio` | فتح Drizzle Studio |

---

## 🔐 الأمان

- كلمات المرور **لا تُخزّن** — مقارنة مباشرة بـ `ADMIN_PASSWORD`
- جلسات موقّعة بـ HMAC-SHA256 (`AUTH_SECRET`)
- Cookies: `httpOnly`, `sameSite=lax`, `secure` في الإنتاج
- Middleware يحمي `/admin/*` و `POST /api/articles*`
- صلاحية الجلسة 30 يوم

**في الإنتاج:** غيّر `ADMIN_PASSWORD` و `AUTH_SECRET` لقيم قوية.

---

## 🌐 النشر

### Vercel (موصى به)
1. اربط الريبو
2. أضف متغيرات البيئة:
   - `DATABASE_URL` (Neon)
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET` (string عشوائي طويل)
   - `AI_ENGINE=openai` + `OPENAI_API_KEY` (Ollama لا يعمل في الإنتاج)
   - `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
3. Deploy.

---

## 📜 الترخيص

MIT — لاستخدام المطورين والصحفيين والطلاب.

---

## 👤 المؤلف

سطر — تجربة إعلامية صنعها [علي الحازمي](https://x.com/Ali4Alhazmi) (أبو محمد) و🧠 صُحبة.

> **كل خبر في 3 أسطر. لا أكثر.**
