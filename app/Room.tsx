"use client"

import { ReactNode } from "react"
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense"

export function Room({
  roomId,
  children,
}: {
  roomId: string
  children: ReactNode
}) {
  const liveblocksKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY

  if (!liveblocksKey) {
    throw new Error(
      "NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set in .env.local"
    )
  }

  return (
    <LiveblocksProvider publicApiKey={liveblocksKey}>
      <RoomProvider
        id={roomId}
        initialStorage={() => ({
          text: "Default Text",
        })}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
