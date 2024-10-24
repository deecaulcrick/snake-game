const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

// game settings
const tileSize = 20;
let snake = [{ x: 200, y: 200 }]; //initial snake position
let direction = { x: 0, y: 0 }; //initial movement direction
let food = getRandomFoodPosition(); //food position
let score = 0;
let gameOver = false;

// listen for keypresses to change direction
window.addEventListener("keydown", changeDirection);

// start the game loop
let gameLoop = setInterval(updateGame, 200);

// draw the game board, snake and food
function updateGame() {
  if (gameOver) return endGame();

  moveSnake();

  if (checkCollision()) {
    gameOver = true;
  }
  if (snakeEatsFood()) {
    score++;
    document.querySelector(".score").innerText = `Score: ${score}`;
    food = getRandomFoodPosition();
    growSnake();
  }
  drawGame();
}

//  draw everything on the canvas
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, tileSize, tileSize);

  ctx.fillStyle = "#29f63e";
  snake.forEach((segment) =>
    ctx.fillRect(segment.x, segment.y, tileSize, tileSize)
  );
}

function moveSnake() {
  const head = {
    x: snake[0].x + direction.x * tileSize,
    y: snake[0].y + direction.y * tileSize,
  };
  snake.unshift(head);
  snake.pop();
}

function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;

    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;

    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;

    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

// check if snake eats th food
function snakeEatsFood() {
  return snake[0].x === food.x && snake[0].y === food.y;
}

// grow the snake
function growSnake() {
  const tail = snake[snake.length - 1];
  snake.push({ x: tail.x, y: tail.y });
}

// get random food position
function getRandomFoodPosition() {
  const x = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
  const y = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
  return { x, y };
}

// check if the snake collides with the wall or itself
function checkCollision() {
  const head = snake[0];

  //check wall collisions
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    return true;
  }

  // check self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// end game
function endGame() {
  clearInterval(gameLoop);
  alert(`Game Over! Your score was ${score}`);
}
