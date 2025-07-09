'use client';

import React from 'react';
import { Tetromino, BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from '@/types/tetris';

interface GameBoardProps {
  board: number[][];
  currentPiece: Tetromino | null;
}

const getCellColor = (cellValue: number): string => {
  const colorMap: Record<number, string> = {
    0: 'bg-gray-800 border-gray-700',
    1: 'bg-cyan-400 border-cyan-300',    // I
    2: 'bg-yellow-400 border-yellow-300', // O
    3: 'bg-purple-400 border-purple-300', // T
    4: 'bg-green-400 border-green-300',   // S
    5: 'bg-red-400 border-red-300',       // Z
    6: 'bg-blue-400 border-blue-300',     // J
    7: 'bg-orange-400 border-orange-300', // L
  };
  return colorMap[cellValue] || 'bg-gray-800 border-gray-700';
};

export default function GameBoard({ board, currentPiece }: GameBoardProps) {
  // Create a display board that includes the current falling piece
  const displayBoard = board.map(row => [...row]);
  
  // Add current piece to display board
  if (currentPiece) {
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col] !== 0) {
          const x = currentPiece.position.x + col;
          const y = currentPiece.position.y + row;
          
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            // Use the same color coding system as in placePiece
            const typeValue = currentPiece.type === 'I' ? 1 
              : currentPiece.type === 'O' ? 2 
              : currentPiece.type === 'T' ? 3
              : currentPiece.type === 'S' ? 4
              : currentPiece.type === 'Z' ? 5
              : currentPiece.type === 'J' ? 6
              : 7; // L
            displayBoard[y][x] = typeValue;
          }
        }
      }
    }
  }

  return (
    <div 
      className="grid border-2 border-gray-600 bg-gray-900"
      style={{
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
        width: BOARD_WIDTH * CELL_SIZE,
        height: BOARD_HEIGHT * CELL_SIZE,
      }}
    >
      {displayBoard.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`border ${getCellColor(cell)}`}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        ))
      )}
    </div>
  );
}