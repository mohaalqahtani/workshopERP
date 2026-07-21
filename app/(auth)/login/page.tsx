"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

// ── إحداثيات الورشة ──────────────────────────
// غيّرها لإحداثيات الورشة الحقيقية
const WORKSHOP_LAT = process.env.WORKSHOP_LAT  // خط العرض
const WORKSHOP_LNG = process.env.WORKSHOP_LNG  // خط الطول
const MAX_DISTANCE_METERS = 200
// ↑ نسمح للمستخدم يكون في دائرة 200 متر حول الورشة

// ── دالة حساب المسافة بين نقطتين ─────────────
function getDistanceInMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000
  // ↑ نصف قطر الأرض بالأمتار

  const toRad = (deg: number) => (deg * Math.PI) / 180
  // ↑ تحويل الدرجات لراديان (رياضيات)

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
  // ↑ المسافة بالأمتار
  // هذه معادلة Haversine — الأدق لحساب المسافة على سطح الأرض
}

// ── دالة جلب الموقع (Promise بدل Callback) ────
function getCurrentLocation(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    // ↑ نحوّل navigator.geolocation (callback) لـ Promise
    // عشان نقدر نستخدم await معها

    if (!navigator.geolocation) {
      reject(new Error("المتصفح لا يدعم تحديد الموقع"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      // ↑ نجح → نرجع الإحداثيات

      (err) => {
        // ↑ فشل → نرجع الخطأ المناسب
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error("رفضت إذن الموقع — يجب السماح به لتسجيل الدخول"))
            break
          case err.POSITION_UNAVAILABLE:
            reject(new Error("تعذّر تحديد موقعك حالياً"))
            break
          case err.TIMEOUT:
            reject(new Error("انتهت مهلة تحديد الموقع — حاول مجدداً"))
            break
          default:
            reject(new Error("حدث خطأ أثناء تحديد الموقع"))
        }
      },

      {
        enableHighAccuracy: true,
        // ↑ أعلى دقة ممكنة (GPS بدل WiFi)
        timeout: 10000,
        // ↑ انتظر 10 ثواني أقصى
        maximumAge: 0,
        // ↑ لا تستخدم موقع قديم محفوظ — جيب الموقع الآن
      }
    )
  })
}

// ── مكوّن صفحة تسجيل الدخول ──────────────────
export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [step, setStep]         = useState<"idle" | "location" | "login">("idle")
  // ↑ step يتتبع في أي مرحلة نحن:
  // idle     = بداية، لم يضغط بعد
  // location = جاري التحقق من الموقع
  // login    = جاري تسجيل الدخول

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {

      // ── المرحلة 1: جلب الموقع ──────────────
      setStep("location")
      // ↑ نحدّث الـ UI: "جاري التحقق من موقعك..."

      const coords = await getCurrentLocation()
      // ↑ ننتظر المستخدم يقبل إذن الموقع
      // لو رفض → getCurrentLocation يطلع error → يذهب لـ catch

      // ── المرحلة 2: التحقق من المسافة ────────
      const distance = getDistanceInMeters(
        coords.latitude,
        coords.longitude,
        WORKSHOP_LAT,
        WORKSHOP_LNG
      )
      // ↑ نحسب المسافة بين موقع المستخدم وموقع الورشة

      if (distance > MAX_DISTANCE_METERS) {
        // ↑ لو بعيد أكثر من 200 متر
        throw new Error(
          `أنت خارج نطاق الورشة — المسافة: ${Math.round(distance)} متر`
        )
      }
      // لو داخل النطاق → يكمل للخطوة التالية

      // ── المرحلة 3: تسجيل الدخول ─────────────
      setStep("login")
      // ↑ "جاري تسجيل الدخول..."

      const { error: authError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      })

      if (authError) {
        throw new Error(authError.message ?? "بيانات الدخول غير صحيحة")
      }

      router.push("/dashboard")
      // ↑ نجح كل شيء → توجيه للداشبورد

    } catch (err: any) {
      setError(err.message)
      // ↑ أي خطأ في أي مرحلة يصل هنا
    } finally {
      setLoading(false)
      setStep("idle")
      // ↑ دائماً نوقف التحميل حتى لو فشل
    }
  }

  // ── رسالة التحميل حسب المرحلة ───────────────
  function getLoadingText() {
    switch (step) {
      case "location": return "جاري التحقق من موقعك..."
      case "login":    return "جاري تسجيل الدخول..."
      default:         return "تسجيل الدخول"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">

        <h1 className="text-2xl font-bold text-center">تسجيل الدخول</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full p-2 border rounded-lg"
          />

          {/* رسالة الخطأ */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* مؤشر المرحلة */}
          {loading && (
            <div className="text-center text-sm text-muted-foreground">
              {step === "location" && "📍 جاري التحقق من موقعك..."}
              {step === "login"    && "🔐 جاري تسجيل الدخول..."}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? getLoadingText() : "تسجيل الدخول"}
          </button>

        </form>
      </div>
    </div>
  )
}

// Thx Claude :)