import DrawingCanvas from "./DrawingCanvas.js";
import StateManager from "./StateManager.js";
import ToolEnum from "./ToolEnum.js";
import { calculate_grid_position } from "./Utils.js";

let config = {
    width: 400,
    height: 400
}

let state = {
    tool: ToolEnum.DRAW,
    color: "#030303",
    pixelWidth: 10
}

// Creating canvas
let drawingCanvas = new DrawingCanvas(config.width, config.height, state);
document.body.appendChild(drawingCanvas.getCanvasElement());
let canvasRef = drawingCanvas.getCanvasElement();

// Single state manager using a subscriber pattern
let stateManager = new StateManager(state);

stateManager.subscribe((state) => {
    drawingCanvas.onStateChange(state);
});

// Tool picker
let toolPicker = document.querySelector("#tool-select");
toolPicker.addEventListener("change", (event) => {
    state.tool = event.target.value;
    stateManager.updateState(state);
})

// Color picker tool
let colorPickerTool = document.querySelector("#color-picker");
colorPickerTool.addEventListener("input", (event) => {
    state.color = event.target.value;
    console.log(state.color);
    stateManager.updateState(state);
})

// Save and load functionality
let savebtn = document.querySelector("#save");
let loadbtn = document.querySelector("#load");

savebtn.onclick = () => {
    const link = document.createElement("a");
    link.download = "canvas-image.png";
    link.href = canvasRef.toDataURL("image/png");
    link.click();
};

loadbtn.onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png";
    let ctx = canvasRef.getContext("2d");

    input.addEventListener("change", (event) => {
        const myFile = input.files[0];
        const img = new Image();
        img.src = URL.createObjectURL(myFile);
        img.onload = () => {
            ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
            ctx.drawImage(img, 0, 0, canvasRef.width, canvasRef.height);
        };
    })
    
    input.click();
};