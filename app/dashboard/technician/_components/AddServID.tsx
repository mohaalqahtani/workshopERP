"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { addServToJobCard } from "../actions"

type Service = {
  id: number
  name: string
  description: string
  price: number
  required_mechanics: number
}

type Props = {
  jobCardId: number
  availableServices: Service[]
}

export default function AddServDialog({ jobCardId, availableServices }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)

  // نجيب بيانات الخدمة المختارة لعرض تفاصيلها
  const selectedService = availableServices.find(s => s.id === selectedServiceId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await addServToJobCard({
      jobCardId,
      service_id: parseInt(formData.get("service_id") as string),
      // ↑ فقط هذين — بدون كمية أو سعر
    })

    setOpen(false)
    setSelectedServiceId(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger>
        <Button variant="outline">+ إضافة خدمة</Button>
      </DialogTrigger>

      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة خدمة للبطاقة</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── اختيار الخدمة ── */}
          <div className="space-y-1">
            <label className="text-sm font-medium">اختر الخدمة</label>
            <select
              name="service_id"
              required
              className="w-full border rounded p-2"
              onChange={(e) => setSelectedServiceId(Number(e.target.value))}
            >
              <option value="">-- اختر خدمة --</option>
              {availableServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — {service.price} ر.س
                </option>
              ))}
            </select>
          </div>

          {/* ── تفاصيل الخدمة المختارة ── */}
          {selectedService && (
            <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
              <p className="font-medium">{selectedService.name}</p>
              <p className="text-muted-foreground">{selectedService.description}</p>
              <p>السعر: {selectedService.price} ر.س</p>
              <p>عدد الفنيين: {selectedService.required_mechanics}</p>
            </div>
          )}

          <DialogFooter>
            <DialogClose>
              <Button type="button" variant="outline">إلغاء</Button>
            </DialogClose>
            <Button type="submit">إضافة</Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}