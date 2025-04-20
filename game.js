
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let startBtn = document.getElementById('startBtn');
let musicBtn = document.getElementById('musicBtn');
let running = false;
let musicOn = false;
let car = { x: canvas.width/2, y: canvas.height/2, angle: 0 };

let music = new Audio();
music.src = 'loop.mp3';
music.loop = true;

startBtn.addEventListener('click', () => {
  running = true;
});

musicBtn.addEventListener('click', () => {
  musicOn = !musicOn;
  musicBtn.innerText = 'Music: ' + (musicOn ? 'On' : 'Off');
  if (musicOn) music.play(); else music.pause();
});

window.addEventListener('deviceorientation', (e) => {
  if (!running) return;
  car.x += e.gamma * 0.5;
  car.y += e.beta * 0.5;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (running) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(car.x, car.y, 10, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = 'white';
    ctx.font = '20px sans-serif';
    ctx.fillText('Tap Start to Begin', 300, 300);
  }
  requestAnimationFrame(draw);
}

draw();
