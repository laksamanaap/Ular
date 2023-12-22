const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d"); // The 2d

// Detect user key event
const keyPress = (e) => {
  console.log(e.code);
  // When the key
  if (e.code === "ArrowUp" && y_axis !== 10) {
    x_axis = 0;
    y_axis -= 10;
  }

  if (e.code === "ArrowDown" && y_axis !== -10) {
    x_axis = 0;
    y_axis += 10;
  }

  if (e.code === "ArrowLeft" && x_axis !== 10) {
    x_axis -= 10;
    y_axis = 0;
  }

  if (e.code === "ArrowRight" && x_axis !== -10) {
    x_axis += 10;
    y_axis = 0;
  }
};

// Init Key Event
document.addEventListener("keydown", keyPress);

// Init Width and Height
canvas.width = 600;
canvas.height = 500;

// Init Variable
let startCheck = false;
let endCheck = false;
let ender;
let mainTime;
let snake = [{ x: 20, y: 100 }];
let speed = 0.1; // Speed of snake

// Init Snake position
let x_axis = 10;
let y_axis = 0;

// Init Random Food
let x_food;
let y_food;

// Draw Snake
const drawSnake = () => {
  for (let i = 0; i < snake.length; i++) {
    ctx.beginPath();
    ctx.arc(snake[i].x, snake[i].y, 16, 0, Math.PI * 2);
    ctx.fillStyle = "purple";
    ctx.fill();
    ctx.closePath();
  }
};

// Snake Movement
const movement = () => {
  var new_x = snake[0].x + x_axis * speed;
  var new_y = snake[0].y + y_axis * speed;

  snake.unshift({ x: new_x, y: new_y });
  snake.pop();
};

const borderCheck = () => {
  // If hit the walls
  if (
    snake[0].x == 0 ||
    snake[0].x == canvas.width ||
    snake[0].y == 0 ||
    snake[0].y == canvas.height
  ) {
    return true;
  }

  // If overlapping itself
  if (snake.length > 1) {
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
        return true;
        // alert("Game Over!");
      }
    }
  }

  return false;
};

const drawFood = (corx, cory) => {
  ctx.beginPath();
  ctx.arc(corx, cory, 8, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
};

const randomFood = () => {
  x_food = (Math.random() * (canvas.width - 20) + 20) / 10;
  y_food = (Math.random() * (canvas.height - 20) + 20) / 10;
};

// Draw Background
const background = () => {
  ctx.fillStyle = "#37abcb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// Update all
const update = () => {
  if (borderCheck()) {
    cancelAnimationFrame(mainTime);
    return;
  }

  background();
  drawSnake();
  movement();
  drawFood(x_food, y_food);
  mainTime = requestAnimationFrame(update);
};

// Init All Function
mainTime = requestAnimationFrame(update);
randomFood();
