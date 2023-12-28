const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;

let snake = [{ x: 30, y: 100, width: 32, height: 32 }];
let direction = { x: 10, y: 0 };
let speed = 2; // Speed of snake
let eatenFood = false;
let food = {};
let score = 0;
let highScore = 0; // Initialize high score variable

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
    updateScore(); // Update the score display
  }
};

const drawBackground = () => {
  ctx.fillStyle = "#37abcb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const updateGame = () => {
  if (checkCollision()) {
    clearInterval(gameInterval);
    const confirmed = window.confirm(`Game over your score is : ${score}`);

    if (confirmed) {
      window.location.reload();
    } else {
      alert("game over!");
    }

    if (score > highScore) {
      highScore = score;
      updateHighScore(); // Update the high score display
    }
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

const getHighScore = () => {
  return localStorage.getItem("highscore") || 0;
};

const updateHighScore = () => {
  const currentHighScore = getHighScore();
  console.log(currentHighScore);

  if (highScore > currentHighScore) {
    localStorage.setItem("highscore", highScore);
  }

  document.getElementById("game-highscore").innerText =
    "High Score: " + getHighScore();
};

//
document.addEventListener("keydown", (e) => {
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

generateFood();
updateHighScore(); // Update the high score display
const gameInterval = setInterval(updateGame, 1000 / 15);
