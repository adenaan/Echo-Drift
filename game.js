let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let radius = 200;
let car = { x: centerX + radius, y: centerY, angle: 0, speed: 0 };
let lapCount = 1;
let maxLaps = 5;
let lapDisplay = document.getElementById('lapDisplay');
let started = false;
let musicOn = false;
let gyro = 0;

// Start the game
function startGame() {
  started = true;
  car.speed = 2;
  window.addEventListener('deviceorientation', e => {
    gyro = e.gamma / 45;
  });
}

// Music toggle placeholder
function toggleMusic() {
  musicOn = !musicOn;
  document.querySelectorAll('.button')[1].innerText = musicOn ? 'Music: On' : 'Music: Off';
}

function update() {
  if (!started) return;

  // Tilt turning
  car.angle += gyro * 0.05;

  // Move car around the circular path
  car.x = centerX + Math.cos(car.angle) * radius;
  car.y = centerY + Math.sin(car.angle) * radius;

  // Check lap
  if (Math.abs(car.angle % (2 * Math.PI)) < 0.1 && car.speed > 0) {
    if (!car.lapDetected) {
      lapCount++;
      lapDisplay.innerText = "Lap: " + Math.min(lapCount, maxLaps) + "/" + maxLaps;
      car.lapDetected = true;
    }
  } else {
    car.lapDetected = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw track
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw car
  ctx.beginPath();
  ctx.arc(car.x, car.y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'cyan';
  ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
