// _components/add-parts-dialog.tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { addPartToJobCard } from "../actions"

// نوع القطعة اللي تصل من السيرفر
type Part = {
  id: number
  name: string
  base_price: number  // سنستخدمه كسعر افتراضي
  stock_qty: number
}

type Props = {
  jobCardId: number
  availableParts: Part[]
}

export default function AddPartsDialog({ jobCardId, availableParts }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null)

  // لما يختار قطعة، نجيب سعرها تلقائياً
  const selectedPart = availableParts.find(p => p.id === selectedPartId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await addPartToJobCard({
      jobCardId,
      partId:    parseInt(formData.get("partId")    as string),
      quantity:  parseInt(formData.get("quantity")  as string),
      soldPrice: parseFloat(formData.get("soldPrice") as string),
    })

    setOpen(false)
    setSelectedPartId(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger>
        <Button variant="outline">+ إضافة قطعة</Button>
      </DialogTrigger>

      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة قطعة للبطاقة</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── اختيار القطعة ── */}
          <div className="space-y-1">
            <label className="text-sm font-medium">اختر القطعة</label>
            <select
              name="partId"
              required
              className="w-full border rounded p-2"
              onChange={(e) => setSelectedPartId(Number(e.target.value))}
            >
              <option value="">-- اختر قطعة --</option>
              {availableParts.map((part) => (
                <option
                  key={part.id}
                  value={part.id}
                  disabled={part.stock_qty === 0}
                  // ↑ القطع المنتهية تظهر معطّلة
                >
                  {part.name} — متوفر: {part.stock_qty}
                </option>
              ))}
            </select>
          </div>

          {/* ── الكمية ── */}
          <div className="space-y-1">
            <label className="text-sm font-medium">الكمية</label>
            <input
              name="quantity"
              type="number"
              min="1"
              max={selectedPart?.stock_qty}
              // ↑ لا يقدر يطلب أكثر مما في المستودع
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* ── سعر البيع (يتعبأ تلقائياً) ── */}
          <div className="space-y-1">
            <label className="text-sm font-medium">سعر البيع</label>
            <input
              name="soldPrice"
              type="number"
              step="0.01"
              defaultValue={selectedPart?.base_price ?? ""}
              // ↑ يعرض السعر الافتراضي لما يختار قطعة
              className="w-full border rounded p-2"
              required
            />
            {selectedPart && (
              <p className="text-xs text-muted-foreground">
                السعر الأساسي: {selectedPart.base_price} ر.س
              </p>
            )}
          </div>

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