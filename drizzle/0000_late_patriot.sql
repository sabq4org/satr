CREATE TYPE "public"."category" AS ENUM('local', 'world', 'economy', 'sport', 'tech', 'culture', 'misc');--> statement-breakpoint
CREATE TYPE "public"."source_trust" AS ENUM('official', 'agency', 'partner');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'review', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"line1" text NOT NULL,
	"line2" text NOT NULL,
	"line3" text NOT NULL,
	"category" "category" DEFAULT 'local' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source" text,
	"source_trust" "source_trust" DEFAULT 'agency',
	"source_url" text,
	"image_url" text,
	"image_alt" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"is_breaking" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"expanded_content" text,
	"views" integer DEFAULT 0 NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"saves" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"editor_id" varchar(21)
);
--> statement-breakpoint
CREATE TABLE "saved_articles" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"article_id" varchar(21) NOT NULL,
	"saved_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"role" text DEFAULT 'editor' NOT NULL,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
