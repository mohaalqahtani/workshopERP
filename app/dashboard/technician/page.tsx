// app/dashboard/technician/page.tsx
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import SessionInfo from "./_components/session-info"
import StatusButton from "./_components/status-button"
import Link from "next/link"

export default async function TechnicianPage() {

  // 1️⃣ جيب السيشن لنعرف مين الفني
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // 2️⃣ جيب البطاقات المخصصة لهذا الفني بحالة Registered فقط
  const jobCards = await prisma.Job_Cards.findMany({
    where: {
      technician_id: session?.user.id,
      // ↑ فقط بطاقاتي أنا
      status: "Registered",
      // ↑ فقط اللي وصلت من الاستقبال ولم يبدأ العمل عليها
      isDeleted: false,
    },
    include: {
      vehicles: {
        include: {
          customer: true
          // ↑ نجيب بيانات الزبون عبر المركبة
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-6">
      <SessionInfo name={session?.user.name ?? "فني"} />
      <Link href={"/dashboard/technician/job-cards"}>الوصول الى بطاقات المركبة</Link>
      {jobCards.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border rounded-lg mt-4">
          لا توجد مركبات جديدة في انتظارك
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {jobCards.map((card) => (
            <li key={card.id} className="p-4 border rounded-lg space-y-2">

              {/* بيانات الزبون */}
              <p className="font-bold">{card.vehicles.customer.name}</p>
              <p className="text-sm text-muted-foreground">
                {card.vehicles.customer.phone}
              </p>

              {/* بيانات المركبة */}
              <div className="pr-4 border-r-2 space-y-1">
                <p className="text-sm font-medium">
                  🚗 {card.vehicles.brand} {card.vehicles.model} — {card.vehicles.plate_number}
                </p>

                <div className="flex items-center gap-3 text-sm">
                  <span>بطاقة #{card.id}</span>
                  <span className="text-muted-foreground">{card.status}</span>
                  <StatusButton
                    jobCardId={card.id}
                    currentStatus={card.status}
                  />
                </div>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
  )
}