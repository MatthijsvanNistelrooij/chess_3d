"use client"

import { useStorage, useMutation } from "@liveblocks/react/suspense"

export function CollaborativeApp() {
  const root = useStorage((root) => root || "")

  console.log("text", root)

  const setText = useMutation(({ storage }, newText) => {
    return storage.set("text", newText)
  }, [])

  return (
    <div className="border mx-auto">
      <input
        type="text"
        value={root.text}
        onChange={(e) => setText(e.target.value)}
        className="bg-transparent text-white text-center outline-none"
      />
    </div>
  )
}
