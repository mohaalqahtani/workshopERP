// receptionist/_components/print-card.tsx
// ما يحتاج "use client" — مجرد عرض

import Barcode from "./BarCode"

type Props = {
  jobCardId: number
  customerName: string
  vehicleModel: string
  vehiclePlate: string
}

export default function PrintCard({ jobCardId, customerName, vehicleModel, vehiclePlate }: Props) {
  return (
    <div className="p-6 text-center space-y-4">
      <h2 className="text-xl font-bold">ورشة السيارات</h2>
      <div className="text-right space-y-1 text-sm">
        <p>اسم العميل: {customerName}</p>
        <p>الموديل: {vehicleModel}</p>
        <p>اللوحة: {vehiclePlate}</p>
        <p>رقم البطاقة: #{jobCardId}</p>
      </div>
      {/* الباركود = رقم البطاقة */}
      <Barcode value={String(jobCardId)} />
    </div>
  )
}