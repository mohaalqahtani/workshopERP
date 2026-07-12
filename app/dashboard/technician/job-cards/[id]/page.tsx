// الـ [id] في الاسم = Next.js يعرف إن هذا dynamic route
// /job-cards/5 → id = "5"
// /job-cards/12 → id = "12"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import StatusButton from "../../_components/status-button"
import AddpartsID from "../[id]/addParts/page"
type Props = {
  params: Promise<{ id: string }>
  // ↑ Next.js يمرر الـ id من الـ URL هنا
}

export default async function JobCardDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  // جيب البطاقة بكل تفاصيلها
  const jobCard = await prisma.Job_Cards.findUnique({
    where: {
      id: parseInt(id),
      technician_id: session?.user.id,
      // ↑ أمان إضافي: لو حاول فني يفتح بطاقة مش له
    },
    include: {
      vehicles: {
        include: { customer: true }
      },
      jobcardsparts: {
        include: { partId: true }
        // ↑ القطع المضافة + بيانات كل قطعة
      },
      jobcardservices: {
        include: { serviceId: true }
        // ↑ الخدمات المضافة + بيانات كل خدمة
      },
      inspectionphotos: true
    }
  })

  // لو ما لقى البطاقة أو مش له → صفحة 404
  if (!jobCard) return notFound()

  return (
    <div className="p-6 space-y-6" dir="rtl">

      {/* ── رأس الصفحة ── */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">بطاقة عمل #{jobCard.id}</h1>
        <StatusButton jobCardId={jobCard.id} currentStatus={jobCard.status} />
      </div>

      {/* ── بيانات المركبة والزبون ── */}
      <section className="p-4 border rounded-lg space-y-2">
        <h2 className="font-semibold text-lg">🚗 المركبة والزبون</h2>
        <p>{jobCard.vehicles.brand} {jobCard.vehicles.model} — {jobCard.vehicles.year_created}</p>
        <p>اللوحة: {jobCard.vehicles.plate_number}</p>
        <p>الزبون: {jobCard.vehicles.customer.name}</p>
        <p>الجوال: {jobCard.vehicles.customer.phone}</p>
      </section>

      {/* ── القطع المستخدمة ── */}
      <section className="p-4 border rounded-lg space-y-2">
        <h2 className="font-semibold text-lg">🔧 القطع المستخدمة</h2>
        {jobCard.jobcardsparts.length === 0 ? (
          <p className="text-muted-foreground text-sm">لم تُضف قطع بعد</p>
        ) : (
          <ul className="space-y-1">
            {jobCard.jobcardsparts.map((part) => (
              <li key={part.id} className="text-sm flex justify-between">
                <span>{part.partId.name} × {part.quantity}</span>
                <span>{part.sold_price.toString()} ر.س</span>
              </li>
            ))}
          </ul>
        )}
        {/* هنا ستضيف لاحقاً: <AddPartForm jobCardId={jobCard.id} /> */}
    <AddpartsID/>
      </section>

      {/* ── الخدمات ── */}
      <section className="p-4 border rounded-lg space-y-2">
        <h2 className="font-semibold text-lg">⚙️ الخدمات المنفذة</h2>
        {jobCard.jobcardservices.length === 0 ? (
          <p className="text-muted-foreground text-sm">لم تُضف خدمات بعد</p>
        ) : (
          <ul className="space-y-1">
            {jobCard.jobcardservices.map((service) => (
              <li key={service.id} className="text-sm flex justify-between">
                <span>{service.serviceId.name}</span>
                <span>{service.serviceId.price.toString()} ر.س</span>
              </li>
            ))}
          </ul>
        )}
        {/* هنا ستضيف لاحقاً: <AddServiceForm jobCardId={jobCard.id} /> */}
      </section>

      {/* ── صور الفحص ── */}
      <section className="p-4 border rounded-lg space-y-2">
        <h2 className="font-semibold text-lg">📷 صور الفحص</h2>
        <div className="grid grid-cols-2 gap-2">
          {jobCard.inspectionphotos.map((photo) => (
            <img key={photo.id} src={photo.photo_Url} className="rounded-lg w-full h-32 object-cover" />
          ))}
        </div>
        {/* هنا ستضيف لاحقاً: <UploadPhotoButton jobCardId={jobCard.id} /> */}
      </section>

    </div>
  )
}