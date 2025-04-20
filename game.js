const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let w = canvas.width;
let h = canvas.height;

const centerX = w / 2;
const centerY = h / 2;
const trackRadius = 200;
const carRadius = 10;
let angle = -Math.PI / 2;
let lap = 0;
let isRacing = false;

const lapDisplay = document.getElementById('lapInfo');
const startBtn = document.getElementById('startBtn');

let velocity = 0;
let tiltAngle = 0;

window.addEventListener('deviceorientation', (e) => {
  tiltAngle = e.gamma / 50;
});

startBtn.onclick = () => {
  if (!isRacing) {
    angle = -Math.PI / 2;
    velocity = 0.02;
    lap = 0;
    isRacing = true;
  }
};

function drawTrack() {
  ctx.beginPath();
  ctx.arc(centerX, centerY, trackRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#0ff';
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawCar() {
  const x = centerX + Math.cos(angle) * trackRadius;
  const y = centerY + Math.sin(angle) * trackRadius;

  ctx.beginPath();
  ctx.arc(x, y, carRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
}

let lastAngle = angle;
let crossedLine = false;

function update() {
  if (!isRacing) return;

  angle += velocity * tiltAngle;

  // Lap detection
  const crossed = lastAngle < -Math.PI / 2 && angle >= -Math.PI / 2;
  if (crossed && !crossedLine) {
    lap++;
    lapDisplay.textContent = 'Laps: ' + lap + ' / 5';
    if (lap >= 5) isRacing = false;
    crossedLine = true;
  }
  if (!crossed) crossedLine = false;

  lastAngle = angle;
}

function gameLoop() {
  ctx.clearRect(0, 0, w, h);
  drawTrack();
  drawCar();
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();