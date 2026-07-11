// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth" // استيراد ملف الأوث الرئيسي الخاص بالسيرفر لنسخ الأنواع تلقائياً

export const authClient = createAuthClient({
    plugins: [
        // هذه الإضافة تقوم بنسخ وتمرير كل الحقول الإضافية (مثل role) من السيرفر إلى العميل تلقائياً وبأمان تام مع التايب سكريبت
        inferAdditionalFields<typeof auth>()
    ]
})