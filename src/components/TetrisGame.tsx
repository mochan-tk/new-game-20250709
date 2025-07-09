'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './GameBoard';
import NextPiece from './NextPiece';
import GameInfo from './GameInfo';
import { 
  GameState, 
  Tetromino,
  BOARD_WIDTH,
  BOARD_HEIGHT
} from '@/types/tetris';
import {
  createEmptyBoard,
  getRandomTetromino,
  isValidPosition,
  rotatePiece,
  placePiece,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  isGameOver,
  movePiece
} from '@/lib/gameLogic';

export default function TetrisGame() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 0,
    gameOver: false,
    isPaused: false
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastDropTimeRef = useRef<number>(0);

  const initializeGame = useCallback(() => {
    const firstPiece = getRandomTetromino();
    const secondPiece = getRandomTetromino();
    
    setGameState({
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      nextPiece: secondPiece,
      score: 0,
      lines: 0,
      level: 0,
      gameOver: false,
      isPaused: false
    });
  }, []);

  const dropPiece = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || prevState.isPaused || !prevState.currentPiece) {
        return prevState;
      }

      const movedPiece = movePiece(prevState.currentPiece, 'down');
      
      if (isValidPosition(prevState.board, movedPiece, movedPiece.position)) {
        return {
          ...prevState,
          currentPiece: movedPiece
        };
      } else {
        // Piece has landed, place it on the board
        const newBoard = placePiece(prevState.board, prevState.currentPiece);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        
        const newLines = prevState.lines + linesCleared;
        const newLevel = calculateLevel(newLines);
        const newScore = prevState.score + calculateScore(linesCleared, prevState.level);
        
        const newPiece = prevState.nextPiece;
        const nextPiece = getRandomTetromino();
        
        // Check game over
        const gameOver = newPiece ? isGameOver(clearedBoard, newPiece) : true;
        
        return {
          ...prevState,
          board: clearedBoard,
          currentPiece: gameOver ? null : newPiece,
          nextPiece: gameOver ? null : nextPiece,
          score: newScore,
          lines: newLines,
          level: newLevel,
          gameOver
        };
      }
    });
  }, []);

  const movePieceHorizontally = useCallback((direction: 'left' | 'right') => {
    setGameState(prevState => {
      if (prevState.gameOver || prevState.isPaused || !prevState.currentPiece) {
        return prevState;
      }

      const movedPiece = movePiece(prevState.currentPiece, direction);
      
      if (isValidPosition(prevState.board, movedPiece, movedPiece.position)) {
        return {
          ...prevState,
          currentPiece: movedPiece
        };
      }
      
      return prevState;
    });
  }, []);

  const rotatePieceClockwise = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || prevState.isPaused || !prevState.currentPiece) {
        return prevState;
      }

      const rotatedPiece = rotatePiece(prevState.currentPiece);
      
      if (isValidPosition(prevState.board, rotatedPiece, rotatedPiece.position)) {
        return {
          ...prevState,
          currentPiece: rotatedPiece
        };
      }
      
      return prevState;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || prevState.isPaused || !prevState.currentPiece) {
        return prevState;
      }

      let droppedPiece = prevState.currentPiece;
      
      // Drop the piece as far as possible
      while (true) {
        const testPiece = movePiece(droppedPiece, 'down');
        if (isValidPosition(prevState.board, testPiece, testPiece.position)) {
          droppedPiece = testPiece;
        } else {
          break;
        }
      }

      // Place the piece immediately
      const newBoard = placePiece(prevState.board, droppedPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const newLines = prevState.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prevState.score + calculateScore(linesCleared, prevState.level);
      
      const newPiece = prevState.nextPiece;
      const nextPiece = getRandomTetromino();
      
      // Check game over
      const gameOver = newPiece ? isGameOver(clearedBoard, newPiece) : true;
      
      return {
        ...prevState,
        board: clearedBoard,
        currentPiece: gameOver ? null : newPiece,
        nextPiece: gameOver ? null : nextPiece,
        score: newScore,
        lines: newLines,
        level: newLevel,
        gameOver
      };
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isPaused: !prevState.isPaused
    }));
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameOver && event.key.toLowerCase() === 'r') {
        initializeGame();
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          movePieceHorizontally('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          movePieceHorizontally('right');
          break;
        case 'ArrowDown':
          event.preventDefault();
          dropPiece();
          break;
        case 'ArrowUp':
          event.preventDefault();
          rotatePieceClockwise();
          break;
        case ' ':
          event.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          togglePause();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          initializeGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, movePieceHorizontally, dropPiece, rotatePieceClockwise, hardDrop, togglePause, initializeGame]);

  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const dropSpeed = getDropSpeed(gameState.level);
    
    gameLoopRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastDropTimeRef.current >= dropSpeed) {
        dropPiece();
        lastDropTimeRef.current = now;
      }
    }, 50);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.gameOver, gameState.isPaused, gameState.level, dropPiece]);

  // Initialize game on first load
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center p-6 min-h-screen bg-gray-900">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-6">Tetris</h1>
        <GameBoard 
          board={gameState.board} 
          currentPiece={gameState.currentPiece} 
        />
      </div>
      
      <div className="flex flex-row lg:flex-col gap-6">
        <NextPiece nextPiece={gameState.nextPiece} />
        <GameInfo 
          score={gameState.score}
          lines={gameState.lines}
          level={gameState.level}
          gameOver={gameState.gameOver}
          isPaused={gameState.isPaused}
        />
      </div>
    </div>
  );
}