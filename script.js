const categories = [
  { name: "Salud", value: 6 },
  { name: "Carrera", value: 7 },
  { name: "Finanzas", value: 5 },
  { name: "Familia", value: 8 },
  { name: "Amigos", value: 6 },
  { name: "Diversión", value: 4 },
  { name: "Crecimiento", value: 7 },
  { name: "Aportar", value: 5 }
];

const canvas = document.getElementById("lifeWheel");
const ctx = canvas.getContext("2d");
const slidersDiv = document.getElementById("sliders");

let centerX, centerY, radius;
let draggingIndex = null;

// Ajusta el canvas al tamaño de la pantalla
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.9, 500);
  canvas.height = canvas.width;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  radius = canvas.width / 2 - 30;
  drawWheel();
}

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const step = (Math.PI * 2) / categories.length;

  // Dibujar círculos concéntricos
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  for (let i = 1; i <= 10; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius / 10) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Dibujar líneas radiales y nombres con transparencia
  categories.forEach((cat, i) => {
    const angle = i * step - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.font = "bold 14px Segoe UI";
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.textAlign = "center";
    ctx.fillText(cat.name, radius * 0.75, 5);
    ctx.restore();
  });

  // Dibujar polígono de valores
  ctx.beginPath();
  categories.forEach((cat, i) => {
    const angle = i * step - Math.PI / 2;
    const valueRadius = (cat.value / 10) * radius;
    const x = centerX + valueRadius * Math.cos(angle);
    const y = centerY + valueRadius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(105, 201, 185, 0.4)";
  ctx.fill();
  ctx.strokeStyle = "#69c9b9";
  ctx.stroke();
}

function createSliders() {
  slidersDiv.innerHTML = "";
  categories.forEach((cat, i) => {
    const container = document.createElement("div");
    container.className = "slider-container";
    const label = document.createElement("label");
    label.textContent = cat.name;
    const input = document.createElement("input");
    input.type = "range";
    input.min = 0;
    input.max = 10;
    input.value = cat.value;
    input.addEventListener("input", e => {
      categories[i].value = parseInt(e.target.value);
      drawWheel();
    });
    container.appendChild(label);
    container.appendChild(input);
    slidersDiv.appendChild(container);
  });
}

function getCategoryIndexFromPosition(x, y) {
  const dx = x - centerX;
  const dy = y - centerY;
  let angle = Math.atan2(dy, dx);
  if (angle < -Math.PI / 2) angle += 2 * Math.PI;
  let index = Math.floor((angle + Math.PI / 2) / ((Math.PI * 2) / categories.length));
  return index;
}

function updateValueFromPosition(index, x, y) {
  const dx = x - centerX;
  const dy = y - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  let newValue = Math.round((dist / radius) * 10);
  newValue = Math.max(0, Math.min(10, newValue));
  categories[index].value = newValue;
  document.querySelectorAll("#sliders input")[index].value = newValue;
  drawWheel();
}

// Eventos de arrastre
canvas.addEventListener("mousedown", e => {
  draggingIndex = getCategoryIndexFromPosition(e.offsetX, e.offsetY);
});
canvas.addEventListener("mousemove", e => {
  if (draggingIndex !== null) {
    updateValueFromPosition(draggingIndex, e.offsetX, e.offsetY);
  }
});
canvas.addEventListener("mouseup", () => draggingIndex = null);
canvas.addEventListener("mouseleave", () => draggingIndex = null);

// Eventos táctiles
canvas.addEventListener("touchstart", e => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  draggingIndex = getCategoryIndexFromPosition(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener("touchmove", e => {
  if (draggingIndex !== null) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    updateValueFromPosition(draggingIndex, touch.clientX - rect.left, touch.clientY - rect.top);
  }
});
canvas.addEventListener("touchend", () => draggingIndex = null);

window.addEventListener("resize", resizeCanvas);

// Inicializar
createSliders();
resizeCanvas();
