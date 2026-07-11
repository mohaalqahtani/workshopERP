"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail]       = useState("")
    const [password, setPassword] = useState("")
    const [error, setError]       = useState("")
    const [loading, setLoading]   = useState(false)

    // ✅ التنفيذ فقط عند الضغط على الزر
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name: "mohammed",
            callbackURL: "/dashboard",
        })

        setLoading(false)

        if (error) {
            setError(error.message ?? "حدث خطأ أثناء تسجيل الدخول")
            return
        }

        router.push("/dashboard")
    }

    return (
        <div>
            <h1>Login Page</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {/* ✅ عرض الخطأ للمستخدم */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "جاري التحميل..." : "تسجيل الدخول"}
                </button>
            </form>
        </div>
    )
}