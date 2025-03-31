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
    <div className="w-full h-screen flex flex-col justify-center text-center gap-10" id="banner">
      <h1>Welcome to Chess 3D ♕</h1>
      <button
        className="mx-auto border p-3 px-12 bg-black border-white hover:bg-[#0a0a0a] cursor-pointer"
        onClick={createRoom}
      >
        Create Private Room
      </button>
    </div>
  )
}
