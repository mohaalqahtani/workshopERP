// admin/inventory/actions.ts
"use server"

import prisma from "@/lib/prisma"
import {revalidatePath} from "next/cache"

export async function addServiceAction(data:{
    name:string
    description: string
    required_mechanics:number
    price: number
}) {
    await prisma.services_List.create({data})
    revalidatePath("/dashboard/admin/services")
}