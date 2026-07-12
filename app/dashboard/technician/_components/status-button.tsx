// _components/status-button.tsx
"use client"
import { updateJobCardStatus } from "../actions"
import { Job_Cards_Status } from "@/lib/generated/prisma"
import { useTransition } from "react"

// الحالات بالترتيب المنطقي
const nextStatus: Record<Job_Cards_Status, Job_Cards_Status | null> = {
  Registered:    "In_Inspection",
  In_Inspection: "In_Progress",
  In_Progress:   "Ready",
  Ready:         "Paid",
  Paid:          "Closed",
  Closed:        null  // نهاية، ما فيه بعدها
}

const statusLabel: Record<Job_Cards_Status, string> = {
  Registered:    "تم التسجيل",
  In_Inspection: "قيد الفحص",
  In_Progress:   "قيد العمل",
  Ready:         "جاهزة",
  Paid:          "تم الدفع",
  Closed:        "مغلقة"
}

type Props = {
  jobCardId: number
  currentStatus: Job_Cards_Status
}

export default function StatusButton({ jobCardId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition()
  const next = nextStatus[currentStatus]

  // لو ما فيه حالة بعدها، ما نعرض الزر
  if (!next) return (
    <span className="text-xs text-muted-foreground">مغلقة</span>
  )

  function handleClick() {
    startTransition(() => updateJobCardStatus(jobCardId, next!))
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs bg-primary text-white px-3 py-1 rounded disabled:opacity-50"
    >
      {isPending ? "جاري التحديث..." : `نقل إلى: ${statusLabel[next]}`}
    </button>
  )
}