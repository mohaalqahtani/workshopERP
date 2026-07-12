// admin/inventory/actions.ts
"use server"

import prisma from "@/lib/prisma"
import {revalidatePath} from "next/cache"

export async function addPart(data:{
    name:string
    stock_qty:number
    base_price:number
    compatible_cars: string[]
    image_url: string
}) {
    await prisma.parts_Inventory.create({data})
    revalidatePath("/dashboard/admin/inventory")
}