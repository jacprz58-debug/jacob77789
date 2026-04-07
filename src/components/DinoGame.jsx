import { useState, useEffect, useRef } from 'react';

export default function DinoGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const dino = useRef({
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    dy: 0,
    jumpForce: 12,
    gravity: 0.6,
    grounded: false,
  });

  const obstacles = useRef([]);
  const frameCount = useRef(0);
  const gameSpeed = useRef(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const spawnObstacle = () => {
      const type = Math.random() > 0.5 ? 'cactus' : 'bird';
      obstacles.current.push({
        x: canvas.width,
        y: type === 'cactus' ? 160 : 100,
        width: 20,
        height: type === 'cactus' ? 30 : 20,
        type: type,
      });
    };

    const update = () => {
      if (gameState !== 'PLAYING') return;

      frameCount.current++;
      if (frameCount.current % 100 === 0) {
        spawnObstacle();
        gameSpeed.current += 0.1;
      }

      // Dino physics
      dino.current.dy += dino.current.gravity;
      dino.current.y += dino.current.dy;

      if (dino.current.y > 150) {
        dino.current.y = 150;
        dino.current.dy = 0;
        dino.current.grounded = true;
      } else {
        dino.current.grounded = false;
      }

      // Obstacles
      obstacles.current.forEach((obs, index) => {
        obs.x -= gameSpeed.current;

        // Collision detection
        if (
          dino.current.x < obs.x + obs.width &&
          dino.current.x + dino.current.width > obs.x &&
          dino.current.y < obs.y + obs.height &&
          dino.current.y + dino.current.height > obs.y
        ) {
          setGameState('GAME_OVER');
        }

        if (obs.x + obs.width < 0) {
          obstacles.current.splice(index, 1);
          setScore(s => s + 1);
        }
      });

      draw();
      animationFrameId = requestAnimationFrame(update);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.strokeStyle = '#555';
      ctx.beginPath();
      ctx.moveTo(0, 190);
      ctx.lineTo(canvas.width, 190);
      ctx.stroke();

      // Dino
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(dino.current.x, dino.current.y, dino.current.width, dino.current.height);
      
      // Dino Eye
      ctx.fillStyle = 'white';
      ctx.fillRect(dino.current.x + 25, dino.current.y + 10, 5, 5);

      // Obstacles
      ctx.fillStyle = '#ef4444';
      obstacles.current.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });
    };

    if (gameState === 'PLAYING') {
      update();
    } else {
      draw();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  const handleJump = () => {
    if (gameState === 'START' || gameState === 'GAME_OVER') {
      setScore(0);
      obstacles.current = [];
      gameSpeed.current = 5;
      frameCount.current = 0;
      setGameState('PLAYING');
      return;
    }

    if (dino.current.grounded) {
      dino.current.dy = -dino.current.jumpForce;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0c] p-4 font-mono select-none" onClick={handleJump}>
      <div className="mb-4 flex justify-between w-full max-w-[600px] text-indigo-500 font-bold">
        <span>HI: {highScore.toString().padStart(5, '0')}</span>
        <span>SCORE: {score.toString().padStart(5, '0')}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="bg-[#141418] rounded-xl border border-white/5 shadow-2xl cursor-pointer"
      />

      <div className="mt-8 text-center">
        {gameState === 'START' && (
          <div className="animate-bounce text-indigo-400 font-black uppercase italic">
            Press Space or Click to Start
          </div>
        )}
        {gameState === 'GAME_OVER' && (
          <div className="text-center">
            <div className="text-red-500 font-black text-2xl uppercase italic mb-2">GAME OVER</div>
            <div className="text-slate-400 text-sm">Press Space to Restart</div>
          </div>
        )}
        {gameState === 'PLAYING' && (
          <div className="text-slate-600 text-xs uppercase tracking-widest font-bold">
            Jump over the obstacles!
          </div>
        )}
      </div>
    </div>
  );
}
