import { calculate_grid_position } from "./Utils.js";
import ToolEnum from "./ToolEnum.js"

class DrawingCanvas {
    constructor(width, height, state){
        this.width = width;
        this.height = height;
        this.tool = state.tool;
        this.pixelWidth = state.pixelWidth;
        this.color = state.color;
        this.canvasElement = this.createCanvasElement();
        this.prevX = null;
        this.prevY = null;
    }

    createCanvasElement(){
        let canvasElement = document.createElement("canvas");
        canvasElement.width = this.width;
        canvasElement.height = this.height;

        //  mouse and touch listeners
        this._addMouseListeners(canvasElement);
        this._addTouchListeners(canvasElement);

        return canvasElement;
    }

    onStateChange(state){
        this.tool = state.tool;
        this.pixelWidth = state.pixelWidth;
        this.color = state.color;
    }

    /* GETTERS */
    /////////////

    getCanvasElement(){
        return this.canvasElement;
    }

    /* PRIVATE METHODS */
    /////////////////////

    _addMouseListeners(canvasElement){
        canvasElement.addEventListener("mousedown", (event) => {
            // event is the browser's MouseEvent object
            // 0 == left click
            // This disables right click on canvas
            if (event.button != 0) return;

            console.log("left mouse click down");
            
            // mousemove as a prop, added only when 
            // mousedown to detect mouse drag
            canvasElement.onmousemove  =
            (event) => {

                console.log("mouse drag detected");    
                let curCell = calculate_grid_position(canvasElement, event.clientX, event.clientY, this.pixelWidth);
               
                // Initial click drag will have null previous position
                if (this.prevX === null || this.prevY === null){
                    if (this.tool === ToolEnum.DRAW){
                        this._draw(canvasElement, curCell.x, curCell.y);
                    }
                    
                    if (this.tool === ToolEnum.ERASER){
                        this._erase(canvasElement, curCell.x, curCell.y, this.pixelWidth);
                    }

                    this.prevX = curCell.x;
                    this.prevY = curCell.y;
                }

                // new square, fill inbetween
                if (curCell.x !== this.prevX || curCell.y !== this.prevY){
                    this._drawLineBetweenCells(canvasElement, this.prevX, this.prevY, curCell.x, curCell.y, this.tool);
                    this.prevX = curCell.x;
                    this.prevY = curCell.y;
                }        
            }
        });

        canvasElement.addEventListener("mouseup", 
        (event) => {
            canvasElement.onmousemove = null;
            console.log("mouse up detected");
            console.log("onmousemove prop set to: " 
            + canvasElement.onmousemove);

            this.prevX = null;
            this.prevY = null;
        });


    }

    _addTouchListeners(canvasElement){
        canvasElement.addEventListener("touchstart", (event) => {
            // prevents mouse events to fire on 
            // browser along with touch events
            event.preventDefault();
            // event is browser's TouchEvent, 
            // contains a list of touches
            // this enables multi-touch draw
            if (event.touches.length == 1){
                console.log("touchstart detected");
                canvasElement.ontouchmove = () => {
                    canvasElement.addEventListener("touchmove", 
                    (event) => {
                        event.preventDefault();
                        console.log("touchmove detected");
                    }, {passive: false});     
                }
            }
        }, {passive: false});

        canvasElement.addEventListener("touchend", 
        (event) => {
            canvasElement.ontouchmove = null;
            console.log("touchend detected");
        }, {passive: false});
    }

    _draw(canvas, x, y){
        let canvasContext = canvas.getContext("2d");
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(x * this.pixelWidth, y * this.pixelWidth, this.pixelWidth, this.pixelWidth);
    }

    _drawLineBetweenCells(canvas, x0, y0, x1, y1, tool){
        let dx = Math.abs(x0 - x1);
        let dy = Math.abs(y0 - y1);

        let udx = x0 < x1 ? 1 : -1;
        let udy = y0 < y1 ? 1 : -1;

        let mostlyFactor = dx - dy;

        while(true){
            if (tool == ToolEnum.DRAW){
                this._draw(canvas, x0, y0);
            }

            if (tool == ToolEnum.ERASER){
                this._erase(canvas, x0, y0, this.pixelWidth)
            }
            
            if (x0 === x1 && y0 === y1) break;

            // to avoid floating points
            let mostlyFactor2 = 2 * mostlyFactor;

            // Moved too far vertical, coursecorrect and compensate horizontally
            if (mostlyFactor2 > -dy){
                mostlyFactor -= dy;
                x0 += udx;
            }

            // Moved too far horizontal, coursecorrect and compensate vertically
            if (mostlyFactor2 < dx){
                mostlyFactor += dx;
                y0 += udy;
            }
        }
    }

    _erase(canvas, x, y, pixelWidth){
        let context = canvas.getContext('2d');
        context.clearRect(x*pixelWidth, y*pixelWidth, pixelWidth, pixelWidth);
    }
}

export default DrawingCanvas;