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

// Merge maximum 4 in one row or column for now
// Create an invisible canvas for merging only
let mergeRow = document.querySelector("#merge-row");
mergeRow.addEventListener('click', (event) => {
    let mergeCanvas = document.createElement("canvas");
    let canvasContext = mergeCanvas.getContext("2d");
    merge('row', mergeCanvas, canvasContext, canvasRef);
});

let mergeCol = document.querySelector("#merge-col");
mergeCol.addEventListener('click', (event) => {
    let mergeCanvas = document.createElement("canvas");
    let canvasContext = mergeCanvas.getContext("2d");
    merge('col', mergeCanvas, canvasContext, canvasRef);
})

function merge(mode, canvas, context, mainCanvas){
    if (mode === "row"){canvas.height = 400;}

    let input = document.createElement('input');
    input.multiple = true;
    input.type = 'file';
    input.accept = 'image/png';

    input.onchange = (event) => {
        let numFiles = input.files.length;
        let fileList = input.files;
        let imgList = [];

        console.log(numFiles);
        let imagePromises = Array.from(fileList).map(file => {
            return new Promise((resolve) => {
                let img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => resolve(img);
            });
        });

        Promise.all(imagePromises).then(imgList => {
            for (let i = 0; i<imgList.length; i++){
                if (mode == "row"){
                    canvas.width += imgList[i].width;
                } else {canvas.height += imgList[i].width;}
            }
            
            for(let i = 0; i<imgList.length; i++){
                if (mode == "col"){
                    context.drawImage(imgList[i], 0, mainCanvas.width * i, mainCanvas.width, mainCanvas.width);
                } else {
                    context.drawImage(imgList[i], mainCanvas.width * i,0, mainCanvas.width, mainCanvas.width);
                }
                
            }
            
            const link = document.createElement("a");
            link.download = "canvas-merged.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            return new Promise((resolve) => {
                resolve(imgList);
            })
        }).then((imgList) => {console.log(imgList)});
        
    };

    input.click();
}