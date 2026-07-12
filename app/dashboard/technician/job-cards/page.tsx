// Server Component — يجيب فقط بطاقات هذا الفني
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"

// ألوان الحالات للعرض
const statusConfig = {
  Registered:    { label: "مسجلة",        color: "bg-gray-100 text-gray-700" },
  In_Inspection: { label: "قيد الفحص",    color: "bg-yellow-100 text-yellow-700" },
  In_Progress:   { label: "قيد العمل",    color: "bg-blue-100 text-blue-700" },
  Ready:         { label: "جاهزة",        color: "bg-green-100 text-green-700" },
  Paid:          { label: "تم الدفع",     color: "bg-purple-100 text-purple-700" },
  Closed:        { label: "مغلقة",        color: "bg-red-100 text-red-700" },
}

export default async function TechnicianJobCardsPage() {

  // 1️⃣ جيب السيشن لنعرف مين الفني الحالي
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) return <p>غير مصرح</p>

  // 2️⃣ جيب فقط البطاقات المخصصة لهذا الفني
  const jobCards = await prisma.Job_Cards.findMany({
    where: {
      technician_id: session.user.id,
      // ↑ هذا هو الفلتر الأساسي — فقط بطاقاتي
      isDeleted: false,
    },
    include: {
      vehicles: {
        include: {
          customer: true
          // ↑ نجيب بيانات الزبون مع المركبة
        }
      }
    },
    orderBy: { createdAt: "desc" }
    // ↑ الأحدث أولاً
  })

  return (
    <div className="p-6 space-y-4" dir="rtl">
      <h1 className="text-2xl font-bold">بطاقات العمل المخصصة لي</h1>
      <p className="text-muted-foreground">
        إجمالي البطاقات: {jobCards.length}
      </p>

      {jobCards.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border rounded-lg">
          لا توجد بطاقات عمل مخصصة لك حالياً
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
                  href={`/dashboard/technician/job-cards/${card.id}`}
                  className="block p-4 border rounded-lg hover:bg-muted transition"
                >
                  <div className="flex justify-between items-start">

                    {/* بيانات المركبة والزبون */}
                    <div>
                      <p className="font-bold">
                        🚗 {card.vehicles.brand} {card.vehicles.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {card.vehicles.plate_number}
                      </p>
                      <p className="text-sm">
                        👤 {card.vehicles.customer.name} — {card.vehicles.customer.phone}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        بطاقة #{card.id} — {card.createdAt.toLocaleDateString("ar-SA")}
                      </p>
                    </div>

                    {/* الحالة */}
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.color}`}>
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
  )
}