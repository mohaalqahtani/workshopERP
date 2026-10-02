import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import StatusButton from "../../_components/status-button"
import AddpartsID from "../../_components/AddPartsDialog"
import AddServIDDialog from "../../_components/AddServID"
import DeleteServiceButton from "../../_components/DeleteServices"
import DeletePartButton from "../../_components/DeletePart"
import UploadPhoto from "../../_components/upload-photo"

type Props = {
  params: Promise<{ id: string }>
}

export default async function JobCardDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  const [jobCard, availableParts, availableServices] = await Promise.all([
    prisma.Job_Cards.findUnique({
      where: {
        id: parseInt(id),
        technician_id: session?.user.id,
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
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">بطاقة عمل #{jobCard.id}</h1>
        <StatusButton jobCardId={jobCard.id} currentStatus={jobCard.status} />
      </div>

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
                <DeletePartButton job_card_id={jobCard.id} part_id={part.id} />
              </tbody>
            ))}
          </table>
        )}
        <AddpartsID jobCardId={jobCard.id} availableParts={availableParts} />
      </section>

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
                <DeleteServiceButton
                  job_card_id={jobCard.id}
                  service_id={service.id}
                />
              </li>
            ))}
          </ul>
        )}
        <AddServIDDialog
          jobCardId={jobCard.id}
          availableServices={availableServices}
        />
      </section>

      <section className="space-y-2 rounded-lg border p-4">
        <h2 className="text-lg font-semibold">📷 صور الفحص</h2>
        <div className="grid grid-cols-2 gap-2">
          {jobCard.inspectionphotos.map((photo) => (
            <img
              key={photo.id}
              src={`/api/inspection-images/${photo.id}`}
              className="h-32 w-full rounded-lg object-cover"
            />
          ))}
        </div>
        <UploadPhoto
          jobCardId={jobCard.id}
          technicianId={session?.user.id ?? ""}
        />
      </section>
    </div>
  )
}
