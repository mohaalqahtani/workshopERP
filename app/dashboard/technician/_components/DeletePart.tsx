"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { removePart } from "../actions"

type Props = {
  part_id: number
  job_card_id: number
}

export default function DeletePartButton({
  part_id,
  job_card_id,
}: Props) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    const ok = window.confirm("هل أنت متأكد من حذف القطعة ؟")

    if (!ok) return

    startTransition(async () => {
      await removePart({
        part_id,
        job_card_id,
      })
    })
  }

  return (
    <Button
      variant="destructive"
      size="icon-sm"
      disabled={isPending}
      onClick={handleDelete}
    >
      <Trash2 className="size-4" />
    </Button>
  )
}