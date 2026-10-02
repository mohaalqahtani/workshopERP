// import { auth } from "@/lib/auth"
// import { headers } from "next/headers"
// import { redirect } from "next/navigation"
// import AdminPage from "@/app/dashboard/admin/page"
// import ReceptionistPage from "@/app/dashboard/receptionist/page"
// import TechnicianPage from "@/app/dashboard/technician/page"
// export default async function dashboardPage() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })
//   console.log(session)
//   const rolemap = {
//     // ADMIN: "/dashboard/admin",
//     ADMIN: <AdminPage/>,
//     RECEPTIONIST: "/dashboard/receptionist",
//     TECHNICIAN: "/dashboard/technician",
//   }
//   const role = session!.user.role as keyof typeof rolemap
//   const destination = rolemap[role]
//   redirect(destination)

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import AdminPage from "@/app/dashboard/admin/page"
import ReceptionistPage from "@/app/dashboard/receptionist/page"
import TechnicianPage from "@/app/dashboard/technician/page"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const role = session.user.role

  switch (role) {
    case "ADMIN":
      return <AdminPage />

    case "RECEPTIONIST":
      return <ReceptionistPage />

    case "TECHNICIAN":
      return <TechnicianPage />

    default:
      return <div>Unauthorized</div>
  }
}

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
// }
