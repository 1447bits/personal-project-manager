import type { Config } from 'drizzle-kit';

export default {
  schema: './app/db/schema.ts',
  out: './drizzle',
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.CA_CERT
    }
  }
} satisfies Config;