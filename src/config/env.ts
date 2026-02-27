import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  DATABASE_URL: required("DATABASE_URL"),
  SUPABASE_URL: required("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || "uploads",
};