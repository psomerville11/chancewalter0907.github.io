const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

var paddleSpeed = 6;
var ballSpeed = 5;
var playerOneScore = 0;
var playerTwoScore = 0;
var gameOver = false;
var gameOverDisplayed = false;
const gameoverScreen = document.getElementById('gameOver');
//const gameoverContainer = document.getElementById("gameContainer")


const leftPaddle = {
  // start in the middle of the game on the left side
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  // paddle velocity
  dy: 0
};
const rightPaddle = {
  // start in the middle of the game on the right side
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,

  // paddle velocity
  dy: 0
};
const ball = {
  // start in the middle of the game
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,

  // keep track of when need to reset the ball position
  resetting: false,

  // ball velocity (start going to the top-right corner)
  dx: ballSpeed,
  dy: -ballSpeed
};

// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function displaygameOver(){
  gameoverScreen.style.visibility = "visible";
  //gameoverContainer.style.visibility = "hidden";
}

function hideGameOver(){
gameoverScreen.visibility = "hidden";
//gameoverContainer.style.visibility = "visible";
}


// game loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

distance = leftPaddle.y - ball.y;

if(distance > 0){
  leftPaddle.dy = -paddleSpeed;
}
if(distance < 0){
  leftPaddle.dy = paddleSpeed;
}


if (gameOver){
  if(!gameOverDisplayed){
    displaygameOver();
    gameOverDisplayed = true;
  }
  return;
}


  // move paddles by their velocity
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // prevent paddles from going through walls
  if (leftPaddle.y < grid) {
    leftPaddle.y = grid;
  }
  else if (leftPaddle.y > maxPaddleY) {
    leftPaddle.y = maxPaddleY;
  }

  if (rightPaddle.y < grid) {
    rightPaddle.y = grid;
  }
  else if (rightPaddle.y > maxPaddleY) {
    rightPaddle.y = maxPaddleY;
  }

  // draw paddles
  context.fillStyle = 'blue';
  context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  context.fillStyle = "red";
  context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // move ball by its velocity
  ball.x += ball.dx / 1.5;
  ball.y += ball.dy / 1.5;

  // prevent ball from going through walls by changing its velocity
  if (ball.y < grid) {
    ball.y = grid;
    ball.dy *= -1;
  }
  else if (ball.y + grid > canvas.height - grid) {
    ball.y = canvas.height - grid * 2;
    ball.dy *= -1;
  }

  // reset ball if it goes past paddle (but only if we haven't already done so)
  if ( (ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;
    // give some time for the player to recover before launching the ball again
    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }, 400);

    // Gives point to the right paddle if the ball goes past the left paddle
    if (ball.x < 0) {
        playerTwoScore += 1;
    }

    // Give spoint to the left paddle if the ball goes past the right paddle
    if (ball.x > canvas.width) {
        playerOneScore += 1;
    }

    if(playerOneScore >= 7 || playerTwoScore >= 7 ){
          if(playerOneScore > playerTwoScore){
          document.getElementById("winner").innerHTML = "You lose";
          } else{
          document.getElementById("winner").innerHTML = "You win";
     }
     //document.getElementById("gameOver").innerText = "Game Over";
      //document.getElementById("gameOver").style.visibility = "visible";
     gameOver = true;
      //end game
    }
  }

  // check to see if ball collides with paddle. if they do change x velocity
  if (collides(ball, leftPaddle)) {
    ball.dx *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.x = leftPaddle.x + leftPaddle.width;
  }
  else if (collides(ball, rightPaddle)) {
    ball.dx *= -1;

    // move ball next to the paddle otherwise the collision will happen again
    // in the next frame
    ball.x = rightPaddle.x - ball.width;
  }

  // draw ball
  context.fillStyle = "grey";
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // draw walls
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  // draw dotted line down the middle
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }

  // draw player one score
  context.font = "30px Unispace";
  context.fillStyle = "blue"; 
  context.fillText(String(playerOneScore), canvas.width / 4 - 25, grid * 3);

  // draw player two score
  context.fillStyle = "red";
  context.fillText(String(playerTwoScore), (canvas.width / 4) * 3, grid * 3);

}

//if(playerOneScore == 7 || playerTwoScore == 7){
  //handleGameOver();
//}

// listen to keyboard events to move the paddles
document.addEventListener('keydown', function(e) {

  // up arrow key
  if (e.which === 38) {
    rightPaddle.dy = -paddleSpeed;
  }
  // down arrow key
  else if (e.which === 40) {
    rightPaddle.dy = paddleSpeed;
  }

  // w key
  if (e.which === 87) {
    leftPaddle.dy = -paddleSpeed;
  }
  // a key
  else if (e.which === 83) {
    leftPaddle.dy = paddleSpeed;
  }
});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener('keyup', function(e) {
  if (e.which === 38 || e.which === 40) {
    rightPaddle.dy = 0;
  }

  if (e.which === 83 || e.which === 87) {
    leftPaddle.dy = 0;
  }
});

//function handleGameOver(){
 //if(playerOneScore == 7){
  //document.getElementById("winner").innerHTML = "You lose";
 //}
 //else{
  //document.getElementById("winner").innerHTML = "You win";
 //}
//showBox();
//ball.resetting = true;
//}

//function restart(){
 // playerOneScore = 0;
  //playerTwoScore = 0;
  //scores = playerOneScore + " - " + playerTwoScore;
  //document.getElementById('scoreboard')

 // popup.style.display = "none";

  //setTimeout(() =>{ 
    //ball.resetting = false;
    //ball.x = canvas.width / 2;
    //ball.y = canvas.height /2;
  //});
//}

//function showBox(){
  //gameOver.style.display = "block";
//}

// start the game
requestAnimationFrame(loop);
