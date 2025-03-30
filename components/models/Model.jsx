"use client"

import { OrbitControls, Line } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useStorage, useMutation } from "@liveblocks/react/suspense"
import React from "react"

const gridSize = 8

const createGrid = () => {
  const grid = []
  for (let x = -gridSize / 2; x < gridSize / 2; x++) {
    for (let z = -gridSize / 2; z < gridSize / 2; z++) {
      grid.push({ id: `${x},${z}`, position: [x, 0, z], occupied: false })
    }
  }
  return grid
}

export function Model() {
  const gridData = useStorage((root) => root.grid || createGrid())

  // Mutation to update the grid state in Liveblocks storage
  const setGridData = useMutation(({ storage }, newGrid) => {
    storage.set("grid", newGrid)
  }, [])

  const handleClick = (tileId) => {
    const updatedGrid = gridData.map((cell) =>
      cell.id === tileId ? { ...cell, occupied: !cell.occupied } : cell
    )
    setGridData(updatedGrid)
  }

  return (
    <div className="w-full h-screen">
      <Canvas
        className="bg-gray-600"
        camera={{ position: [-15, 14, 15], fov: 15 }}
      >
        <OrbitControls />
        <axesHelper args={[5]} />

        {gridData.map((cell) => (
          <React.Fragment key={cell.id}>
            <Line
              points={[
                [cell.position[0] - 0.5, 0, cell.position[2] - 0.5],
                [cell.position[0] + 0.5, 0, cell.position[2] - 0.5],
                [cell.position[0] + 0.5, 0, cell.position[2] + 0.5],
                [cell.position[0] - 0.5, 0, cell.position[2] + 0.5],
                [cell.position[0] - 0.5, 0, cell.position[2] - 0.5],
              ]}
              color={cell.occupied ? "pink" : "blue"}
            />
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[cell.position[0], -0.01, cell.position[2]]}
              onClick={() => handleClick(cell.id)}
            >
              <planeGeometry args={[0.9, 0.9]} />
              <meshBasicMaterial
                color={cell.occupied ? "pink" : "lightgreen"}
                opacity={0.8}
              />
            </mesh>
          </React.Fragment>
        ))}
      </Canvas>
    </div>
  )
}
