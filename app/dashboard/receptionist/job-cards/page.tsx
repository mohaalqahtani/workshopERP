import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
const statusConfig = {
  Registered: { label: "مسجلة", color: "bg-gray-100 text-gray-700" },
  In_Inspection: { label: "قيد الفحص", color: "bg-yellow-100 text-yellow-700" },
  In_Progress: { label: "قيد العمل", color: "bg-blue-100 text-blue-700" },
  Ready: { label: "جاهزة", color: "bg-green-100 text-green-700" },
  Paid: { label: "تم الدفع", color: "bg-purple-100 text-purple-700" },
  Closed: { label: "مغلقة", color: "bg-red-100 text-red-700" },
}

export default async function ReceptionistJobCardsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return <p>غير مصرح</p>

  const jobCards = await prisma.job_Cards.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      vehicles: {
        include: {
          customer: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <div className="space-y-4 p-6" dir="rtl">
        <h1 className="text-2xl font-bold">بطاقات العمل </h1>
        <p className="text-muted-foreground">
          إجمالي البطاقات: {jobCards.length}
        </p>

        {jobCards.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            لا توجد بطاقات عمل حالياً
          </div>
        ) : (
          <ul className="space-y-3">
            {jobCards.map((card) => {
              const status = statusConfig[card.status]
              return (
                <li key={card.id}>
                  {/*
                  Link يوجّه للصفحة التفصيلية
                  /dashboard/technician/job-cards/5
                  ↑ رقم البطاقة يصير في الـ URL
                */}
                  <Link
                    href={`/dashboard/receptionist/job-cards/${card.id}`}
                    className="block rounded-lg border p-4 transition hover:bg-muted"
                  >
                    <div className="flex items-start justify-between">
                      {/* بيانات المركبة والزبون */}
                      <div>
                        <p className="font-bold">
                          🚗 {card.vehicles.brand} {card.vehicles.model}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {card.vehicles.plate_number}
                        </p>
                        <p className="text-sm">
                          👤 {card.vehicles.customer.name} —{" "}
                          {card.vehicles.customer.phone}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          بطاقة #{card.id} —{" "}
                          {card.createdAt.toLocaleDateString("ar-SA")}
                        </p>
                      </div>

                      {/* الحالة */}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
