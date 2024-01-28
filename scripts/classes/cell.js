class Cell {
    x = 0;
    y = 0;

    size = 0;
    color = null;
    type = null;
    
    diameter = null;

    constructor({ x, y, type, size, color }) {
        this.x = x;
        this.y = y;

        this.type = type;
        this.size = size;
        this.color = color;

        this.diameter = Math.sqrt(2 * size ** 2);
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);

        ctx.restore();
    }

    get rect() {
        return {
            left: this.x,
            right: this.x + this.size,
            
            top: this.y,
            bottom: this.y + this.size,

            width: this.size,
            height: this.size,

            center: {
                x: this.x + this.size / 2,
                y: this.y + this.size / 2,
            },
        }
    }
}

export default Cell;