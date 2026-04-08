import { useState, useEffect, useCallback } from 'react';

// Simple Chess implementation (just the board and movement logic, no AI)
const INITIAL_BOARD = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const PIECES = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

export default function ChessGame() {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState('white'); // 'white' or 'black'
  const [history, setHistory] = useState([]);

  const isWhite = (piece) => piece && piece === piece.toUpperCase();
  const isBlack = (piece) => piece && piece === piece.toLowerCase();

  const handleSquareClick = (r, c) => {
    const piece = board[r][c];

    if (selected) {
      // Try to move
      if (selected.r === r && selected.c === c) {
        setSelected(null);
        return;
      }

      // Basic move logic (very simplified)
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = board[selected.r][selected.c];
      newBoard[selected.r][selected.c] = null;
      
      setBoard(newBoard);
      setTurn(turn === 'white' ? 'black' : 'white');
      setSelected(null);
      setHistory([...history, { from: selected, to: { r, c }, piece: board[selected.r][selected.c] }]);
    } else {
      // Select piece
      if (piece && ((turn === 'white' && isWhite(piece)) || (turn === 'black' && isBlack(piece)))) {
        setSelected({ r, c });
      }
    }
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setSelected(null);
    setTurn('white');
    setHistory([]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0c] p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Chess</h2>
        <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Built-in • Unblockable</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="grid grid-cols-8 border-4 border-indigo-500/50 shadow-2xl">
          {board.map((row, r) => (
            row.map((piece, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => handleSquareClick(r, c)}
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-3xl cursor-pointer transition-all
                  ${(r + c) % 2 === 0 ? 'bg-[#ebecd0]' : 'bg-[#779556]'}
                  ${selected?.r === r && selected?.c === c ? 'ring-4 ring-yellow-400 ring-inset' : ''}
                `}
              >
                <span className={isWhite(piece) ? 'text-white drop-shadow-md' : 'text-black'}>
                  {PIECES[piece] || ''}
                </span>
              </div>
            ))
          ))}
        </div>

        <div className="flex flex-col gap-4 w-full md:w-48">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Turn</div>
            <div className={`text-xl font-black uppercase italic ${turn === 'white' ? 'text-white' : 'text-indigo-400'}`}>
              {turn}
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex-1 overflow-y-auto max-h-48">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">History</div>
            <div className="space-y-1">
              {history.slice(-5).map((move, i) => (
                <div key={i} className="text-[10px] text-slate-400 font-bold uppercase">
                  {move.piece} to {String.fromCharCode(97 + move.to.c)}{8 - move.to.r}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={resetGame}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}
