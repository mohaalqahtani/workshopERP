import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

import prisma from "@/lib/prisma"

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  const { id } = await params

  const photo = await prisma.inspection_Photos.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!photo) {
    return new NextResponse("الصورة غير موجودة", {
      status: 404,
    })
  }

  const filePath = path.join(process.cwd(), "storage", photo.photo_Url)

  try {
    const file = await readFile(filePath)

    return new NextResponse(file, {
      headers: {
        "Content-Type": getContentType(photo.photo_Url),
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch (error) {
    console.error("فشل قراءة الصورة:", error)

    return new NextResponse("الملف غير موجود", {
      status: 404,
    })
  }
}

function getContentType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase()

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"

    case ".png":
      return "image/png"

    case ".webp":
      return "image/webp"

    default:
      return "application/octet-stream"
  }
}
