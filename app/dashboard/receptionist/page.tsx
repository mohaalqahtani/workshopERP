// app/dashboard/reception/page.tsx
"use client"

import { useState } from "react"
import { createCustomerWithVehicle } from "./actions"

export default function ReceptionPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    
    // تجميع البيانات من النموذج
    const data = {
      customerName: formData.get("customerName") as string,
      customerPhone: formData.get("customerPhone") as string,
      customerEmail: formData.get("customerEmail") as string,
      vehiclePlate: formData.get("vehiclePlate") as string,
      vehicleBrand: formData.get("vehicleBrand") as string,
      vehicleModel: formData.get("vehicleModel") as string,
      vehicleYear: formData.get("vehicleYear") as string,
    }

    // إرسال البيانات إلى الخادم
    const response = await createCustomerWithVehicle(data)
    setLoading(false)

    if (response.success) {
      setMessage({ type: "success", text: "تم تسجيل العميل والمركبة بنجاح برقم ملف واحد!" })
      e.currentTarget.reset() // تفريغ الحقول بعد النجاح
    } else {
      setMessage({ type: "error", text: response.error || "حدث خطأ ما" })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">استقبال مركبة جديدة</h1>
        <p className="text-sm text-gray-500 mt-1">تسجيل بيانات العميل وسيارته في النظام دفعة واحدة.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${
          message.type === "success" ? "bg-green-500/10 text-green-600 border border-green-200" : "bg-red-500/10 text-red-600 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* قسم بيانات العميل */}
        <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2 border-b pb-2">
            👤 بيانات العميل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">اسم العميل بالكامل *</label>
              <input required name="customerName" type="text" className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="محمد أحمد..." />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">رقم الجوال *</label>
              <input required name="customerPhone" type="tel" className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-left" placeholder="05xxxxxxxx" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">البريد الإلكتروني (اختياري)</label>
              <input name="customerEmail" type="email" className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-left" placeholder="customer@mail.com" />
            </div>
          </div>
        </section>

        {/* قسم بيانات المركبة */}
        <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2 border-b pb-2">
            🚗 بيانات المركبة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">رقم اللوحة *</label>
              <input required name="vehiclePlate" type="text" className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold" placeholder="أ ب ج 1 2 3 4" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">الشركة المصنعة *</label>
              <input required name="vehicleBrand" type="text" className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="تويوتا، هيونداي..." />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">الموديل *</label>
              <input required name="vehicleModel" type="text" className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="كامري، إلنترا..." />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">سنة الصنع *</label>
              <input required name="vehicleYear" type="number" min="1980" max="2027" className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center" placeholder="2024" />
            </div>
          </div>
        </section>

        {/* زر الإرسال */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "جاري حفظ البيانات..." : "حفظ وإدخال الورشة ✨"}
          </button>
        </div>

      </form>
    </div>
  )
}