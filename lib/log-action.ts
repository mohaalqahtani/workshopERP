import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

type LogData = {
  action: string
  entity?: string
  entity_id?: number
  details?: Record<string, unknown>
}

export async function logAction(data: LogData) {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id

  if (!userId) return

  prisma.system_Logs
    .create({
      data: {
        action: data.action,
        entity: data.entity,
        entity_id: data.entity_id,
        details: data.details ?? {},
        user_id: userId,
      },
    })
    .catch((err) => console.error("[logAction] failed:", err))
}
