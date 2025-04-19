
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let trackRadius = Math.min(canvas.width, canvas.height) / 3;
let car = { x: centerX + trackRadius, y: centerY, angle: -Math.PI / 2, speed: 0, turning: 0 };
let started = false;
let crashed = false;
let laps = 0;
const totalLaps = 5;
let lapCrossed = false;
let recording = [];
let ghosts = [];
let ghostFrames = [];

document.getElementById("startBtn").addEventListener("click", () => {
  started = true;
  crashed = false;
  car = { x: centerX + trackRadius, y: centerY, angle: -Math.PI / 2, speed: 0, turning: 0 };
  recording = [];
  document.getElementById("lapDisplay").innerText = `Lap: ${laps} / ${totalLaps}`;
  document.getElementById("startBtn").style.display = "none";
});

function drawTrack() {
  ctx.beginPath();
  ctx.arc(centerX, centerY, trackRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "#0cf";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawCar(x, y, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-10, -6);
  ctx.lineTo(-10, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function updateTiltControls() {
  window.addEventListener("deviceorientation", (e) => {
    if (!started || crashed) return;
    car.turning = e.gamma * 0.002;
  });
}

function updateCar() {
  if (crashed || !started) return;
  car.angle += car.turning;
  car.x += Math.cos(car.angle) * 2;
  car.y += Math.sin(car.angle) * 2;
  recording.push({ x: car.x, y: car.y });
}

function checkLap() {
  if (!started || crashed) return;
  const dx = car.x - centerX;
  const dy = car.y - centerY;
  const angle = Math.atan2(dy, dx);
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > trackRadius - 10 && dist < trackRadius + 10 && angle > -0.2 && angle < 0.2) {
    if (!lapCrossed) {
      laps++;
      document.getElementById("lapDisplay").innerText = `Lap: ${laps} / ${totalLaps}`;
      if (laps <= totalLaps) ghosts.push([...recording]);
      recording = [];
      lapCrossed = true;
      if (laps >= totalLaps) {
        alert("All laps completed!");
        started = false;
        document.getElementById("startBtn").style.display = "block";
      }
    }
  } else {
    lapCrossed = false;
  }
}

function checkCrash() {
  for (let ghost of ghosts) {
    for (let pt of ghost) {
      const dx = car.x - pt.x;
      const dy = car.y - pt.y;
      if (dx * dx + dy * dy < 200) {
        crashed = true;
        started = false;
        alert("Crashed into your ghost!");
        document.getElementById("startBtn").style.display = "block";
        return;
      }
    }
  }
}

function drawGhosts() {
  for (let ghost of ghosts) {
    for (let pt of ghost) {
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(pt.x, pt.y, 1.5, 1.5);
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTrack();
  drawGhosts();
  updateCar();
  checkLap();
  checkCrash();
  drawCar(car.x, car.y, car.angle, crashed ? "red" : "white");
  requestAnimationFrame(loop);
}

updateTiltControls();
loop();
