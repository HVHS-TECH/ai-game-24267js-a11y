console.log("Game code is running");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const GRAVITY = 0.45;
const FLAP = -7;
const PIPE_WIDTH = 70;
const PIPE_GAP = 170;
const PIPE_SPEED = 2.5;

let gameState = "start";
let score = 0;
let bestScore = 0;

const bird = {
  x: 80,
  y: HEIGHT / 2,
  width: 34,
  height: 34,
  velocity: 0
};

let pipes = [];

function resetGame() {
  bird.y = HEIGHT / 2;
  bird.velocity = 0;

  pipes = [];
  score = 0;

  gameState = "playing";
}

function createPipe() {
  const topHeight = Math.random() * 250 + 50;

  pipes.push({
    x: WIDTH,
    top: topHeight,
    bottom: HEIGHT - topHeight - PIPE_GAP,
    scored: false
  });
}

function update() {
  if (gameState !== "playing") return;

  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  if (bird.y + bird.height > HEIGHT) {
    endGame();
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    const p = pipes[i];

    p.x -= PIPE_SPEED;

    if (!p.scored && p.x + PIPE_WIDTH < bird.x) {
      p.scored = true;
      score++;

      if (score > bestScore) {
        bestScore = score;
      }
    }

    if (p.x + PIPE_WIDTH < 0) {
      pipes.splice(i, 1);
      continue;
    }

    if (
      bird.x < p.x + PIPE_WIDTH &&
      bird.x + bird.width > p.x &&
      (
        bird.y < p.top ||
        bird.y + bird.height > HEIGHT - p.bottom
      )
    ) {
      endGame();
    }
  }
}

function endGame() {
  gameState = "gameover";
}

function drawBird() {
  ctx.fillStyle = "yellow";

  ctx.beginPath();
  ctx.arc(
    bird.x + bird.width / 2,
    bird.y + bird.height / 2,
    bird.width / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = "green";

  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, PIPE_WIDTH, p.top);

    ctx.fillRect(
      p.x,
      HEIGHT - p.bottom,
      PIPE_WIDTH,
      p.bottom
    );
  });
}

function drawText() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.textAlign = "center";

  if (gameState === "start") {
    ctx.font = "40px Arial";
    ctx.strokeText("Press SPACE", WIDTH / 2, 300);
    ctx.fillText("Press SPACE", WIDTH / 2, 300);
  }

  if (gameState === "playing") {
    ctx.font = "50px Arial";
    ctx.strokeText(score, WIDTH / 2, 80);
    ctx.fillText(score, WIDTH / 2, 80);
  }

  if (gameState === "gameover") {
    ctx.font = "40px Arial";
    ctx.strokeText("Game Over", WIDTH / 2, 220);
    ctx.fillText("Game Over", WIDTH / 2, 220);

    ctx.font = "25px Arial";
    ctx.strokeText("Score: " + score, WIDTH / 2, 300);
    ctx.fillText("Score: " + score, WIDTH / 2, 300);

    ctx.strokeText("Best: " + bestScore, WIDTH / 2, 340);
    ctx.fillText("Best: " + bestScore, WIDTH / 2, 340);

    ctx.font = "20px Arial";
    ctx.strokeText("Press SPACE to Restart", WIDTH / 2, 420);
    ctx.fillText("Press SPACE to Restart", WIDTH / 2, 420);
  }
}

function render() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawPipes();
  drawBird();
  drawText();
}

function gameLoop() {
  update();
  render();

  requestAnimationFrame(gameLoop);
}

setInterval(() => {
  if (gameState === "playing") {
    createPipe();
  }
}, 1400);

function handleInput() {
  if (gameState === "start") {
    resetGame();
    bird.velocity = FLAP;
    return;
  }

  if (gameState === "playing") {
    bird.velocity = FLAP;
    return;
  }

  if (gameState === "gameover") {
    resetGame();
    bird.velocity = FLAP;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    handleInput();
  }
});

gameLoop();