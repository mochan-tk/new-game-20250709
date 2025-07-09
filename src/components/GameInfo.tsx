'use client';

import React from 'react';

interface GameInfoProps {
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
}

export default function GameInfo({ score, lines, level, gameOver, isPaused }: GameInfoProps) {
  return (
    <div className="bg-gray-800 border-2 border-gray-600 p-4 rounded space-y-4">
      <div>
        <h3 className="text-white text-lg font-bold mb-2">Score</h3>
        <p className="text-yellow-400 text-xl font-mono">{score.toLocaleString()}</p>
      </div>
      
      <div>
        <h3 className="text-white text-lg font-bold mb-2">Lines</h3>
        <p className="text-green-400 text-xl font-mono">{lines}</p>
      </div>
      
      <div>
        <h3 className="text-white text-lg font-bold mb-2">Level</h3>
        <p className="text-blue-400 text-xl font-mono">{level}</p>
      </div>

      {gameOver && (
        <div className="bg-red-600 text-white p-3 rounded text-center">
          <p className="font-bold">Game Over!</p>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="bg-yellow-600 text-white p-3 rounded text-center">
          <p className="font-bold">Paused</p>
        </div>
      )}

      <div className="text-sm text-gray-400 space-y-1">
        <p><strong>Controls:</strong></p>
        <p>← → Move</p>
        <p>↓ Soft drop</p>
        <p>↑ Rotate</p>
        <p>Space Hard drop</p>
        <p>P Pause</p>
        <p>R Restart</p>
      </div>
    </div>
  );
}