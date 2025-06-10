// main.js
import { Ball } from './physics.js';
import { setupInput, inputState } from './input.js';
import { Renderer } from './renderer.js';
import { playFlip, playScore } from './audio.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const homeBtn = document.getElementById('homeBtn');
const scoreAEl = document.getElementById('scoreA');
const scoreBEl = document.getElementById('scoreB');

let width, height;
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

// Game state
let scene = 'menu'; // 'menu' | 'play' | 'score'
let scoreA = 0;
let scoreB = 0;

// Core objects
const ball = new Ball(width / 2, height / 2);
const renderer = new Renderer(ctx, ball);

// Input
setupInput(canvas);

// Scene control
homeBtn.addEventListener('click', () => {
  scene = 'menu';
});

// Game loop
let lastTime = 0;
function loop(time) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function update(dt) {
  switch (scene) {
    case 'menu':
      if (inputState.started) {
        inputState.started = false;
        startGame();
      }
      break;

    case 'play':
      // Handle flips
      if (inputState.flipA) {
        ball.setGravity(-1);
        playFlip();
        inputState.flipA = false;
      }
      if (inputState.flipB) {
        ball.setGravity(1);
        playFlip();
        inputState.flipB = false;
      }

      ball.update(dt);

      // Check scoring
      if (ball.y < 0) {
        scoreA++;
        playScore();
        scene = 'score';
        setTimeout(() => nextRound(), 1000);
      } else if (ball.y > height) {
        scoreB++;
        playScore();
        scene = 'score';
        setTimeout(() => nextRound(), 1000);
      }
      break;

    case 'score':
      // waiting for nextRound timeout
      break;
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  renderer.drawBackground(width, height);

  if (scene === 'menu') {
    renderer.drawMenu(width, height);
  } else {
    // draw game objects
    renderer.drawGoals(width, height);
    renderer.drawBall();
  }

  // update UI
  scoreAEl.textContent = scoreA;
  scoreBEl.textContent = scoreB;
}

function startGame() {
  scoreA = 0;
  scoreB = 0;
  nextRound();
  scene = 'play';
}

function nextRound() {
  ball.reset(width / 2, height / 2);
  // random initial gravity
  ball.setGravity(Math.random() < 0.5 ? -1 : 1);
  scene = 'play';
}
