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
    <div
      className="w-full h-screen flex flex-col justify-end text-center gap-10 px-6"
      id="banner"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-300 drop-shadow-md text-shadow-gold">
        Welcome to <span className="text-yellow-200 text-shadow-gold">Chess 3D ♕</span>
      </h1>

      <button
        className="mx-auto border-2 border-yellow-500 text-yellow-200 text-shadow-gold px-12 py-3 rounded-lg 
                   bg-gradient-to-br from-yellow-700 to-yellow-900 hover:from-yellow-600 
                   hover:to-yellow-800 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer mb-40"
        onClick={createRoom}
      >
        Create Private Room
      </button>
    </div>
  )
}
