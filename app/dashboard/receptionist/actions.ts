"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { logAction } from "@/lib/log-action"

export async function searchCustomer(query: string) {
  if (!query || query.length < 2) return null
  const customer = await prisma.Customers.findFirst({
    where: {
      OR: [
        { phone: { contains: query } },
        { vehicles: { some: { plate_number: { contains: query } } } },
      ],
    },
    include: { vehicles: true },
  })
  return customer
}

export async function createCustomerWithVehicle(formData: {
  customerName: string
  customerPhone: string
  customerEmail?: string
  vehiclePlate: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.Customers.upsert({
        where: { phone: formData.customerPhone },
        update: {},
        create: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || "",
        },
      })

      const vehicle = await tx.Vehicles.create({
        data: {
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          year_created: parseInt(formData.vehicleYear),
          plate_number: formData.vehiclePlate,
          customerId: customer.id,
        },
      })

      const technicians = await tx.user.findMany({
        where: { role: "TECHNICIAN" },
        select: { id: true },
      })

      if (technicians.length === 0)
        throw new Error("لا يوجد فنيون مسجلون في النظام")

      const assignedTechnician =
        technicians[Math.floor(Math.random() * technicians.length)]

      const jobCard = await tx.Job_Cards.create({
        data: {
          vehicle_id: vehicle.id,
          technician_id: assignedTechnician.id,
        },
      })

      return { customer, vehicle, jobCard }
    })

    logAction({
      action: "CREATE_JOB_CARD",
      entity: "Job_Cards",
      entity_id: result.jobCard.id,
      details: {
        customerId: result.customer.id,
        vehicleId: result.vehicle.id,
        plate: formData.vehiclePlate,
      },
    })

    revalidatePath("/dashboard/receptionist")
    revalidatePath("/dashboard/technician/job-cards")
    return { success: true, data: result }
  } catch (error: any) {
    if (error.code === "P2002")
      return { success: false, error: "رقم اللوحة مسجل مسبقاً في النظام" }
    return { success: false, error: error.message || "حدث خطأ غير متوقع" }
  }
}

export async function createJobCardForExistingVehicle(vehicleId: number) {
  try {
    const technicians = await prisma.user.findMany({
      where: { role: "TECHNICIAN" },
      select: { id: true },
    })

    if (technicians.length === 0)
      return { success: false, error: "لا يوجد فنيون مسجلون" }

    const assignedTechnician =
      technicians[Math.floor(Math.random() * technicians.length)]

    const jobCard = await prisma.Job_Cards.create({
      data: { vehicle_id: vehicleId, technician_id: assignedTechnician.id },
    })

    // ✅
    logAction({
      action: "CREATE_JOB_CARD",
      entity: "Job_Cards",
      entity_id: jobCard.id,
      details: { vehicleId },
    })

    revalidatePath("/dashboard/receptionist")
    revalidatePath("/dashboard/technician/job-cards")
    return { success: true, data: { jobCard } }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
