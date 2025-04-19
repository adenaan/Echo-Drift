
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let car = { x: canvas.width / 2, y: canvas.height / 2, size: 10 };

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "cyan";
    ctx.beginPath();
    ctx.arc(car.x, car.y, car.size, 0, Math.PI * 2);
    ctx.fill();
    requestAnimationFrame(draw);
}

draw();
