"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Job_Cards_Status } from "@/lib/generated/prisma"
import { logAction } from "@/lib/log-action"

export async function updateJobCardStatus(
  jobCardId: number,
  newStatus: Job_Cards_Status
) {
  const old = await prisma.Job_Cards.findUnique({
    where: { id: jobCardId },
    select: { status: true },
  })

  await prisma.Job_Cards.update({
    where: { id: jobCardId },
    data: { status: newStatus },
  })

  // ✅
  logAction({
    action: "UPDATE_STATUS",
    entity: "Job_Cards",
    entity_id: jobCardId,
    details: { from: old?.status, to: newStatus },
  })

  revalidatePath("/dashboard/technician")
}

export async function addPartToJobCard(data: {
  jobCardId: number
  partId: number
  quantity: number
  soldPrice: number
}) {
  const record = await prisma.Job_Card_Parts.create({
    data: {
      job_card_id: data.jobCardId,
      part_id: data.partId,
      quantity: data.quantity,
      sold_price: data.soldPrice,
    },
  })

  // ✅
  logAction({
    action: "ADD_PART",
    entity: "Job_Card_Parts",
    entity_id: record.id,
    details: {
      jobCardId: data.jobCardId,
      partId: data.partId,
      quantity: data.quantity,
      price: data.soldPrice,
    },
  })

  revalidatePath(`/dashboard/technician/job-cards/${data.jobCardId}`)
}

export async function addServToJobCard(data: {
  jobCardId: number
  service_id: number
}) {
  const record = await prisma.job_Card_Services.create({
    data: { job_card_id: data.jobCardId, service_id: data.service_id },
  })

  // ✅
  logAction({
    action: "ADD_SERVICE",
    entity: "job_Card_Services",
    entity_id: record.id,
    details: { jobCardId: data.jobCardId, serviceId: data.service_id },
  })

  revalidatePath(`/dashboard/technician/job-cards/${data.jobCardId}`)
}

export async function removePart({
  job_card_id,
  part_id,
}: {
  job_card_id: number
  part_id: number
}) {
  const part = await prisma.job_Card_Parts.findUnique({
    where: { id: part_id },
  })
  if (!part) throw new Error("القطعة غير موجودة")
  if (part.job_card_id !== job_card_id) throw new Error("طلب غير صالح")

  await prisma.job_Card_Parts.delete({ where: { id: part_id } })

  // ✅
  logAction({
    action: "REMOVE_PART",
    entity: "Job_Card_Parts",
    entity_id: part_id,
    details: { job_card_id },
  })

  revalidatePath(`/dashboard/technician/job-cards/${job_card_id}`)
}

export async function removeService({
  service_id,
  job_card_id,
}: {
  service_id: number
  job_card_id: number
}) {
  const service = await prisma.job_Card_Services.findUnique({
    where: { id: service_id },
  })
  if (!service) throw new Error("الخدمة غير موجودة")
  if (service.job_card_id !== job_card_id) throw new Error("طلب غير صالح")

  await prisma.job_Card_Services.delete({ where: { id: service_id } })

  // ✅
  logAction({
    action: "REMOVE_SERVICE",
    entity: "job_Card_Services",
    entity_id: service_id,
    details: { job_card_id },
  })

  revalidatePath(`/dashboard/technician/job-cards/${job_card_id}`)
}

export async function saveInspectionPhoto(data: {
  jobCardId: number
  photoUrl: string
  uploadedBy: string
}) {
  await prisma.inspection_Photos.create({
    data: {
      job_card_id: data.jobCardId,
      photo_Url: data.photoUrl,
      uploaded_by: data.uploadedBy,
    },
  })

  // ✅
  logAction({
    action: "ADD_PHOTO",
    entity: "Inspection_Photos",
    entity_id: data.jobCardId,
    details: { jobCardId: data.jobCardId },
  })

  revalidatePath(`/dashboard/technician/job-cards/${data.jobCardId}`)
}
