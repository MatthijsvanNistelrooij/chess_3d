"use client"

import { useStorage, useMutation } from "@liveblocks/react/suspense"

export function CollaborativeApp() {
  // Get the shared text from storage
  const text = useStorage((root) => root.text)

  // Mutation to update the text
  const setText = useMutation(({ storage }, newText) => {
    storage.set("text", newText)
  }, [])

  return (
    <div className="border mx-auto">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="bg-transparent text-white text-center outline-none"
      />
    </div>
  )
}
