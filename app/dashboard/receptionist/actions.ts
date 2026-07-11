// app/dashboard/reception/actions.ts
"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCustomerWithVehicle(formData: {
  // بيانات العميل
  customerName: string
  customerPhone: string
  customerEmail?: string
  // بيانات المركبة
  vehiclePlate: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
}) {
  try {
    // استخدام $transaction لضمان حفظ الاثنين معاً أو فشل الاثنين معاً
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. إنشاء العميل أو البحث عنه إذا كان موجوداً مسبقاً (حسب منطق عملك)
      const customer = await tx.Customers.create({
        data: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || null,
        },
      })

      // 2. إنشاء المركبة وربطها بالعميل عبر الـ customerId
      const vehicle = await tx.Vehicles.create({
        data: {
          brand: formData.vehicleBrand,
          model: formData.vehicleModel,
          year_created: parseInt(formData.vehicleYear),
          plate_number: formData.vehiclePlate,
          customerId: customer.id, // الربط هنا (العلاقة)
        },
      })

      return { customer, vehicle }
    })

    // تحديث البيانات في الصفحة بعد الحفظ
    revalidatePath("/dashboard/reception")
    
    return { success: true, data: result }
  } catch (error) {
    console.error("حذث خطأ أثناء التسجيل:", error)
    return { success: false, error: "فشل تسجيل البيانات، يرجى التحقق من المدخلات" }
  }
}