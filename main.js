
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let startBtn = document.getElementById('startBtn');
let musicBtn = document.getElementById('musicBtn');
let popup = document.getElementById('popup');
let popupOk = document.getElementById('popupOk');

let car = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, vx: 0, vy: 0 };
let echoTrail = [];
let gameStarted = false;
let musicOn = false;
let tiltX = 0, tiltY = 0;

function drawCar(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, car.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw ghost trail
    echoTrail.forEach(p => drawCar(p.x, p.y, 'rgba(255,255,255,0.3)'));
    // Draw player car
    drawCar(car.x, car.y, 'cyan');
}

function update() {
    if (gameStarted) {
        car.vx += tiltX * 0.05;
        car.vy += tiltY * 0.05;
        car.x += car.vx;
        car.y += car.vy;

        echoTrail.push({ x: car.x, y: car.y });
        if (echoTrail.length > 300) echoTrail.shift();

        // Crash detection
        for (let ghost of echoTrail) {
            let dx = ghost.x - car.x;
            let dy = ghost.y - car.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < car.radius * 2) {
                showPopup("Crashed into echo!");
                gameStarted = false;
            }
        }
    }
    draw();
    requestAnimationFrame(update);
}

function showPopup(msg) {
    document.getElementById('popupText').textContent = msg;
    popup.style.display = 'block';
}

popupOk.addEventListener('click', () => {
    popup.style.display = 'none';
    car = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, vx: 0, vy: 0 };
    echoTrail = [];
});

startBtn.addEventListener('click', () => {
    gameStarted = true;
});

musicBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    musicBtn.textContent = "Music: " + (musicOn ? "On" : "Off");
});

window.addEventListener('deviceorientation', (e) => {
    tiltX = e.gamma || 0;
    tiltY = e.beta || 0;
});

update();
