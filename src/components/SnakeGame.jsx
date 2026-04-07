import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef();

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 p-4">
      <div className="mb-4 flex justify-between w-full max-w-[400px]">
        <span className="text-xl font-bold text-indigo-400">Score: {score}</span>
        {gameOver && <span className="text-xl font-bold text-red-500">Game Over!</span>}
      </div>
      
      <div 
        className="relative bg-slate-800 border-4 border-slate-700 rounded-lg overflow-hidden"
        style={{ width: '400px', height: '400px' }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-indigo-500 rounded-sm"
            style={{
              width: '18px',
              height: '18px',
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
              opacity: 1 - (i / snake.length) * 0.5
            }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full animate-pulse"
          style={{
            width: '18px',
            height: '18px',
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        />
      </div>

      {gameOver && (
        <button
          onClick={resetGame}
          className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-full font-bold transition-all"
        >
          Play Again
        </button>
      )}
      
      <div className="mt-4 text-slate-500 text-xs text-center">
        Use Arrow Keys to Move
      </div>
    </div>
  );
}
