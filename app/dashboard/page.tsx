import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
// import AdminPage from "@/app/dashboard/admin/page"
// import ReceptionistPage from "@/app/dashboard/receptionist/page"
// import TechnicianPage from "@/app/dashboard/technician/page"
export default async function dashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  console.log(session)
  const rolemap = {
    ADMIN: "/dashboard/admin",
    RECEPTIONIST: "/dashboard/receptionist",
    TECHNICIAN: "/dashboard/technician",
  }
  const role = session!.user.role as keyof typeof rolemap
  const destination = rolemap[role]
  redirect(destination)

  //   const role = session!.user.role
  //   if (role === "ADMIN") {
  //     return <AdminPage />
  //   }
  //   if (role === "RECEPTIONIST") {
  //     return <ReceptionistPage />
  //   }
  //   if (role === "TECHNICIAN") {
  //     return <TechnicianPage />
  //   } else {
  //     redirect("/login")
  //   }
}
