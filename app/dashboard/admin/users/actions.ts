"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: {
      id,
    },
  })

  revalidatePath("/admin/users")
}

export async function updateUser(
  id: string,
  nameupdated: string,
  newRole: string
) {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      name: nameupdated,
      role: newRole,
    },
  })

  revalidatePath("/admin/users")
}
