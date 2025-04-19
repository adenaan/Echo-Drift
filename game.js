
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const lapDisplay = document.getElementById("lapDisplay");

let width, height;
let car = { x: 0, y: 0, angle: 0, speed: 0, radius: 8 };
let ghosts = [];
let lapCount = 0;
let lapLimit = 5;
let trackRadius;
let centerX, centerY;
let recording = [];
let gameStarted = false;

function resizeCanvas() {
    canvas.width = width = window.innerWidth;
    canvas.height = height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
    trackRadius = Math.min(width, height) / 3;
    resetCar();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function resetCar() {
    car.angle = 0;
    car.speed = 0;
    car.x = centerX + trackRadius * Math.cos(car.angle);
    car.y = centerY + trackRadius * Math.sin(car.angle);
}

function drawTrack() {
    ctx.strokeStyle = "#444";
    ctx.beginPath();
    ctx.arc(centerX, centerY, trackRadius, 0, Math.PI * 2);
    ctx.stroke();
}

function drawCar(c, color="cyan") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawGhosts() {
    for (let ghost of ghosts) {
        if (ghost.frames.length > 0) {
            let frame = ghost.frames.shift();
            drawCar(frame, "rgba(255,255,255,0.3)");
        }
    }
}

function updateCar() {
    car.angle += tiltX * 0.01;
    car.x = centerX + trackRadius * Math.cos(car.angle);
    car.y = centerY + trackRadius * Math.sin(car.angle);
    recording.push({ x: car.x, y: car.y, radius: car.radius });
    if (recording.length > 300) recording.shift();
}

let prevQuadrant = 0;
function checkLap() {
    const angleDeg = (car.angle * 180 / Math.PI + 360) % 360;
    const quadrant = Math.floor(angleDeg / 90);
    if (quadrant === 0 && prevQuadrant === 3) {
        lapCount++;
        lapDisplay.textContent = `Lap: ${lapCount}/${lapLimit}`;
        if (lapCount <= lapLimit) {
            ghosts.push({ frames: [...recording] });
        }
        recording = [];
    }
    prevQuadrant = quadrant;
}

function detectCrash() {
    for (let ghost of ghosts) {
        for (let g of ghost.frames) {
            let dx = car.x - g.x;
            let dy = car.y - g.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < car.radius * 2) {
                alert("Crashed into your Echo!");
                resetGame();
                return;
            }
        }
    }
}

function gameLoop() {
    if (!gameStarted) return;
    ctx.clearRect(0, 0, width, height);
    drawTrack();
    updateCar();
    drawGhosts();
    drawCar(car);
    checkLap();
    detectCrash();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    gameStarted = false;
    ghosts = [];
    recording = [];
    lapCount = 0;
    lapDisplay.textContent = "Lap: 0/5";
    resetCar();
}

let tiltX = 0;
window.addEventListener("deviceorientation", (e) => {
    tiltX = e.gamma || 0;
});

startBtn.addEventListener("click", () => {
    resetGame();
    gameStarted = true;
    gameLoop();
});
