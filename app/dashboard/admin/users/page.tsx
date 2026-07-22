import "./style.css"
import prisma from "@/lib/prisma"
import DeleteUsers from "./_components/deleteUsers"
import UpdateUsers from "./_components/updateUsers"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany()

  return (
    <table>
      <thead>
        <tr>
          <th>الاسم</th>
          <th>الإيميل</th>
          <th>المهنة</th>
          <th>حذف</th>
          <th>تعديل الاسم</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>

            <td>
              <DeleteUsers userID={user.id} />
            </td>
            <td>
              <UpdateUsers userID={user.id} name={user.name} role={user.role} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
