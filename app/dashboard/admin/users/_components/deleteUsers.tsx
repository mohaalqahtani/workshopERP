"use client"

import { deleteUser } from "../actions"

type Props = {
  userID: string
}

export default function DeleteUsers({ userID }: Props) {
  return <button onClick={() => deleteUser(userID)}>Delete User</button>
}
