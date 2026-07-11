// app/dashboard/technician/page.tsx
// ❌ لا يوجد "use client" هنا
import prisma from "@/lib/prisma"
import SessionInfo from "./_components/session-info"

export default async function TechnicianPage() {
  const users = await prisma.user.findMany()

  return (
    <div className="p-6">
      <SessionInfo />
      <ul className="mt-4 space-y-1">
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}