import { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 25;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
];

const COLORS = [
  '#00f0f0', // cyan
  '#f0f000', // yellow
  '#a000f0', // purple
  '#f0a000', // orange
  '#0000f0', // blue
  '#00f000', // green
  '#f00000', // red
];

export default function TetrisGame() {
  const [grid, setGrid] = useState(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
  const [activePiece, setActivePiece] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef();

  const spawnPiece = useCallback(() => {
    const typeIdx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[typeIdx];
    const color = COLORS[typeIdx];
    const piece = {
      shape,
      color,
      pos: { x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 }
    };
    
    if (checkCollision(piece.pos, piece.shape, grid)) {
      setGameOver(true);
      return null;
    }
    return piece;
  }, [grid]);

  const checkCollision = (pos, shape, currentGrid) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && currentGrid[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotatePiece = (shape) => {
    const newShape = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
    return newShape;
  };

  const movePiece = (dx, dy) => {
    if (!activePiece || gameOver || isPaused) return;
    const newPos = { x: activePiece.pos.x + dx, y: activePiece.pos.y + dy };
    if (!checkCollision(newPos, activePiece.shape, grid)) {
      setActivePiece({ ...activePiece, pos: newPos });
      return true;
    }
    return false;
  };

  const dropPiece = useCallback(() => {
    if (!activePiece || gameOver || isPaused) return;
    if (!movePiece(0, 1)) {
      // Lock piece
      const newGrid = grid.map(row => [...row]);
      activePiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const gridY = activePiece.pos.y + y;
            const gridX = activePiece.pos.x + x;
            if (gridY >= 0) newGrid[gridY][gridX] = activePiece.color;
          }
        });
      });

      // Clear lines
      let linesCleared = 0;
      const filteredGrid = newGrid.filter(row => {
        const isFull = row.every(cell => cell !== 0);
        if (isFull) linesCleared++;
        return !isFull;
      });
      
      while (filteredGrid.length < ROWS) {
        filteredGrid.unshift(Array(COLS).fill(0));
      }
      
      setGrid(filteredGrid);
      setScore(s => s + (linesCleared * 100));
      setActivePiece(spawnPiece());
    }
  }, [activePiece, grid, gameOver, isPaused, spawnPiece]);

  useEffect(() => {
    if (!activePiece && !gameOver) {
      setActivePiece(spawnPiece());
    }
  }, [activePiece, gameOver, spawnPiece]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(dropPiece, 800 - Math.min(score / 2, 600));
    }
    return () => clearInterval(gameLoopRef.current);
  }, [dropPiece, gameOver, isPaused, score]);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') movePiece(-1, 0);
      if (e.key === 'ArrowRight') movePiece(1, 0);
      if (e.key === 'ArrowDown') dropPiece();
      if (e.key === 'ArrowUp') {
        const rotated = rotatePiece(activePiece.shape);
        if (!checkCollision(activePiece.pos, rotated, grid)) {
          setActivePiece({ ...activePiece, shape: rotated });
        }
      }
      if (e.key === ' ') {
        let newY = activePiece.pos.y;
        while (!checkCollision({ x: activePiece.pos.x, y: newY + 1 }, activePiece.shape, grid)) {
          newY++;
        }
        setActivePiece({ ...activePiece, pos: { ...activePiece.pos, y: newY } });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activePiece, grid, gameOver, dropPiece]);

  const resetGame = () => {
    setGrid(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
    setScore(0);
    setGameOver(false);
    setActivePiece(null);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0c] p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Tetris</h2>
        <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Built-in • Unblockable</p>
      </div>

      <div className="flex gap-8">
        <div 
          className="relative border-4 border-indigo-500/50 bg-indigo-900/10 overflow-hidden"
          style={{ width: COLS * BLOCK_SIZE, height: ROWS * BLOCK_SIZE }}
        >
          {grid.map((row, y) => (
            row.map((cell, x) => (
              cell !== 0 && (
                <div
                  key={`${y}-${x}`}
                  className="absolute border border-black/20"
                  style={{
                    width: BLOCK_SIZE,
                    height: BLOCK_SIZE,
                    left: x * BLOCK_SIZE,
                    top: y * BLOCK_SIZE,
                    backgroundColor: cell,
                    boxShadow: 'inset 0 0 8px rgba(255,255,255,0.3)'
                  }}
                />
              )
            ))
          ))}
          
          {activePiece && activePiece.shape.map((row, y) => (
            row.map((value, x) => (
              value && (
                <div
                  key={`active-${y}-${x}`}
                  className="absolute border border-black/20"
                  style={{
                    width: BLOCK_SIZE,
                    height: BLOCK_SIZE,
                    left: (activePiece.pos.x + x) * BLOCK_SIZE,
                    top: (activePiece.pos.y + y) * BLOCK_SIZE,
                    backgroundColor: activePiece.color,
                    boxShadow: 'inset 0 0 8px rgba(255,255,255,0.3)'
                  }}
                />
              )
            ))
          ))}

          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
              <h3 className="text-2xl font-black text-red-500 uppercase italic mb-2">Game Over</h3>
              <p className="text-white font-bold mb-4">Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Score</div>
            <div className="text-2xl font-black text-white">{score}</div>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Controls</div>
            <div className="space-y-2 text-[10px] text-slate-400 font-bold uppercase">
              <div className="flex justify-between"><span>Move</span> <span>Arrows</span></div>
              <div className="flex justify-between"><span>Rotate</span> <span>Up</span></div>
              <div className="flex justify-between"><span>Drop</span> <span>Space</span></div>
            </div>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
