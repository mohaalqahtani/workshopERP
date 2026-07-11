import { PrismaClient } from "@/lib/generated/prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. إعداد اتصال PostgreSQL يدويًا
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. تمرير الـ adapter إلى PrismaClient لحل مشكلة الـ Argument الإجباري
const client = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(client, { provider: "postgresql" }),
  baseURL: "http://localhost:3000/",
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "TECHNICIAN"
      }
    }
  }
});
