import { PrismaClient } from "@/lib/generated/prisma/client"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import { admin } from "better-auth/plugins"
import { resend } from "@/lib/resend"

// 1. إعداد اتصال PostgreSQL يدويًا
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// 2. تمرير الـ adapter إلى PrismaClient لحل مشكلة الـ Argument الإجباري
const client = new PrismaClient({ adapter })

export const auth = betterAuth({
  database: prismaAdapter(client, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: `${process.env.WORKSHOPNAME} <noreply@moham2ed.dev>`,
        to: user.email,
        subject: "تعيين كلمة المرور",
        html: `
          <h2>مرحبا ${user.name}</h2>
          <p>اضغط الرابط التالي لتعيين كلمة المرور:</p>
          <a href="${url}">
            تعيين كلمة المرور
          </a>
        `,
      })
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "TECHNICIAN",
        input: false,
      },
    },
  },

  plugins: [admin({ defaultRole: "TECHNICIAN" })],
})
