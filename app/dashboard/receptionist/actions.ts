"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ── البحث (ما يحتاج تعديل) ──────────────────────────────
export async function searchCustomer(query: string) {
  if (!query || query.length < 2) return null

  const customer = await prisma.Customers.findFirst({
    where: {
      OR: [
        { phone: { contains: query } },
        { vehicles: { some: { plate_number: { contains: query } } } }
      ]
    },
    include: { vehicles: true }
  })
  return customer
}

// ── الإنشاء (يحتاج تعديل) ───────────────────────────────
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

      // 1️⃣ الزبون — upsert بدل create
      const customer = await tx.Customers.upsert({
        where: { phone: formData.customerPhone },
        update: {},
        create: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || "",
        },
      })

      // 2️⃣ المركبة — نفس الكود
      const vehicle = await tx.Vehicles.create({
        data: {
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          year_created: parseInt(formData.vehicleYear),
          plate_number: formData.vehiclePlate,
          customerId: customer.id,
        },
      })

      // 3️⃣ اختيار فني عشوائي ← جديد
      const technicians = await tx.user.findMany({
        where: { role: "TECHNICIAN" },
        select: { id: true },
      })

      if (technicians.length === 0) {
        throw new Error("لا يوجد فنيون مسجلون في النظام")
      }

      const randomIndex = Math.floor(Math.random() * technicians.length)
      const assignedTechnician = technicians[randomIndex]

      // 4️⃣ إنشاء Job Card ← جديد
      const jobCard = await tx.Job_Cards.create({
        data: {
          vehicle_id: vehicle.id,
          technician_id: assignedTechnician.id,
          // status = Registered تلقائياً من الـ schema
          // total_price = 0 تلقائياً من الـ schema
        },
      })

      return { customer, vehicle, jobCard }
    })

    revalidatePath("/dashboard/receptionist")
    revalidatePath("/dashboard/technician/job-cards")

    return { success: true, data: result }

  } catch (error: any) {
    // لوحة مكررة
    if (error.code === "P2002") {
      return { success: false, error: "رقم اللوحة مسجل مسبقاً في النظام" }
    }
    return { success: false, error: error.message || "حدث خطأ غير متوقع" }
  }
}

// نشئ Job Card لمركبة موجودة مباشرة
export async function createJobCardForExistingVehicle(vehicleId: number) {
  try {
    const technicians = await prisma.user.findMany({
      where: { role: "TECHNICIAN" },
      select: { id: true }
    })

    if (technicians.length === 0) {
      return { success: false, error: "لا يوجد فنيون مسجلون" }
    }

    const randomIndex       = Math.floor(Math.random() * technicians.length)
    const assignedTechnician = technicians[randomIndex]

    const jobCard = await prisma.Job_Cards.create({
      data: {
        vehicle_id:    vehicleId,
        technician_id: assignedTechnician.id,
      }
    })

    revalidatePath("/dashboard/receptionist")
    revalidatePath("/dashboard/technician/job-cards")

    return { success: true, data: { jobCard } }

  } catch (error: any) {
    return { success: false, error: error.message }
  }
}