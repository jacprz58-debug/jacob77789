import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 4;

export default function Game2048() {
  const [grid, setGrid] = useState(() => {
    const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    return addRandomTile(addRandomTile(initialGrid));
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function addRandomTile(currentGrid) {
    const emptyCells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return currentGrid;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }

  const move = useCallback((direction) => {
    if (gameOver) return;

    let moved = false;
    let newScore = score;
    let newGrid = grid.map(row => [...row]);

    const rotate = (g) => g[0].map((_, i) => g.map(row => row[i]).reverse());

    // Normalize direction to "left"
    let rotations = 0;
    if (direction === 'up') rotations = 1;
    else if (direction === 'right') rotations = 2;
    else if (direction === 'down') rotations = 3;

    for (let i = 0; i < rotations; i++) newGrid = rotate(newGrid);

    // Slide and merge left
    for (let r = 0; r < GRID_SIZE; r++) {
      let row = newGrid[r].filter(val => val !== 0);
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          newScore += row[i];
          row.splice(i + 1, 1);
          moved = true;
        }
      }
      const newRow = row.concat(Array(GRID_SIZE - row.length).fill(0));
      if (JSON.stringify(newGrid[r]) !== JSON.stringify(newRow)) moved = true;
      newGrid[r] = newRow;
    }

    // Rotate back
    for (let i = 0; i < (4 - rotations) % 4; i++) newGrid = rotate(newGrid);

    if (moved) {
      const gridWithNewTile = addRandomTile(newGrid);
      setGrid(gridWithNewTile);
      setScore(newScore);
      
      // Check game over
      let canMove = false;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (gridWithNewTile[r][c] === 0) canMove = true;
          if (r < GRID_SIZE - 1 && gridWithNewTile[r][c] === gridWithNewTile[r + 1][c]) canMove = true;
          if (c < GRID_SIZE - 1 && gridWithNewTile[r][c] === gridWithNewTile[r][c + 1]) canMove = true;
        }
      }
      if (!canMove) setGameOver(true);
    }
  }, [grid, score, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') move('left');
      else if (e.key === 'ArrowRight') move('right');
      else if (e.key === 'ArrowUp') move('up');
      else if (e.key === 'ArrowDown') move('down');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const reset = () => {
    const initialGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    setGrid(addRandomTile(addRandomTile(initialGrid)));
    setScore(0);
    setGameOver(false);
  };

  const getTileColor = (val) => {
    const colors = {
      0: 'bg-slate-700/50',
      2: 'bg-slate-200 text-slate-900',
      4: 'bg-slate-100 text-slate-900',
      8: 'bg-orange-200 text-slate-900',
      16: 'bg-orange-300 text-white',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-yellow-200 text-slate-900',
      256: 'bg-yellow-300 text-slate-900',
      512: 'bg-yellow-400 text-white',
      1024: 'bg-yellow-500 text-white',
      2048: 'bg-yellow-600 text-white shadow-[0_0_20px_rgba(234,179,8,0.5)]',
    };
    return colors[val] || 'bg-slate-900 text-white';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 p-4 select-none">
      <div className="mb-6 flex justify-between w-full max-w-[320px] items-center">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-white">2048</span>
          <span className="text-xs text-slate-400">Join the numbers!</span>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Score</div>
          <div className="text-xl font-bold text-indigo-400">{score}</div>
        </div>
      </div>

      <div className="bg-slate-800 p-2 rounded-xl border-4 border-slate-700 shadow-2xl">
        <div className="grid grid-cols-4 gap-2">
          {grid.map((row, r) => (
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl font-bold rounded-lg transition-all duration-100 ${getTileColor(val)}`}
              >
                {val !== 0 ? val : ''}
              </div>
            ))
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="mt-6 text-center">
          <div className="text-2xl font-bold text-red-500 mb-2">Game Over!</div>
          <button
            onClick={reset}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="mt-8 text-slate-500 text-xs text-center max-w-[300px]">
        Use your <span className="text-slate-300 font-bold">Arrow Keys</span> to move the tiles. When two tiles with the same number touch, they <span className="text-slate-300 font-bold">merge into one!</span>
      </div>
    </div>
  );
}
