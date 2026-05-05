import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// تحميل .env.local
config({ path: '.env.local' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://alialhazmi@localhost:5432/satr',
  },
} satisfies Config;
