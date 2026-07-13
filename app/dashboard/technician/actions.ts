// app/dashboard/technician/actions.ts
"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Job_Cards_Status } from "@/lib/generated/prisma"

export async function updateJobCardStatus(
  jobCardId: number,
  newStatus: Job_Cards_Status
) {
  await prisma.Job_Cards.update({
    where: { id: jobCardId },
    data: { status: newStatus }
  })

  revalidatePath("/dashboard/technician")
}

export async function addPartToJobCard(data: {
  jobCardId: number
  partId: number
  quantity: number
  soldPrice: number
}) {
  await prisma.Job_Card_Parts.create({
    data: {
      job_card_id: data.jobCardId,
      part_id: data.partId,
      quantity: data.quantity,
      sold_price: data.soldPrice,
    }
  })
  revalidatePath(`/dashboard/technician/job-cards/${data.jobCardId}`)
}
export async function addServToJobCard(data: {
  jobCardId: number
  service_id: number
}) {
  await prisma.job_Card_Services.create({
    data: {
      job_card_id: data.jobCardId,
      service_id: data.service_id,
    }
  })
  revalidatePath(`/dashboard/technician/job-cards/${data.jobCardId}`)
}

export async function removeService({
  service_id,
  job_card_id,
}: {
  service_id: number
  job_card_id: number
}) {

  const service = await prisma.job_Card_Services.findUnique({
    where: {
      id: service_id,
    },
  })

  if (!service)
    throw new Error("الخدمة غير موجودة")

  if (service.job_card_id !== job_card_id)
    throw new Error("طلب غير صالح")

  await prisma.job_Card_Services.delete({
    where: {
      id: service_id,
    },
  })

  revalidatePath(`/dashboard/technician/job-cards/${job_card_id}`)
}