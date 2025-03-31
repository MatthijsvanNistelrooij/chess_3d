"use client"
import React from "react"
import { Model } from "@/components/models/Model"
import { Room } from "../../Room"
import { useParams } from "next/navigation"

const PrivateRoom = () => {
  const { id } = useParams()

  const roomId = Array.isArray(id) ? id[0] : id

  if (!roomId) return <p>Loading...</p>

  return (
    <Room roomId={roomId as string}>
      <Model />
    </Room>
  )
}

export default PrivateRoom
