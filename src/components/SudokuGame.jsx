import { useState, useEffect } from 'react';

export default function SudokuGame() {
  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  const generateSudoku = () => {
    // Simple Sudoku generator (not perfect but functional for a built-in)
    const newGrid = Array(9).fill(0).map(() => Array(9).fill(0));
    
    // Fill diagonal 3x3 blocks
    for (let i = 0; i < 9; i += 3) {
      fillBox(newGrid, i, i);
    }
    
    solveSudoku(newGrid);
    
    // Remove numbers to create the puzzle
    const puzzle = newGrid.map(row => [...row]);
    let count = 40; // Number of cells to remove
    while (count > 0) {
      let r = Math.floor(Math.random() * 9);
      let c = Math.floor(Math.random() * 9);
      if (puzzle[r][c] !== 0) {
        puzzle[r][c] = 0;
        count--;
      }
    }
    
    setGrid(puzzle);
    setInitialGrid(puzzle.map(row => [...row]));
    setMessage('');
  };

  const fillBox = (grid, row, col) => {
    let num;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        do {
          num = Math.floor(Math.random() * 9) + 1;
        } while (!isSafeInBox(grid, row, col, num));
        grid[row + i][col + j] = num;
      }
    }
  };

  const isSafeInBox = (grid, rowStart, colStart, num) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[rowStart + i][colStart + j] === num) return false;
      }
    }
    return true;
  };

  const solveSudoku = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveSudoku(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const isSafe = (grid, row, col, num) => {
    for (let x = 0; x < 9; x++) if (grid[row][x] === num) return false;
    for (let x = 0; x < 9; x++) if (grid[x][col] === num) return false;
    let startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    generateSudoku();
  }, []);

  const handleCellClick = (r, c) => {
    if (initialGrid[r][c] === 0) {
      setSelected({ r, c });
    }
  };

  const handleNumberInput = (num) => {
    if (selected) {
      const newGrid = grid.map(row => [...row]);
      newGrid[selected.r][selected.c] = num;
      setGrid(newGrid);
    }
  };

  const checkSolution = () => {
    const tempGrid = grid.map(row => [...row]);
    if (solveSudoku(tempGrid)) {
      // This is a bit lazy, should actually check if current grid is valid and full
      let full = true;
      for(let r=0; r<9; r++) for(let c=0; c<9; c++) if(grid[r][c] === 0) full = false;
      
      if (!full) {
        setMessage('Keep going!');
        return;
      }

      // Check validity
      let valid = true;
      for(let r=0; r<9; r++) {
        for(let c=0; c<9; c++) {
          let n = grid[r][c];
          grid[r][c] = 0;
          if (!isSafe(grid, r, c, n)) valid = false;
          grid[r][c] = n;
        }
      }
      
      if (valid) setMessage('Correct! You win!');
      else setMessage('Something is wrong. Check your numbers.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0c] p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Sudoku</h2>
        <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Built-in • Unblockable</p>
      </div>

      <div className="grid grid-cols-9 gap-0 border-2 border-indigo-500/50 bg-indigo-900/10">
        {grid.map((row, r) => (
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-white/5 text-sm font-bold cursor-pointer transition-all
                ${initialGrid[r][c] !== 0 ? 'text-slate-500 bg-white/5' : 'text-white hover:bg-indigo-500/20'}
                ${selected?.r === r && selected?.c === c ? 'bg-indigo-600/40 border-indigo-500' : ''}
                ${(r + 1) % 3 === 0 && r < 8 ? 'border-b-2 border-b-indigo-500/50' : ''}
                ${(c + 1) % 3 === 0 && c < 8 ? 'border-r-2 border-r-indigo-500/50' : ''}
              `}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))
        ))}
      </div>

      <div className="mt-8 grid grid-cols-5 sm:grid-cols-10 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberInput(num)}
            className="w-10 h-10 bg-white/5 hover:bg-indigo-600 text-white rounded-lg font-bold transition-all border border-white/10"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => handleNumberInput(0)}
          className="w-10 h-10 bg-white/5 hover:bg-red-600 text-white rounded-lg font-bold transition-all border border-white/10"
        >
          C
        </button>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={generateSudoku}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
        >
          New Game
        </button>
        <button
          onClick={checkSolution}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          Check
        </button>
      </div>

      {message && (
        <div className="mt-4 text-indigo-400 font-bold animate-pulse">
          {message}
        </div>
      )}
    </div>
  );
}
