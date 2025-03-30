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

export function Model() {
  const grid = createGrid()
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [boardState, setBoardState] = useState(initialBoardState)
  const others = useOthers()


  const setBoardStateMutation = useMutation(({ storage }, newBoardState) => {
    storage.set("board", newBoardState)
  }, [])

  const setInitialBoardState = useMutation(({ storage }, newBoardState) => {
    storage.set("board", initialBoardState)
  }, [])

  const root = useStorage((root) => root)


  console.log("root", root)


  useEffect(() => {
    if (root?.board) {
      setBoardState(root.board)
    } else {
      setBoardStateMutation(initialBoardState)
    }
  }, [root, setBoardStateMutation])


  const handleClick = (cellId) => {
    // If no piece is selected and the clicked square is empty, do nothing
    if (!selectedPiece && !boardState[cellId].piece) {
      return
    }

    // If a piece is selected
    if (selectedPiece) {
      // If the selected piece is clicked again, deselect it
      if (selectedPiece === cellId) {
        setSelectedPiece(null)
        return
      }

      // If it's a valid move (piece selected and clicked on a square with a piece or empty square)
      const newBoardState = { ...boardState }
      if (boardState[cellId].piece) {
        newBoardState[cellId] = boardState[selectedPiece]
        newBoardState[selectedPiece] = null
      } else {
        // Handle moving the selected piece to an empty square
        newBoardState[cellId] = boardState[selectedPiece]
        newBoardState[selectedPiece] = { piece: "", position: "0,0,0" }
      }

      setBoardStateMutation(newBoardState)
      setBoardState(newBoardState)
      setSelectedPiece(null)
    } else {
      // Set the selected piece if it's not null and the square contains a piece
      if (boardState[cellId].piece) {
        setSelectedPiece(cellId)
      }
    }
  }

  const handleReset = () => {
    setInitialBoardState()
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div className="flex text-center p-2">
        Online users:
        <div className="flex ml-2">
          <div className="w-6 h-6 border-2 border-gray-500 bg-gradient-to-br from-gray-300 to-yellow-400 rounded-full"></div>
          {others.length > 0 && (
            <div className="w-6 h-6 border-2 -ml-2 border-gray-500 bg-gradient-to-br from-gray-300 to-yellow-400 rounded-full"></div>
          )}
        </div>
      </div>
      <Canvas
        className="bg-gray-600"
        camera={{ position: [-15, 14, 15], fov: 15 }}
        shadows
      >
        <Html fullscreen>
          <button onClick={handleReset} className="bg-emerald-500">
            Reset{" "}
          </button>
        </Html>
        <OrbitControls />

        <Environment background preset="night" blur={2} />
        <directionalLight
          position={[15, 50, 5]}
          intensity={4}
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

            {boardState[cell.id] && (
              <group position={[cell.position[0], 0, cell.position[2]]}>
                {boardState[cell.id].piece &&
                pieceComponents[boardState[cell.id].piece]
                  ? React.createElement(
                      pieceComponents[boardState[cell.id].piece],
                      {
                        position:
                          selectedPiece === cell.id ? [0, 0.5, 0] : [0, 0, 0], // Moves up when selected
                      }
                    )
                  : null}
              </group>
            )}
          </React.Fragment>
        ))}
      </Canvas>
    </div>
  )
}
