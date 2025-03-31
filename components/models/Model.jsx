"use client"

import { OrbitControls, Line, Environment, Html } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useStorage, useMutation, useOthers } from "@liveblocks/react/suspense"
import React, { useState, useEffect } from "react"

import { ChessBoard } from "./ChessBoard"
import { BlackBishop } from "./BlackBishop"
import { WhiteBishop } from "./WhiteBishop"
import { BlackKnight } from "./BlackKnight"
import { WhiteKnight } from "./WhiteKnight"
import { BlackRook } from "./BlackRook"
import { WhiteRook } from "./WhiteRook"
import { BlackQueen } from "./BlackQueen"
import { WhiteQueen } from "./WhiteQueen"
import { BlackKing } from "./BlackKing"
import { WhiteKing } from "./WhiteKing"
import { BlackPawn } from "./BlackPawn"
import { WhitePawn } from "./WhitePawn"

const pieceComponents = {
  blackbishop: BlackBishop,
  whitebishop: WhiteBishop,
  blackknight: BlackKnight,
  whiteknight: WhiteKnight,
  blackrook: BlackRook,
  whiterook: WhiteRook,
  blackqueen: BlackQueen,
  whitequeen: WhiteQueen,
  blackking: BlackKing,
  whiteking: WhiteKing,
  blackpawn: BlackPawn,
  whitepawn: WhitePawn,
}

const createGrid = () => {
  const files = "ABCDEFGH".split("")
  const ranks = [...Array(8)].map((_, i) => 8 - i)

  let grid = []
  for (let x = 0; x < 8; x++) {
    for (let z = 0; z < 8; z++) {
      const chessCoordinate = `${files[x]}${ranks[z]}`
      grid.push({
        id: chessCoordinate,
        position: [x - 3.5, 0, z - 3.5],
      })
    }
  }
  return grid
}

const initialBoardState = {
  A1: { piece: "whiterook", position: "0,0,0" },
  B1: { piece: "whiteknight", position: "0,0,0" },
  C1: { piece: "whitebishop", position: "0,0,0" },
  D1: { piece: "whitequeen", position: "0,0,0" },
  E1: { piece: "whiteking", position: "0,0,0" },
  F1: { piece: "whitebishop", position: "0,0,0" },
  G1: { piece: "whiteknight", position: "0,0,0" },
  H1: { piece: "whiterook", position: "0,0,0" },

  A2: { piece: "whitepawn", position: "0,0,0" },
  B2: { piece: "whitepawn", position: "0,0,0" },
  C2: { piece: "whitepawn", position: "0,0,0" },
  D2: { piece: "whitepawn", position: "0,0,0" },
  E2: { piece: "whitepawn", position: "0,0,0" },
  F2: { piece: "whitepawn", position: "0,0,0" },
  G2: { piece: "whitepawn", position: "0,0,0" },
  H2: { piece: "whitepawn", position: "0,0,0" },

  A3: { piece: "", position: "0,0,0" },
  B3: { piece: "", position: "0,0,0" },
  C3: { piece: "", position: "0,0,0" },
  D3: { piece: "", position: "0,0,0" },
  E3: { piece: "", position: "0,0,0" },
  F3: { piece: "", position: "0,0,0" },
  G3: { piece: "", position: "0,0,0" },
  H3: { piece: "", position: "0,0,0" },

  A4: { piece: "", position: "0,0,0" },
  B4: { piece: "", position: "0,0,0" },
  C4: { piece: "", position: "0,0,0" },
  D4: { piece: "", position: "0,0,0" },
  E4: { piece: "", position: "0,0,0" },
  F4: { piece: "", position: "0,0,0" },
  G4: { piece: "", position: "0,0,0" },
  H4: { piece: "", position: "0,0,0" },

  A5: { piece: "", position: "0,0,0" },
  B5: { piece: "", position: "0,0,0" },
  C5: { piece: "", position: "0,0,0" },
  D5: { piece: "", position: "0,0,0" },
  E5: { piece: "", position: "0,0,0" },
  F5: { piece: "", position: "0,0,0" },
  G5: { piece: "", position: "0,0,0" },
  H5: { piece: "", position: "0,0,0" },

  A6: { piece: "", position: "0,0,0" },
  B6: { piece: "", position: "0,0,0" },
  C6: { piece: "", position: "0,0,0" },
  D6: { piece: "", position: "0,0,0" },
  E6: { piece: "", position: "0,0,0" },
  F6: { piece: "", position: "0,0,0" },
  G6: { piece: "", position: "0,0,0" },
  H6: { piece: "", position: "0,0,0" },

  A7: { piece: "blackpawn", position: "0,0,0" },
  B7: { piece: "blackpawn", position: "0,0,0" },
  C7: { piece: "blackpawn", position: "0,0,0" },
  D7: { piece: "blackpawn", position: "0,0,0" },
  E7: { piece: "blackpawn", position: "0,0,0" },
  F7: { piece: "blackpawn", position: "0,0,0" },
  G7: { piece: "blackpawn", position: "0,0,0" },
  H7: { piece: "blackpawn", position: "0,0,0" },

  A8: { piece: "blackrook", position: "0,0,0" },
  B8: { piece: "blackknight", position: "0,0,0" },
  C8: { piece: "blackbishop", position: "0,0,0" },
  D8: { piece: "blackqueen", position: "0,0,0" },
  E8: { piece: "blackking", position: "0,0,0" },
  F8: { piece: "blackbishop", position: "0,0,0" },
  G8: { piece: "blackknight", position: "0,0,0" },
  H8: { piece: "blackrook", position: "0,0,0" },
}

const presets = [
  { name: "sunset", color: "#CBC3E3" },
  { name: "night", color: "#7f7053 " },
  { name: "forest", color: "#C4A480" },
  { name: "park", color: "#82A67D" },
]

export function Model() {
  const root = useStorage((root) => root)
  const others = useOthers()
  const grid = createGrid()

  const [env, setEnv] = useState("sunset")
  const [pieceSize, setPieceSize] = useState(1)
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [boardState, setBoardState] = useState(initialBoardState)
  const [defeatedPieces, setDefeatedPieces] = useState(
    root?.defeatedPieces || []
  )

  const setBoardStateMutation = useMutation(({ storage }, newBoardState) => {
    storage.set("board", newBoardState)
  }, [])

  const setInitialBoardState = useMutation(({ storage }, newBoardState) => {
    storage.set("board", initialBoardState)
  }, [])

  const setDefeatedPiecesMutation = useMutation(
    ({ storage }, newDefeatedPieces) => {
      storage.set("defeatedPieces", newDefeatedPieces)
    },
    []
  )

  useEffect(() => {
    if (root?.board) {
      setBoardState(root.board)
    } else {
      setBoardStateMutation(initialBoardState)
    }
    if (root?.defeatedPieces) {
      setDefeatedPieces(root.defeatedPieces)
    }
  }, [root, setBoardStateMutation])

  const handleClick = (cellId) => {
    if (!selectedPiece && !boardState[cellId].piece) {
      return
    }
    if (selectedPiece) {
      if (selectedPiece === cellId) {
        setSelectedPiece(null)
        return
      }

      const newBoardState = { ...boardState }
      if (boardState[cellId] && boardState[cellId].piece) {
        const newDefeatedPieces = [...defeatedPieces, boardState[cellId].piece]
        setDefeatedPiecesMutation(newDefeatedPieces)
        setDefeatedPieces(newDefeatedPieces)

        newBoardState[cellId] = boardState[selectedPiece]
        newBoardState[selectedPiece] = null
      } else {
        newBoardState[cellId] = boardState[selectedPiece]
        newBoardState[selectedPiece] = { piece: "", position: "0,0,0" }
      }

      setBoardStateMutation(newBoardState)
      setBoardState(newBoardState)
      setSelectedPiece(null)
    } else {
      if (boardState[cellId].piece) {
        setSelectedPiece(cellId)
      }
    }
  }

  const handleReset = () => {
    setInitialBoardState()
    setDefeatedPieces([])
    setDefeatedPiecesMutation([])
  }

  const sortedDefeatedPieces = {
    white: [],
    black: [],
  }

  defeatedPieces.forEach((piece) => {
    if (piece.includes("white")) {
      sortedDefeatedPieces.white.push(piece)
    } else if (piece.includes("black")) {
      sortedDefeatedPieces.black.push(piece)
    }
  })

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div className="flex justify-between text-center p-2 px-2 md:px-8">
        <div className="flex">
          <h1>Users</h1>
          <div className="flex ml-2">
            <div
              className="w-6 h-6 border-2 border-gray-500 bg-gradient-to-br from-gray-300 to-green-400 rounded-full"
              title="You"
            ></div>
            {others.length > 0 && (
              <div
                className="w-6 h-6 border-2 -ml-2 border-gray-500 bg-gradient-to-br from-gray-300 to-orange-400 rounded-full "
                title="Guest"
              ></div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 text-center justify-center">
          <div className="flex items-center gap-2 text-center justify-center">
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={pieceSize}
              onChange={(e) => setPieceSize(parseFloat(e.target.value))}
              className="cursor-pointer accent-black"
            />
          </div>
          <div className="bg-gray-800 bg-opacity-50 p-2 px-5 rounded-lg gap-5 flex">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setEnv(preset.name)}
                className="w-4 h-4 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: preset.color,
                  borderColor: env === preset.name ? "white" : "transparent",
                  boxShadow:
                    env === preset.name
                      ? "0 0 10px rgba(255, 255, 255, 0.8)"
                      : "none",
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleReset}
          className="bg-emerald-500 hover:bg-emerald-700 text-sm p-1 px-2 rounded cursor-pointer h-8"
        >
          Reset
        </button>
      </div>
      <Canvas
        className="bg-gray-600"
        camera={{ position: [-15, 14, 15], fov: 25 }}
        shadows
      >
        <OrbitControls enableZoom={true} enableDamping />
        <Environment background preset={env} blur={2} />
        <directionalLight
          position={[15, 50, 5]}
          intensity={5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <ChessBoard position={[0, -0.18, 0]} />

        {grid.map((cell) => (
          <React.Fragment key={cell.id}>
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[cell.position[0], -0.01, cell.position[2]]}
              onClick={() => handleClick(cell.id)}
            >
              <planeGeometry args={[0.9, 0.9]} />
            </mesh>

            {boardState[cell.id] && boardState[cell.id].piece && (
              <group
                position={[cell.position[0], 0, cell.position[2]]}
                scale={pieceSize}
              >
                {boardState[cell.id].piece &&
                pieceComponents[boardState[cell.id].piece]
                  ? React.createElement(
                      pieceComponents[boardState[cell.id].piece],
                      {
                        position:
                          selectedPiece === cell.id ? [0, 0.5, 0] : [0, 0, 0],
                      }
                    )
                  : null}
              </group>
            )}
          </React.Fragment>
        ))}

        {sortedDefeatedPieces.white.map((piece, index) => (
          <group
            key={`white-${index}`}
            position={[6, -0.2, index * 0.7 - 5]}
            scale={pieceSize}
          >
            {pieceComponents[piece] &&
              React.createElement(pieceComponents[piece])}
          </group>
        ))}

        {sortedDefeatedPieces.black.map((piece, index) => (
          <group
            key={`black-${index}`}
            position={[-6, -0.2, index * 0.7 - 5]}
            scale={pieceSize}
          >
            {pieceComponents[piece] &&
              React.createElement(pieceComponents[piece])}
          </group>
        ))}
      </Canvas>
    </div>
  )
}
