"use client"

import { ReactNode } from "react"
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense"

export function Room({ children }: { children: ReactNode }) {
  const liveblocksKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY

  if (!liveblocksKey) {
    throw new Error(
      "NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set in .env.local"
    )
  }

  console.log("children", children)
  return (
    <LiveblocksProvider publicApiKey={liveblocksKey}>
      <RoomProvider
        id="my-room"
        initialStorage={() => ({
          text: "Default Text",
        })}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <div className="border w-full">
            <p>Default Text</p>
          </div>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
