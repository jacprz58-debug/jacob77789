import { useState, useEffect, useCallback } from 'react';
import { Flag, Bomb, RefreshCw } from 'lucide-react';

const GRID_SIZE = 10;
const MINES_COUNT = 15;

export default function MinesweeperGame() {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagsUsed, setFlagsUsed] = useState(0);

  const initGrid = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0,
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < GRID_SIZE && c + j >= 0 && c + j < GRID_SIZE) {
                if (newGrid[r + i][c + j].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborCount = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setFlagsUsed(0);
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const revealCell = (r, c) => {
    if (gameOver || win || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    const newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[r][c].isMine) {
      // Game Over: Reveal all mines
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    const revealRecursive = (row, col) => {
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      
      newGrid[row][col].isRevealed = true;
      
      if (newGrid[row][col].neighborCount === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealRecursive(row + i, col + j);
          }
        }
      }
    };

    revealRecursive(r, c);
    setGrid(newGrid);

    // Check Win
    const hiddenNonMines = newGrid.flat().filter(cell => !cell.isMine && !cell.isRevealed).length;
    if (hiddenNonMines === 0) {
      setWin(true);
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    const isFlagged = !newGrid[r][c].isFlagged;
    newGrid[r][c].isFlagged = isFlagged;
    setGrid(newGrid);
    setFlagsUsed(prev => isFlagged ? prev + 1 : prev - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0c] p-4 font-mono select-none">
      <div className="mb-6 flex items-center gap-8 text-indigo-400 font-bold">
        <div className="flex items-center gap-2">
          <Bomb className="w-4 h-4" />
          <span>{MINES_COUNT - flagsUsed}</span>
        </div>
        <button 
          onClick={initGrid}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${gameOver ? 'text-red-500' : win ? 'text-emerald-500' : 'text-indigo-400'}`} />
        </button>
        <div className="text-sm">
          {gameOver ? 'BOOM!' : win ? 'CLEAR!' : 'ACTIVE'}
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1 bg-white/5 p-2 rounded-xl border border-white/10 shadow-2xl">
        {grid.map((row, r) => (
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={(e) => toggleFlag(e, r, c)}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md text-sm font-black cursor-pointer transition-all duration-200 ${
                cell.isRevealed 
                ? cell.isMine ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-slate-300'
                : 'bg-white/5 hover:bg-white/20 text-transparent border border-white/5'
              }`}
            >
              {cell.isRevealed ? (
                cell.isMine ? <Bomb className="w-4 h-4" /> : (cell.neighborCount > 0 ? cell.neighborCount : '')
              ) : (
                cell.isFlagged ? <Flag className="w-4 h-4 text-orange-500" /> : ''
              )}
            </div>
          ))
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-2">
          Left Click to Reveal • Right Click to Flag
        </div>
        {gameOver && <div className="text-red-500 font-black animate-pulse">MISSION FAILED</div>}
        {win && <div className="text-emerald-500 font-black animate-bounce">SECTOR SECURED</div>}
      </div>
    </div>
  );
}
