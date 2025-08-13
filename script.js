<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Círculo de la Vida</title>
<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        background: #111;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    header img {
        width: 100%;
        height: auto;
    }

    h2 {
        text-align: center;
        margin: 10px 0;
    }

    #controls {
        width: 95%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
    }

    .slider-group {
        display: flex;
        flex-direction: column;
    }

    label {
        font-size: 0.9em;
        margin-bottom: 3px;
    }

    input[type="range"] {
        width: 100%;
    }

    canvas {
        max-width: 95vw;
        height: auto;
        background: #222;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    #buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
    }

    button {
        background: #69c9b9;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        color: black;
        font-weight: bold;
        cursor: pointer;
    }

    button:hover {
        background: #57b3a3;
    }

    /* Movibles */
    .label-draggable {
        position: absolute;
        cursor: grab;
        color: yellow;
        font-size: 0.8em;
        background: rgba(0,0,0,0.5);
        padding: 2px 5px;
        border-radius: 3px;
    }
</style>
</head>
<body>

<header>
    <img src="HEADER.jpg" alt="Encabezado">
</header>

<h2>Círculo de la Vida</h2>

<div style="margin-bottom:10px;">
    <label for="nombre">Nombre:</label>
    <input type="text" id="nombre" placeholder="Ingrese su nombre" required style="padding:5px;width:250px;">
</div>

<canvas id="circleCanvas" width="400" height="400"></canvas>

<div id="controls"></div>

<div id="buttons">
    <button id="resetBtn">Reiniciar</button>
    <button id="downloadBtn">Descargar</button>
</div>

<script>
    const canvas = document.getElementById("circleCanvas");
    const ctx = canvas.getContext("2d");

    const categories = [
        "Salud", "Dinero", "Carrera", "Familia", "Amigos",
        "Diversión", "Amor", "Crecimiento", "Espiritualidad", "Contribución"
    ];

    let values = new Array(categories.length).fill(0);

    const controlsDiv = document.getElementById("controls");

    categories.forEach((cat, i) => {
        const group = document.createElement("div");
        group.classList.add("slider-group");

        const label = document.createElement("label");
        label.textContent = `${cat}: ${values[i]}`;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = 0;
        slider.max = 10;
        slider.value = values[i];
        slider.addEventListener("input", () => {
            values[i] = parseInt(slider.value);
            label.textContent = `${cat}: ${values[i]}`;
            drawCircle();
        });

        group.appendChild(label);
        group.appendChild(slider);
        controlsDiv.appendChild(group);
    });

    function drawCircle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = 150;

        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        for (let r = 0; r <= 10; r++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (r / 10) * maxRadius, 0, Math.PI * 2);
            ctx.stroke();
        }

        const angleStep = (Math.PI * 2) / categories.length;
        ctx.beginPath();
        values.forEach((val, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const radius = (val / 10) * maxRadius;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(105, 201, 185, 0.5)";
        ctx.fill();
        ctx.strokeStyle = "#69c9b9";
        ctx.stroke();

        // Texto
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        categories.forEach((cat, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + (maxRadius + 15) * Math.cos(angle);
            const y = centerY + (maxRadius + 15) * Math.sin(angle);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(cat, x, y);
        });

        // Nombre
        const nombre = document.getElementById("nombre").value;
        if (nombre) {
            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "yellow";
            ctx.textAlign = "center";
            ctx.fillText(nombre, centerX, centerY);
        }
    }

    // Reinicio
    document.getElementById("resetBtn").addEventListener("click", () => {
        values.fill(0);
        [...controlsDiv.querySelectorAll("input[type=range]")].forEach((slider, i) => slider.value = 0);
        drawCircle();
    });

    // Descargar
    document.getElementById("downloadBtn").addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        if (!nombre) {
            alert("Por favor ingrese su nombre antes de descargar.");
            return;
        }
        drawCircle();
        const link = document.createElement("a");
        link.download = `circulo_${nombre}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });

    drawCircle();
</script>

</body>
</html>
