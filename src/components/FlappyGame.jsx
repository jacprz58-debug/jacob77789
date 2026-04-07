import { useState, useEffect, useRef, useCallback } from 'react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -8;
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 1500;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;

export default function FlappyGame() {
  const [birdY, setBirdY] = useState(CANVAS_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const requestRef = useRef();
  const lastPipeTime = useRef(0);

  const jump = useCallback(() => {
    if (gameOver) {
      resetGame();
      return;
    }
    if (!gameStarted) setGameStarted(true);
    setBirdVelocity(JUMP_STRENGTH);
  }, [gameOver, gameStarted]);

  const resetGame = () => {
    setBirdY(CANVAS_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    lastPipeTime.current = 0;
  };

  const update = useCallback((time) => {
    if (!gameStarted || gameOver) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    setBirdY((y) => {
      const newY = y + birdVelocity;
      if (newY < 0 || newY > CANVAS_HEIGHT - 30) {
        setGameOver(true);
        return y;
      }
      return newY;
    });
    setBirdVelocity((v) => v + GRAVITY);

    if (time - lastPipeTime.current > PIPE_SPAWN_RATE) {
      const minPipeHeight = 50;
      const maxPipeHeight = CANVAS_HEIGHT - PIPE_GAP - minPipeHeight;
      const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
      
      setPipes((p) => [...p, { x: CANVAS_WIDTH, topHeight, passed: false }]);
      lastPipeTime.current = time;
    }

    setPipes((prevPipes) => {
      const newPipes = prevPipes
        .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
        .filter((pipe) => pipe.x + PIPE_WIDTH > 0);

      newPipes.forEach((pipe) => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
          pipe.passed = true;
          setScore((s) => s + 1);
        }

        // Collision detection
        const birdRect = { left: 50, right: 80, top: birdY, bottom: birdY + 30 };
        const topPipeRect = { left: pipe.x, right: pipe.x + PIPE_WIDTH, top: 0, bottom: pipe.topHeight };
        const bottomPipeRect = { left: pipe.x, right: pipe.x + PIPE_WIDTH, top: pipe.topHeight + PIPE_GAP, bottom: CANVAS_HEIGHT };

        if (
          (birdRect.right > topPipeRect.left && birdRect.left < topPipeRect.right && birdRect.top < topPipeRect.bottom) ||
          (birdRect.right > bottomPipeRect.left && birdRect.left < bottomPipeRect.right && birdRect.bottom > bottomPipeRect.top)
        ) {
          setGameOver(true);
        }
      });

      return newPipes;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [birdY, birdVelocity, gameStarted, gameOver]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') jump();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  return (
    <div 
      className="flex flex-col items-center justify-center h-full bg-sky-400 p-4 relative overflow-hidden select-none cursor-pointer"
      onClick={jump}
    >
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <span className="text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">{score}</span>
      </div>

      <div className="relative w-[400px] h-[500px] bg-sky-300 border-4 border-white/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Bird */}
        <div 
          className="absolute left-[50px] w-8 h-8 bg-yellow-400 border-2 border-black rounded-lg transition-transform"
          style={{ 
            top: `${birdY}px`,
            transform: `rotate(${birdVelocity * 3}deg)`
          }}
        >
          <div className="absolute top-1 right-1 w-2 h-2 bg-white border border-black rounded-full" />
          <div className="absolute top-4 right-0 w-4 h-2 bg-orange-500 border border-black rounded-sm" />
        </div>

        {/* Pipes */}
        {pipes.map((pipe, i) => (
          <div key={i}>
            {/* Top Pipe */}
            <div 
              className="absolute bg-emerald-500 border-x-4 border-b-4 border-black/20"
              style={{ left: `${pipe.x}px`, top: 0, width: `${PIPE_WIDTH}px`, height: `${pipe.topHeight}px` }}
            />
            {/* Bottom Pipe */}
            <div 
              className="absolute bg-emerald-500 border-x-4 border-t-4 border-black/20"
              style={{ left: `${pipe.x}px`, top: `${pipe.topHeight + PIPE_GAP}px`, width: `${PIPE_WIDTH}px`, height: `${CANVAS_HEIGHT - (pipe.topHeight + PIPE_GAP)}px` }}
            />
          </div>
        ))}

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="bg-white p-6 rounded-3xl shadow-xl text-center">
              <h2 className="text-2xl font-bold text-sky-600 mb-2">FLAPPY BIRD</h2>
              <p className="text-slate-500 text-sm">Press Space or Click to Jump</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/20 backdrop-blur-[2px]">
            <div className="bg-white p-8 rounded-3xl shadow-2xl text-center scale-110">
              <h2 className="text-3xl font-black text-red-600 mb-1">GAME OVER</h2>
              <div className="text-slate-400 text-xs uppercase font-bold mb-4 tracking-widest">Score: {score}</div>
              <button 
                onClick={(e) => { e.stopPropagation(); resetGame(); }}
                className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-sky-500/30"
              >
                RESTART
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/30">
          SPACE TO JUMP
        </div>
      </div>
    </div>
  );
}
