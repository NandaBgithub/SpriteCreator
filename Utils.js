// this Utils folder will contain
// convenient math related functions that I dont know where to put

// Converts the viewport x and y values
// to the corresponding grid cell in the canvas
function calculate_grid_position(canvas, clientx, clienty, pixelWidth){
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((clientx - rect.left) / pixelWidth);
    let y = Math.floor((clienty - rect.top) / pixelWidth);
    return {x: x, y: y};
}

export {calculate_grid_position}
