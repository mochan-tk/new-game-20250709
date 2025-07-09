import { 
  TetrominoType, 
  Tetromino, 
  GameState, 
  Position,
  TETROMINO_SHAPES, 
  BOARD_WIDTH, 
  BOARD_HEIGHT 
} from '@/types/tetris';

export function createEmptyBoard(): number[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
}

export function getRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    type,
    shape: TETROMINO_SHAPES[type][0],
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    rotation: 0
  };
}

export function isValidPosition(
  board: number[][],
  piece: Tetromino,
  position: Position
): boolean {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] !== 0) {
        const x = position.x + col;
        const y = position.y + row;
        
        // Check boundaries
        if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
          return false;
        }
        
        // Check collision with existing pieces (but allow y < 0 for spawning)
        if (y >= 0 && board[y][x] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

export function rotatePiece(piece: Tetromino): Tetromino {
  const shapes = TETROMINO_SHAPES[piece.type];
  const nextRotation = (piece.rotation + 1) % shapes.length;
  
  return {
    ...piece,
    shape: shapes[nextRotation],
    rotation: nextRotation
  };
}

export function placePiece(board: number[][], piece: Tetromino): number[][] {
  const newBoard = board.map(row => [...row]);
  
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] !== 0) {
        const x = piece.position.x + col;
        const y = piece.position.y + row;
        
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          // Use different numbers for different tetromino types for color coding
          const typeValue = piece.type === 'I' ? 1 
            : piece.type === 'O' ? 2 
            : piece.type === 'T' ? 3
            : piece.type === 'S' ? 4
            : piece.type === 'Z' ? 5
            : piece.type === 'J' ? 6
            : 7; // L
          newBoard[y][x] = typeValue;
        }
      }
    }
  }
  
  return newBoard;
}

export function clearLines(board: number[][]): { newBoard: number[][]; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  
  // Add empty lines at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  
  return { newBoard, linesCleared };
}

export function calculateScore(linesCleared: number, level: number): number {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
}

export function calculateLevel(totalLines: number): number {
  return Math.floor(totalLines / 10);
}

export function getDropSpeed(level: number): number {
  // Returns milliseconds between drops
  return Math.max(50, 1000 - (level * 50));
}

export function isGameOver(board: number[][], newPiece: Tetromino): boolean {
  return !isValidPosition(board, newPiece, newPiece.position);
}

export function movePiece(
  piece: Tetromino,
  direction: 'left' | 'right' | 'down'
): Tetromino {
  const newPosition: Position = { ...piece.position };
  
  switch (direction) {
    case 'left':
      newPosition.x--;
      break;
    case 'right':
      newPosition.x++;
      break;
    case 'down':
      newPosition.y++;
      break;
  }
  
  return {
    ...piece,
    position: newPosition
  };
}