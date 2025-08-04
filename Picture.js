class Picture {
    // (width: int, height: int, pixels: String[])
    constructor(width, height, pixels){
        this.width = width;
        this.height = height;
        // 1D Array representing
        // picture frame. Index using,
        // pixels[x + y * this.width]
        this.pixels = pixels;    
    }

    /*  
        Reset the picture by filling it with the current
        color fill.
    */
    // (width: int, height: int, color: String) => Picture
    static empty(width, height, color){
        let pixels = new Array(width * height).fill(color);
        return new Picture(width, height, pixels);
    }

    /*
        Get pixel
    */
    // (x: int, y: int) => String
    pixel(x, y){
        return this.pixels[x+y * this.width];
    }

    /*
        Draw new pixels into its designated location
        in the pixels array.
    */
    // (pixels: Object[]) => Picture
    draw(pixels){
        let copy = this.pixels.slice();
        for (let {x, y, color} of pixels){
            copy[x + y * this.width] = color;
        }

        return new Picture(this.width, this.height, copy);
    }
}