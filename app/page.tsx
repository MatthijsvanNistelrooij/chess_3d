"use client"

import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const createRoom = () => {
    const roomId = uuidv4()
    router.push(`/room/${roomId}`)
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center text-center gap-10">
      <h1>Welcome to 3D Chess ♕</h1>
      <button
        className="mx-auto border p-3 border-white w-80 hover:bg-gray-900 cursor-pointer"
        onClick={createRoom}
      >
        Create Private Room
      </button>
    </div>
  )
}
