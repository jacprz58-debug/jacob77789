import { useState, useEffect, useRef } from 'react';

export default function BreakoutGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER, WON
  const [score, setScore] = useState(0);

  const ball = useRef({
    x: 300,
    y: 350,
    dx: 4,
    dy: -4,
    radius: 8,
  });

  const paddle = useRef({
    x: 250,
    y: 380,
    width: 100,
    height: 10,
    speed: 8,
    movingLeft: false,
    movingRight: false,
  });

  const bricks = useRef([]);
  const brickRowCount = 5;
  const brickColumnCount = 8;
  const brickWidth = 65;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  const initBricks = () => {
    bricks.current = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks.current[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks.current[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const collisionDetection = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks.current[c][r];
          if (b.status === 1) {
            if (
              ball.current.x > b.x &&
              ball.current.x < b.x + brickWidth &&
              ball.current.y > b.y &&
              ball.current.y < b.y + brickHeight
            ) {
              ball.current.dy = -ball.current.dy;
              b.status = 0;
              setScore(s => s + 1);
              if (score + 1 === brickRowCount * brickColumnCount) {
                setGameState('WON');
              }
            }
          }
        }
      }
    };

    const update = () => {
      if (gameState !== 'PLAYING') return;

      // Paddle movement
      if (paddle.current.movingRight && paddle.current.x < canvas.width - paddle.current.width) {
        paddle.current.x += paddle.current.speed;
      } else if (paddle.current.movingLeft && paddle.current.x > 0) {
        paddle.current.x -= paddle.current.speed;
      }

      // Ball movement
      ball.current.x += ball.current.dx;
      ball.current.y += ball.current.dy;

      // Wall collisions
      if (ball.current.x + ball.current.dx > canvas.width - ball.current.radius || ball.current.x + ball.current.dx < ball.current.radius) {
        ball.current.dx = -ball.current.dx;
      }
      if (ball.current.y + ball.current.dy < ball.current.radius) {
        ball.current.dy = -ball.current.dy;
      } else if (ball.current.y + ball.current.dy > canvas.height - ball.current.radius) {
        if (ball.current.x > paddle.current.x && ball.current.x < paddle.current.x + paddle.current.width) {
          ball.current.dy = -ball.current.dy;
        } else {
          setGameState('GAME_OVER');
        }
      }

      collisionDetection();
      draw();
      animationFrameId = requestAnimationFrame(update);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Bricks
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks.current[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks.current[c][r].x = brickX;
            bricks.current[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = `hsl(${r * 40 + 200}, 70%, 50%)`;
            ctx.fill();
            ctx.closePath();
          }
        }
      }

      // Ball
      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      // Paddle
      ctx.beginPath();
      ctx.rect(paddle.current.x, paddle.current.y, paddle.current.width, paddle.current.height);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
      ctx.closePath();
    };

    if (gameState === 'PLAYING') {
      update();
    } else {
      draw();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, score]);

  const handleStart = () => {
    setScore(0);
    initBricks();
    ball.current = { x: 300, y: 350, dx: 4, dy: -4, radius: 8 };
    paddle.current.x = 250;
    setGameState('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowRight') paddle.current.movingRight = true;
      if (e.code === 'ArrowLeft') paddle.current.movingLeft = true;
      if (e.code === 'Space' && (gameState === 'START' || gameState === 'GAME_OVER' || gameState === 'WON')) {
        handleStart();
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'ArrowRight') paddle.current.movingRight = false;
      if (e.code === 'ArrowLeft') paddle.current.movingLeft = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0c] p-4 font-mono select-none">
      <div className="mb-4 text-indigo-500 font-bold text-xl">
        SCORE: {score}
      </div>

      <canvas
        ref={canvasRef}
        width={640}
        height={400}
        className="bg-[#141418] rounded-xl border border-white/5 shadow-2xl"
      />

      <div className="mt-8 text-center">
        {gameState === 'START' && (
          <div className="animate-bounce text-indigo-400 font-black uppercase italic">
            Press Space to Start
          </div>
        )}
        {gameState === 'GAME_OVER' && (
          <div className="text-center">
            <div className="text-red-500 font-black text-2xl uppercase italic mb-2">GAME OVER</div>
            <div className="text-slate-400 text-sm">Press Space to Restart</div>
          </div>
        )}
        {gameState === 'WON' && (
          <div className="text-center">
            <div className="text-emerald-500 font-black text-2xl uppercase italic mb-2">YOU WON!</div>
            <div className="text-slate-400 text-sm">Press Space to Play Again</div>
          </div>
        )}
        {gameState === 'PLAYING' && (
          <div className="text-slate-600 text-xs uppercase tracking-widest font-bold">
            Use Arrow Keys to Move
          </div>
        )}
      </div>
    </div>
  );
}
