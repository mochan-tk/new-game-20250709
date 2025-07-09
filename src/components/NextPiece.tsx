'use client';

import React from 'react';
import { Tetromino, CELL_SIZE } from '@/types/tetris';

interface NextPieceProps {
  nextPiece: Tetromino | null;
}

const getCellColor = (cellValue: number, type: string): string => {
  if (cellValue === 0) return 'bg-gray-800 border-gray-700';
  
  const colorMap: Record<string, string> = {
    'I': 'bg-cyan-400 border-cyan-300',
    'O': 'bg-yellow-400 border-yellow-300',
    'T': 'bg-purple-400 border-purple-300',
    'S': 'bg-green-400 border-green-300',
    'Z': 'bg-red-400 border-red-300',
    'J': 'bg-blue-400 border-blue-300',
    'L': 'bg-orange-400 border-orange-300',
  };
  return colorMap[type] || 'bg-gray-800 border-gray-700';
};

export default function NextPiece({ nextPiece }: NextPieceProps) {
  if (!nextPiece) {
    return (
      <div className="bg-gray-800 border-2 border-gray-600 p-4 rounded">
        <h3 className="text-white text-lg font-bold mb-2">Next</h3>
        <div className="w-16 h-16 bg-gray-900"></div>
      </div>
    );
  }

  const gridSize = Math.max(nextPiece.shape.length, nextPiece.shape[0]?.length || 0);
  const smallCellSize = Math.min(CELL_SIZE * 0.8, 20);

  return (
    <div className="bg-gray-800 border-2 border-gray-600 p-4 rounded">
      <h3 className="text-white text-lg font-bold mb-2">Next</h3>
      <div 
        className="grid border border-gray-700 bg-gray-900"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${smallCellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${smallCellSize}px)`,
          width: gridSize * smallCellSize,
          height: gridSize * smallCellSize,
        }}
      >
        {Array(gridSize).fill(null).map((_, rowIndex) =>
          Array(gridSize).fill(null).map((_, colIndex) => {
            const cellValue = nextPiece.shape[rowIndex]?.[colIndex] || 0;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`border ${getCellColor(cellValue, nextPiece.type)}`}
                style={{
                  width: smallCellSize,
                  height: smallCellSize,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}