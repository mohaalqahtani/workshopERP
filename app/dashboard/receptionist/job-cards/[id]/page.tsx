import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import StatusButton from "../../_components/status-button"

export default async function JobCardsDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  const [jobCard, availableParts, availableServices] = await Promise.all([
    prisma.job_Cards.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        vehicles: {
          include: { customer: true },
        },
        jobcardsparts: {
          include: { partId: true },
        },
        jobcardservices: {
          include: { serviceId: true },
        },
        inspectionphotos: true,
      },
    }),

    prisma.parts_Inventory.findMany({
      select: {
        id: true,
        name: true,
        base_price: true,
        stock_qty: true,
      },
    }),

    prisma.services_List.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        required_mechanics: true,
        price: true,
      },
    }),
  ])

  if (!jobCard) return notFound()

  return (
    <>
      <div className="space-y-6 p-6" dir="rtl">
        {/* ── رأس الصفحة ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">بطاقة عمل #{jobCard.id}</h1>
          <StatusButton jobCardId={jobCard.id} currentStatus={jobCard.status} />
        </div>

        {/* ── بيانات المركبة والزبون ── */}
        <section className="space-y-2 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">🚗 المركبة والزبون</h2>
          <p>
            {jobCard.vehicles.brand} {jobCard.vehicles.model} —{" "}
            {jobCard.vehicles.year_created}
          </p>
          <p>اللوحة: {jobCard.vehicles.plate_number}</p>
          <p>الزبون: {jobCard.vehicles.customer.name}</p>
          <p>الجوال: {jobCard.vehicles.customer.phone}</p>
        </section>

        {/* ── القطع المستخدمة ── */}
        <section className="space-y-2 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">🔧 القطع المستخدمة</h2>
          {jobCard.jobcardsparts.length === 0 ? (
            <p className="text-sm text-muted-foreground">لم تُضف قطع بعد</p>
          ) : (
            <table className="border-collapse space-y-1 border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-300">اسم القطعة</th>
                  <th className="border border-gray-300">سعر القطعة</th>
                  <th className="border border-gray-300">الاجمالي</th>
                </tr>
              </thead>
              {jobCard.jobcardsparts.map((part) => (
                <tbody key={part.id}>
                  <td className="border border-gray-300">
                    {part.partId.name} × {part.quantity}
                  </td>
                  <td className="border border-gray-300">
                    {part.sold_price.toString()} ر.س
                  </td>
                  <td className="border border-gray-300">
                    {Number(part.sold_price) * part.quantity} ر.س
                  </td>
                </tbody>
              ))}
            </table>
          )}
        </section>

        {/* ── الخدمات ── */}
        <section className="space-y-2 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">⚙️ الخدمات المنفذة</h2>
          {jobCard.jobcardservices.length === 0 ? (
            <p className="text-sm text-muted-foreground">لم تُضف خدمات بعد</p>
          ) : (
            <ul className="space-y-1">
              {jobCard.jobcardservices.map((service) => (
                <li key={service.id} className="flex justify-between text-sm">
                  <span>{service.serviceId.name}</span>
                  <span>{service.serviceId.price.toString()} ر.س</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">📷 صور الفحص</h2>

          {/* عرض الصور الموجودة */}
          <div className="grid grid-cols-2 gap-2">
            {jobCard.inspectionphotos.map((photo) => (
              <img
                key={photo.id}
                src={`/api/inspection-images/${photo.id}`}
                className="h-32 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
