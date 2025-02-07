

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let currentTool = 'draw';
  let currentColor = '#000000';
  let brushSize = 5;

  function initCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Load saved drawing if available
    const savedData = localStorage.getItem('canvasData');
    if (savedData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = savedData;
    }
  }

  function startDrawing(e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }

  function draw(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = (currentTool === 'erase') ? '#FFFFFF' : currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }

  function stopDrawing() {
    isDrawing = false;
    saveToLocalStorage();
  }

  function saveToLocalStorage() {
    localStorage.setItem('canvasData', canvas.toDataURL());
  }

  document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = e.target.value;
    ctx.strokeStyle = currentColor;
  });

  // Vertical slider for brush size
  document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value);
    ctx.lineWidth = brushSize;
  });

  document.getElementById('drawBtn').addEventListener('click', function () {
    currentTool = 'draw';
    ctx.strokeStyle = currentColor;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
  });

  document.getElementById('eraseBtn').addEventListener('click', function () {
    currentTool = 'erase';
    ctx.strokeStyle = '#FFFFFF';
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToLocalStorage();
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `painting-${new Date().toISOString().slice(0,10)}.png`;
    link.href = canvas.toDataURL();
    link.click();
    saveToLocalStorage();
  });

  function logPressure(ev) {
    document.querySelector(".pressure").innerText = `Pressure: ${ev.pressure.toFixed(2)}`;
  }

  document.addEventListener("pointerdown", logPressure);
  document.addEventListener("pointermove", logPressure);
  document.addEventListener("pointerup", logPressure);

  function startSaveTimer() {
    setInterval(() => {
      new bootstrap.Modal(document.getElementById('reminderModal')).show();
    }, 600000);
  }

  document.getElementById('modalSaveBtn').addEventListener('click', () => {
    saveToLocalStorage();
    bootstrap.Modal.getInstance(document.getElementById('reminderModal')).hide();
  });

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  initCanvas();
  startSaveTimer();
