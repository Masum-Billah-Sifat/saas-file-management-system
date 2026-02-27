// import dotenv from "dotenv";
// dotenv.config();

// function required(key: string): string {
//   const v = process.env[key];
//   if (!v) throw new Error(`Missing required env var: ${key}`);
//   return v;
// }

// export const env = {
//   PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
//   DATABASE_URL: required("DATABASE_URL"),
//   SUPABASE_URL: required("SUPABASE_URL"),
//   SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
//   SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || "uploads",
// };

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

  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",

  APP_BASE_URL: process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 4000}`,
};