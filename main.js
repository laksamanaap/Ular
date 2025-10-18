const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const countdownEl = document.getElementById("countdown");

// Set canvas size to fit screen while maintaining aspect ratio
const setCanvasSize = () => {
  const maxWidth = window.innerWidth * 0.9;
  const maxHeight = window.innerHeight * 0.7;
  const aspectRatio = 2;

  if (maxWidth / aspectRatio <= maxHeight) {
    canvas.width = maxWidth;
    canvas.height = maxWidth / aspectRatio;
  } else {
    canvas.height = maxHeight;
    canvas.width = maxHeight * aspectRatio;
  }
};

setCanvasSize();
window.addEventListener("resize", setCanvasSize);

let snake = [{ x: 30, y: 100, width: 32, height: 32 }];
let direction = { x: 10, y: 0 };
let speed = 2;
let eatenFood = false;
let food = {};
let score = 0;
let highScore = 0;
let gameInterval = null;
let gameStarted = false;

const snakeColors = ["orange", "red", "blue", "purple", "green"];

const drawSnake = () => {
  snake.forEach((segment, index) => {
    ctx.fillStyle =
      index === 0 ? snakeColors[0] : snakeColors[index % snakeColors.length];
    ctx.beginPath();
    ctx.arc(
      segment.x + segment.width / 2,
      segment.y + segment.height / 2,
      segment.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  });
};

const moveSnake = () => {
  const newHead = {
    x: snake[0].x + direction.x * speed,
    y: snake[0].y + direction.y * speed,
    width: 32,
    height: 32,
  };

  snake.unshift(newHead);

  if (eatenFood) {
    eatenFood = false;
  } else {
    snake.pop();
  }
};

const checkCollision = () => {
  if (
    snake[0].x < 0 ||
    snake[0].x > canvas.width ||
    snake[0].y < 0 ||
    snake[0].y >= canvas.height
  ) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      return true;
    }
  }

  return false;
};

const drawFood = () => {
  ctx.beginPath();
  ctx.arc(food.x, food.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
};

const generateFood = () => {
  food = {
    x: Math.round((Math.random() * (canvas.width - 20) + 20) / 10) * 10,
    y: Math.round((Math.random() * (canvas.height - 20) + 20) / 10) * 10,
  };
};

const eatFood = () => {
  const distance = Math.sqrt(
    (snake[0].x - food.x) ** 2 + (snake[0].y - food.y) ** 2
  );

  if (distance < 48) {
    snake.unshift({
      x: snake[0].x + direction.x * speed,
      y: snake[0].y + direction.y * speed,
      width: 32,
      height: 32,
    });

    eatenFood = true;
    generateFood();
    score++;
    updateScore();
  }
};

const drawBackground = () => {
  ctx.fillStyle = "#37abcb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const updateGame = () => {
  if (checkCollision()) {
    clearInterval(gameInterval);
    gameStarted = false;

    if (score > highScore) {
      highScore = score;
      updateHighScore();
    }

    setTimeout(() => {
      const confirmed = window.confirm(
        `Game Over! Your score: ${score}\n\nPlay again?`
      );
      if (confirmed) {
        resetGame();
      }
    }, 100);
    return;
  }

  drawBackground();
  drawSnake();
  moveSnake();
  drawFood();
  eatFood();
};

const updateScore = () => {
  document.getElementById("game-score").innerText = "Score: " + score;
};

const updateHighScore = () => {
  document.getElementById("game-highscore").innerText =
    "High Score: " + highScore;
};

const resetGame = () => {
  snake = [{ x: 30, y: 100, width: 32, height: 32 }];
  direction = { x: 10, y: 0 };
  score = 0;
  updateScore();
  startScreen.classList.remove("hidden");
};

const startCountdown = () => {
  let count = 3;
  countdownEl.textContent = count;
  countdownEl.classList.add("show");

  const countInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
      countdownEl.classList.remove("show");
      setTimeout(() => countdownEl.classList.add("show"), 10);
    } else {
      countdownEl.textContent = "GO!";
      countdownEl.classList.remove("show");
      setTimeout(() => countdownEl.classList.add("show"), 10);

      setTimeout(() => {
        countdownEl.classList.remove("show");
        startGame();
      }, 1000);

      clearInterval(countInterval);
    }
  }, 1000);
};

const startGame = () => {
  gameStarted = true;
  generateFood();
  gameInterval = setInterval(updateGame, 1000 / 15);
};

startButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  startCountdown();
});

document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;

  if (e.code === "ArrowUp" && direction.y !== 10) {
    direction = { x: 0, y: -10 };
  } else if (e.code === "ArrowDown" && direction.y !== -10) {
    direction = { x: 0, y: 10 };
  } else if (e.code === "ArrowLeft" && direction.x !== 10) {
    direction = { x: -10, y: 0 };
  } else if (e.code === "ArrowRight" && direction.x !== -10) {
    direction = { x: 10, y: 0 };
  }
});

updateHighScore();
