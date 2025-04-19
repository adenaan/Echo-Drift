const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameStarted = false;
let angle = 0;
let radius = 120;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let player = { x: centerX + radius, y: centerY, path: [] };
let ghost = [];
let lap = 1;
let maxLaps = 5;
let crashed = false;
let musicOn = false;

const startBtn = document.getElementById("startBtn");
const toggleMusicBtn = document.getElementById("toggleMusicBtn");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const popupOkBtn = document.getElementById("popupOkBtn");
const startScreen = document.getElementById("startScreen");

startBtn.onclick = () => {
  gameStarted = true;
  startScreen.style.display = "none";
};

toggleMusicBtn.onclick = () => {
  musicOn = !musicOn;
  toggleMusicBtn.textContent = musicOn ? "Music: On" : "Music: Off";
};

popupOkBtn.onclick = () => {
  popup.classList.add("hidden");
  crashed = false;
};

function update() {
  if (!gameStarted || crashed) return;

  angle += 0.03;
  if (angle >= Math.PI * 2) {
    angle = 0;
    lap++;
    ghost = [...player.path];
    player.path = [];
    if (lap > maxLaps) {
      showPopup("All Laps Complete!");
      gameStarted = false;
    }
  }

  player.x = centerX + Math.cos(angle) * radius;
  player.y = centerY + Math.sin(angle) * radius;
  player.path.push({ x: player.x, y: player.y });

  for (let g of ghost) {
    const dx = g.x - player.x;
    const dy = g.y - player.y;
    if (Math.sqrt(dx * dx + dy * dy) < 10) {
      showPopup("You Crashed Into Your Echo!");
      crashed = true;
      break;
    }
  }
}

function showPopup(msg) {
  popupText.textContent = msg;
  popup.classList.remove("hidden");
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#0ff";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw ghost
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  for (let g of ghost) {
    ctx.beginPath();
    ctx.arc(g.x, g.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw player
  ctx.fillStyle = "#0f0";
  ctx.beginPath();
  ctx.arc(player.x, player.y, 6, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();