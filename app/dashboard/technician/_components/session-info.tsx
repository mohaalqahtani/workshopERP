// app/dashboard/technician/_components/session-info.tsx
"use client"
import { authClient } from "@/lib/auth-client"

export default function SessionInfo() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="p-6 text-sm text-muted-foreground animate-pulse">
        انتظر للتحميل
      </div>
    )
  }

  if (!session) {
    return (
      <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
        403 -- وصول غير مصرح به
      </div>
    )
  }

  return (
    <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
      <p>الاسم: {session.user.name}</p>
      <p>الإيميل: {session.user.email}</p>
      <p>المعرّف: {session.user.id}</p>
      <pre className="p-2 bg-black text-green-400 rounded text-xs overflow-auto">
        {JSON.stringify(session.user, null, 2)}
      </pre>
    </div>
  )
}