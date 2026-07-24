"use client"

import { useState } from "react"
import { addUser } from "../actions"

export default function AddUsers() {
  const [nameUser, setNameUser] = useState("")
  const [emailUser, setEmail] = useState("")
  const [roleUser, setRole] = useState("")

  return (
    <>
      <input value={nameUser} onChange={(e) => setNameUser(e.target.value)} />

      <input value={emailUser} onChange={(e) => setEmail(e.target.value)} />

      <select value={roleUser} onChange={(e) => setRole(e.target.value)}>
        <option value="" disabled>
          اختر المهنة
        </option>

        <option value="ADMIN">الإداري</option>
        <option value="TECHNICIAN">الفني</option>
        <option value="RECEPTIONIST">الاستقبال</option>
      </select>

      <button
        disabled={!roleUser}
        onClick={() => addUser(nameUser, emailUser, roleUser)}
      >
        Add User
      </button>
    </>
  )
}

