"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useSearchParams, useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleReset() {
    if (!token) {
      setMessage("الرابط غير صالح")
      return
    }

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage("تم تغيير كلمة المرور بنجاح")

    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  return (
    <div>
      <h1>تعيين كلمة المرور</h1>

      <input
        type="password"
        placeholder="كلمة المرور الجديدة"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleReset}>حفظ كلمة المرور</button>

      <p>{message}</p>
    </div>
  )
}
