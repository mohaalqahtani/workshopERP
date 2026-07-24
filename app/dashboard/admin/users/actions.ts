"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

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

export async function addUser(name: string, email: string, role: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Not authenticated")
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Only admin can create users")
  }

  const user = await auth.api.createUser({
    body: {
      name,
      email,
      role,
      password: crypto.randomUUID(),
    },
  })

  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: `${process.env.BETTER_AUTH_URL}/reset-password`,
    },
  })

  return user
}
