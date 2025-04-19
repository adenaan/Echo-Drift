
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let car = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, speed: 0 };
let ghostPaths = [];
let recording = [];
let laps = 0;
let totalLaps = 5;
let started = false;
let crashed = false;

const lapRadius = 120;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let prevAngle = null;

document.getElementById("startBtn").addEventListener("click", () => {
  started = true;
  document.getElementById("startBtn").style.display = "none";
});

function drawCar(x, y, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.fillRect(-10, -5, 20, 10);
  ctx.restore();
}

function drawTrack() {
  ctx.beginPath();
  ctx.arc(centerX, centerY, lapRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#0cf";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function updateCarTilt() {
  window.addEventListener("deviceorientation", (e) => {
    if (!started || crashed) return;
    car.angle += e.gamma * 0.001;
    car.x += Math.cos(car.angle) * 2;
    car.y += Math.sin(car.angle) * 2;
  });
}

function checkLapCompletion() {
  const dx = car.x - centerX;
  const dy = car.y - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > lapRadius - 5 && dist < lapRadius + 5) {
    const angle = Math.atan2(dy, dx);
    if (prevAngle !== null && angle < prevAngle) {
      laps++;
      document.getElementById("lapDisplay").innerText = `Lap: ${laps}/${totalLaps}`;
      ghostPaths.push([...recording]);
      recording = [];
      if (laps >= totalLaps) {
        alert("All laps completed!");
        started = false;
      }
    }
    prevAngle = angle;
  }
}

function checkGhostCrash() {
  for (let path of ghostPaths) {
    for (let pt of path) {
      let dx = car.x - pt.x;
      let dy = car.y - pt.y;
      if (dx * dx + dy * dy < 100) {
        crashed = true;
        alert("Crashed into ghost!");
        started = false;
      }
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTrack();

  if (started && !crashed) {
    recording.push({ x: car.x, y: car.y });
    checkLapCompletion();
    checkGhostCrash();
  }

  drawCar(car.x, car.y, car.angle, crashed ? "red" : "white");

  for (let path of ghostPaths) {
    for (let pt of path) {
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(pt.x - 1, pt.y - 1, 2, 2);
    }
  }

  requestAnimationFrame(gameLoop);
}

updateCarTilt();
gameLoop();
