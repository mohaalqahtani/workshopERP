// _components/upload-photo.tsx
"use client"
import { useState } from "react"
import { saveInspectionPhoto } from "../actions"

type Props = {
  jobCardId: number
  technicianId: string
}

export default function UploadPhoto({ jobCardId, technicianId }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // 1️⃣ عرض preview فوري قبل الرفع
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      // 2️⃣ رفع الصورة لـ Cloudinary مباشرة من المتصفح
      const formData = new FormData()
      formData.append("file", file)
      formData.append("jobCardId", String(jobCardId))
      formData.append("technicianId", technicianId)
      // formData.append(
      //   "upload_preset",
      //   process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      // )
      // // ↑ NEXT_PUBLIC = يظهر في المتصفح (مقصود لأن الرفع من المتصفح)

      // const response = await fetch(
      //   `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      //   { method: "POST", body: formData }
      // )

      // const data = await response.json()
      // const photoUrl = data.secure_url
      // // ↑ الرابط الدائم للصورة
      // // مثال: https://res.cloudinary.com/mycloud/image/upload/v123/photo.jpg

      // 3️⃣ حفظ الرابط في DB
      // await saveInspectionPhoto({
      //   jobCardId,
      //   photoUrl,
      //   uploadedBy: technicianId,
      // })
      await saveInspectionPhoto(formData)
    } catch (error) {
      console.error("فشل رفع الصورة:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* زر الاختيار */}
      <label
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-3 text-sm transition hover:bg-muted ${uploading ? "cursor-not-allowed opacity-50" : ""} `}
      >
        <input
          type="file"
          accept="image/*"
          capture="environment"
          // ↑ capture="environment" يفتح الكاميرا الخلفية على الجوال
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        {uploading ? "جاري الرفع..." : "📷 التقط صورة أو اختر من المعرض"}
      </label>

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="معاينة"
          className="h-40 w-full rounded-lg object-cover"
        />
      )}
    </div>
  )
}
