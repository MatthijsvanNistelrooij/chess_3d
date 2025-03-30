"use client"

import { OrbitControls, Line, Environment, Html } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useStorage, useMutation } from "@liveblocks/react/suspense"
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

  // console.log("selectedPiece", selectedPiece)
  console.log("boardState", boardState)

  const setBoardStateMutation = useMutation(({ storage }, newBoardState) => {
    storage.set("board", newBoardState)
  }, [])

  const setInitialBoardState = useMutation(({ storage }, newBoardState) => {
    storage.set("board", initialBoardState)
  }, [])

  const root = useStorage((root) => root)

  useEffect(() => {
    if (root?.board) {
      setBoardState(root.board)
    } else {
      setBoardStateMutation(initialBoardState)
    }
  }, [root, setBoardStateMutation])

  const handleClick = (cellId) => {
    if (selectedPiece) {
      if (selectedPiece === cellId) {
        setSelectedPiece(null)
        return
      }

      const newBoardState = { ...boardState }
      newBoardState[cellId] = boardState[selectedPiece]
      newBoardState[selectedPiece] = null

      setBoardStateMutation(newBoardState)
      setBoardState(newBoardState)
      setSelectedPiece(null)
    } else {
      setSelectedPiece(cellId)
    }
  }

  const handleReset = () => {
    console.log("Reset")
    setInitialBoardState()
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas
        className="bg-gray-600"
        camera={{ position: [-15, 14, 15], fov: 15 }}
      >
        <Html fullscreen>
          <button onClick={handleReset} className="bg-emerald-500">
            Reset{" "}
          </button>
        </Html>
        <OrbitControls />
        <ChessBoard position={[0, -0.18, 0]} />
        {/* <axesHelper args={[5]} /> */}
        <ambientLight color={"white"} intensity={0.1} />
        <Environment background preset="night" blur={2} />
        <directionalLight
          position={[15, 50, 5]}
          intensity={4}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {grid.map((cell) => (
          <React.Fragment key={cell.id}>
            <Line
              points={[
                [cell.position[0] - 0.5, 0, cell.position[2] - 0.5],
                [cell.position[0] + 0.5, 0, cell.position[2] - 0.5],
                [cell.position[0] + 0.5, 0, cell.position[2] + 0.5],
                [cell.position[0] - 0.5, 0, cell.position[2] + 0.5],
                [cell.position[0] - 0.5, 0, cell.position[2] - 0.5],
              ]}
              color={"red"}
            />

            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[cell.position[0], -0.01, cell.position[2]]}
              onClick={() => handleClick(cell.id)}
            >
              <planeGeometry args={[0.9, 0.9]} />
              {/* <Html>{cell.id}</Html> */}
              <meshBasicMaterial color={"lightgreen"} opacity={0.8} />
            </mesh>

            {/* {boardState[cell.id] && (
              <group position={[cell.position[0], 0, cell.position[2]]}>
                <Html position={[0, 0.5, 0]}>
                  {boardState[cell.id].piece}

                  <div>HELLO</div>
                </Html>
              </group>
            )} */}
            {boardState[cell.id] && (
              <group position={[cell.position[0], 0, cell.position[2]]}>
                {boardState[cell.id].piece &&
                pieceComponents[boardState[cell.id].piece] ? (
                  React.createElement(
                    pieceComponents[boardState[cell.id].piece],
                    { position: [0, 0, 0] }
                  )
                ) : (
                  <Html position={[0, 0.5, 0]}>
                    {/* <div>No Piece</div> */}
                  </Html>
                )}
              </group>
            )}
          </React.Fragment>
        ))}
      </Canvas>
    </div>
  )
}
