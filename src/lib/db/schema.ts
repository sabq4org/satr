import { pgTable, text, timestamp, varchar, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

// التصنيفات
export const categoryEnum = pgEnum('category', [
  'local',     // محلي
  'world',     // عالمي
  'economy',   // اقتصاد
  'sport',     // رياضة
  'tech',      // تقنية
  'culture',   // ثقافة وفن
  'misc',      // منوعات
]);

// مستوى الثقة بالمصدر
export const sourceTrustEnum = pgEnum('source_trust', [
  'official',   // 🟢 رسمي
  'agency',     // 🟡 وكالة
  'partner',    // 🔵 صحيفة شريكة
]);

// حالة الخبر
export const statusEnum = pgEnum('status', [
  'draft',     // مسودة
  'review',    // قيد المراجعة
  'published', // منشور
  'archived',  // مؤرشف
]);

// جدول الأخبار
export const articles = pgTable('articles', {
  id: varchar('id', { length: 21 }).primaryKey().$defaultFn(() => nanoid()),

  // الأسطر الثلاثة (القانون الذهبي)
  line1: text('line1').notNull(), // الحدث
  line2: text('line2').notNull(), // السياق
  line3: text('line3').notNull(), // المعنى

  // الميتاداتا
  category: categoryEnum('category').notNull().default('local'),
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  source: text('source'),
  sourceTrust: sourceTrustEnum('source_trust').default('agency'),
  sourceUrl: text('source_url'),

  // الميديا
  imageUrl: text('image_url'),
  imageAlt: text('image_alt'),

  // الحالة
  status: statusEnum('status').notNull().default('draft'),
  isBreaking: boolean('is_breaking').default(false).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),

  // محتوى موسّع (AI Deepen)
  expandedContent: text('expanded_content'),

  // إحصاءات
  views: integer('views').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  saves: integer('saves').default(0).notNull(),

  // التواريخ
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // المحرر
  editorId: varchar('editor_id', { length: 21 }),
});

// جدول المحررين/المستخدمين
export const users = pgTable('users', {
  id: varchar('id', { length: 21 }).primaryKey().$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  email: text('email').unique(),
  role: text('role').default('editor').notNull(), // admin | editor | reader
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// جدول الحفظ (قائمة القراءة)
export const savedArticles = pgTable('saved_articles', {
  id: varchar('id', { length: 21 }).primaryKey().$defaultFn(() => nanoid()),
  userId: varchar('user_id', { length: 21 }).notNull(),
  articleId: varchar('article_id', { length: 21 }).notNull(),
  savedAt: timestamp('saved_at').defaultNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Category = Article['category'];
