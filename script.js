// ===============================
// CONFIGURACIÓN INICIAL
// ===============================

// Categorías y valores iniciales
const categories = [
  { name: "Salud", value: 5 },
  { name: "Carrera", value: 5 },
  { name: "Finanzas", value: 5 },
  { name: "Familia", value: 5 },
  { name: "Amigos", value: 5 },
  { name: "Diversión", value: 5 },
  { name: "Crecimiento", value: 5 },
  { name: "Aportar", value: 5 }
];

// Elementos del DOM
const canvas = document.getElementById("lifeWheel");
const ctx = canvas.getContext("2d");
const slidersDiv = document.getElementById("sliders");
const nombreInput = document.getElementById("nombre");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

let centerX, centerY, radius;
let draggingIndex = null;

// ===============================
// FUNCIÓN: Ajustar tamaño del canvas
// ===============================
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.9, 500);
  canvas.height = canvas.width;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  radius = canvas.width / 2 - 30;
  drawWheel();
}

// ===============================
// FUNCIÓN: Dibujar el gráfico
// ===============================
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const step = (Math.PI * 2) / categories.length;

  // Círculos concéntricos
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  for (let i = 1; i <= 10; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius / 10) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Líneas radiales + etiquetas
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
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 14px Segoe UI";
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.textAlign = "center";
    ctx.fillText(cat.name, radius * 0.75, 5);
    ctx.restore();
  });

  // Polígono de valores
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

  // Nombre en el centro (transparente)
  if (nombreInput.value.trim() !== "") {
    ctx.font = "bold 24px Segoe UI";
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.textAlign = "center";
    ctx.fillText(nombreInput.value, centerX, centerY);
  }
}

// ===============================
// FUNCIÓN: Crear sliders
// ===============================
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

// ===============================
// FUNCIÓN: Obtener índice de categoría según posición
// ===============================
//function getCategoryIndexFromPosition(x, y) {
 // const dx = x - centerX;
 // const dy = y - centerY;
 // let angle = Math.atan2(dy, dx);
 // if (angle < -Math.PI / 2) angle += 2 * Math.PI;
//  let index = Math.floor((angle + Math.PI / 2) / ((Math.PI * 2) / categories.length));
 // return index;
//}
function getCategoryIndexFromPosition(x, y) {
  const step = (Math.PI * 2) / categories.length;
  const tolerance = 20; // tolerancia en píxeles para seleccionar el punto exacto

  for (let i = 0; i < categories.length; i++) {
    const angle = i * step - Math.PI / 2;
    const valueRadius = (categories[i].value / 10) * radius;

    const px = centerX + valueRadius * Math.cos(angle);
    const py = centerY + valueRadius * Math.sin(angle);

    // Distancia entre clic y punto real
    const distToPoint = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));

    if (distToPoint <= tolerance) {
      return i; // Encontramos la categoría tocada
    }
  }

  return null; // Ninguna categoría fue tocada
}
// ===============================
// FUNCIÓN: Actualizar valor desde posición
// ===============================
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

// ===============================
// EVENTOS DE INTERACCIÓN
// ===============================

// Mouse
canvas.addEventListener("mousedown", e => {
  draggingIndex = getCategoryIndexFromPosition(e.offsetX, e.offsetY);
});
canvas.addEventListener("mousemove", e => {
  if (draggingIndex !== null) {
    updateValueFromPosition(draggingIndex, e.offsetX, e.offsetY);
  }
});
canvas.addEventListener("mouseup", () => draggingIndex = null);

// Touch
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

// Input nombre → redibuja con transparencia
nombreInput.addEventListener("input", drawWheel);

// Botón Reset
resetBtn.addEventListener("click", () => {
  categories.forEach(cat => cat.value = 5);
  createSliders();
  drawWheel();
  nombreInput.value = "";
});

// Botón Descargar
downloadBtn.addEventListener("click", () => {
  // Crear canvas temporal del mismo tamaño que el principal
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");

  // Copiar el contenido del canvas principal
  tempCtx.drawImage(canvas, 0, 0);

  // Añadir fecha y hora en la esquina inferior derecha
  const now = new Date();
  const fechaHora = now.toLocaleString(); // Fecha y hora local
  tempCtx.font = "14px Segoe UI";
  tempCtx.fillStyle = "rgba(255,255,255,0.7)";
  tempCtx.textAlign = "right";
  tempCtx.textBaseline = "bottom";
  tempCtx.fillText(fechaHora, tempCanvas.width - 10, tempCanvas.height - 10);

  // Preparar nombre del archivo usando el nombre ingresado
  const nombreArchivo = nombreInput.value.trim() || "circulo_de_la_vida";
  const link = document.createElement("a");
  link.download = `${nombreArchivo}.png`;
  link.href = tempCanvas.toDataURL();
  link.click();
});

// Ajuste de tamaño
window.addEventListener("resize", resizeCanvas);

// ===============================
// INICIALIZACIÓN
// ===============================
createSliders();
resizeCanvas();
