"use client"

import { useState } from "react"
import { updateUser } from "../actions"

type Props = {
  userID: string
  name: string
  role: string
}

export default function UpdateUsers({ userID, name, role }: Props) {
  const [newName, setNewName] = useState(name)
  const [newRole, setNewRole] = useState(role)

  return (
    <>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />

      <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
        <option disabled value="أختر المهنة الجديدة">
          أختر المهنة الجديدة
        </option>
        <option value="ADMIN">الاداري</option>
        <option value="TECHNICIAN">الفني</option>
        <option value="RECEPTIONIST">الاستقبال</option>
      </select>

      <button onClick={() => updateUser(userID, newName, newRole)}>
        Update Name
      </button>
    </>
  )
}
