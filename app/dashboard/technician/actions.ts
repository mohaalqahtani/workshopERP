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

export async function getAvaParts(
  name: string,
  image_url: string,
) {
  const data = await prisma.parts_Inventory.findMany()
  return data;
}