import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
export default async function dashboardPage(){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    console.log(session)
    const rolemap = {
        ADMIN : "/dashboard/admin",
        RECEPTIONIST : "/dashboard/receptionist",
        TECHNICIAN : "/dashboard/technician"
    }
    const role = session!.user.role as keyof typeof rolemap
    const destination = rolemap[role]
    redirect(destination)
}
