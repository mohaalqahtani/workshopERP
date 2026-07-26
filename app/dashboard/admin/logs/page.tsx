import prisma from "@/lib/prisma"

const LABELS: Record<string, { ar: string; color: string }> = {
  ADD_PART: { ar: "إضافة قطعة", color: "bg-blue-100 text-blue-700" },
  REMOVE_PART: { ar: "حذف قطعة", color: "bg-red-100 text-red-700" },
  ADD_SERVICE: { ar: "إضافة خدمة", color: "bg-green-100 text-green-700" },
  REMOVE_SERVICE: { ar: "حذف خدمة", color: "bg-red-100 text-red-700" },
  UPDATE_STATUS: { ar: "تحديث الحالة", color: "bg-yellow-100 text-yellow-700" },
  CREATE_JOB_CARD: {
    ar: "فتح بطاقة عمل",
    color: "bg-purple-100 text-purple-700",
  },
  CREATE_CUSTOMER: {
    ar: "تسجيل عميل جديد",
    color: "bg-gray-100 text-gray-700",
  },
}

export default async function SystemLogsPage() {
  const logs = await prisma.system_Logs.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, role: true } } },
  })

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6" dir="rtl">
      <h1 className="text-2xl font-bold">سجل العمليات</h1>
      <div className="space-y-2">
        {logs.map((log) => {
          const label = LABELS[log.action]
          return (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${label?.color ?? "bg-gray-100 text-gray-600"}`}
                >
                  {label?.ar ?? log.action}
                </span>
                <span className="text-sm font-medium">{log.user_id}</span>
                <span className="text-sm font-medium">{log.user.name}</span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                  {log.user.role}
                </span>
                {log.entity_id && (
                  <span className="text-xs text-gray-400">
                    #{log.entity_id}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {new Date(log.createdAt).toLocaleString("ar-SA")}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
