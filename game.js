
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let car = { x: canvas.width / 2, y: canvas.height / 2, r: 10 };

function drawCar() {
  ctx.beginPath();
  ctx.arc(car.x, car.y, car.r, 0, Math.PI * 2);
  ctx.fillStyle = "#0f0";
  ctx.fill();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCar();
  requestAnimationFrame(render);
}

document.getElementById("start-button").onclick = () => {
  document.getElementById("start-screen").style.display = "none";
  render();
};

document.getElementById("music-toggle").onclick = () => {
  alert("Music toggled (placeholder)");
};
