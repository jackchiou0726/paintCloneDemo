const activeToolEl = document.getElementById("active-tool");
const brushColorBtn = document.getElementById("brush-color");
const brushIcon = document.getElementById("brush");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColorBtn = document.getElementById("bucket-color");
const eraser = document.getElementById("eraser");
const clearCanvasBtn = document.getElementById("clear-canvas");
const saveStorageBtn = document.getElementById("save-storage");
const loadStorageBtn = document.getElementById("load-storage");
const clearStorageBtn = document.getElementById("clear-storage");
const downloadBtn = document.getElementById("download");
const { body } = document;

//全域變數
const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context = canvas.getContext("2d");

let currentSize = 10;
let bucketColor = "#FFFFFF";
let currentColor = "#A51DAB";

let isEraser = false;
let isMousedown = false;
let drawArray = [];

//設定筆刷顏色
brushColorBtn.addEventListener("change", () => {
  isEraser = false;
  currentColor = `#${brushColorBtn.value}`;
});

//formatting brush size
function displayBrushSize() {
  if (brushSlider.value < 10) {
    brushSize.textContent = `0${brushSlider.value}`;
  } else {
    brushSize.textContent = brushSlider.value;
  }
}

//設定筆刷大小
brushSlider.addEventListener("change", () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

//設定背景顏色
bucketColorBtn.addEventListener("change", () => {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
});

//橡皮擦
eraser.addEventListener("click", () => {
  isEraser = true;
  brushIcon.style.color = "white";
  eraser.style.color = "black";
  activeToolEl.textContent = "Eraser";
  currentColor = bucketColor;
  currentSize = 50;
});

//按鈕事件
brushIcon.addEventListener("click", switchToBrush);

//切換回筆刷
function switchToBrush() {
  isEraser = false;
  brushIcon.style.color = "black";
  eraser.style.color = "white";
  activeToolEl.textContent = "Brush";
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

//draw what is stored in drawnarray
function restoreCanvas() {
  for (let i = 1; i < drawArray.length; i++) {
    context.beginPath();
    context.moveTo(drawArray[i - 1].x, drawArray[i - 1].y);
    context.lineWidth = drawArray[i].size;
    context.lineCap = "round";
    if (drawArray[i].eraser) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawArray[i].color;
    }
    context.lineTo(drawArray[i].x, drawArray[i].y);
    context.stroke();
  }
}

//store drawn line in array
function storeDrawn(x, y, size, color, eraser) {
  const line = {
    x,
    y,
    size,
    color,
    eraser,
  };
  drawArray.push(line);
}

//取捯滑鼠位置
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

//mouse down 事件
canvas.addEventListener("mousedown", (event) => {
  isMousedown = true;
  const currrentPosition = getMousePosition(event);
  context.moveTo(currrentPosition.x, currrentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = "round";
  context.strokeStyle = currentColor;
});

//mouse move
canvas.addEventListener("mousemove", (event) => {
  if (isMousedown) {
    const currrentPosition = getMousePosition(event);
    context.lineTo(currrentPosition.x, currrentPosition.y);
    context.stroke();
    storeDrawn(
      currrentPosition.x,
      currrentPosition.y,
      currentSize,
      currentColor,
      isEraser
    );
  } else {
    storeDrawn(undefined);
  }
});

//mouse up
canvas.addEventListener("mouseup", () => {
  isMousedown = false;
});

//create canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

//clear canvas
clearCanvasBtn.addEventListener("click", () => {
  createCanvas();
  drawArray = [];
  //active tool
  activeToolEl.textContent = "Canvas Cleared";
  setTimeout(switchToBrush, 1500);
});

//save to local storage
saveStorageBtn.addEventListener("click", () => {
  localStorage.setItem("savedCanvas", JSON.stringify(drawArray));

  activeToolEl.textContent = "Canvas saved";
  setTimeout(switchToBrush, 1500);
});

//load from local storage
loadStorageBtn.addEventListener("click", () => {
  if (localStorage.getItem("savedCanvas")) {
    drawArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();
    activeToolEl.textContent = "Canvas loaded";
    setTimeout(switchToBrush, 1500);
  } else {
    activeToolEl.textContent = "No Canvas";
  }
});

//clear local storage
clearStorageBtn.addEventListener("click", () => {
  localStorage.removeItem("savedCanvas");

  activeToolEl.textContent = "Local Storage Cleared";
  setTimeout(switchToBrush, 1500);
});

//doenload image
downloadBtn.addEventListener("click", () => {
  downloadBtn.href = canvas.toDataURL("image/jpeg", 1);
  downloadBtn.download = "demo-paint.jpeg";

  activeToolEl.textContent = "Image File Saved";
  setTimeout(switchToBrush, 1500);
});

//On load
createCanvas();
