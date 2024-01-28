import { clamp, distance, circleIntersectWithRectangle } from '../assets/utils.js';

class Ball {
    x = 0;
    y = 0;

    size = 10;
    color = null;
    cellColor = null;
    type = null;

    diameter = null;

    sx = 0;
    sy = 0;

    constructor({ x, y, type, size, color, cellColor, speed, direction, randomize = true }) {
        this.x = x;
        this.y = y;

        this.type = type;
        this.size = size;
        this.color = color;
        this.cellColor = cellColor;

        this.diameter = size * 2;

        if (randomize) {
            this.randomize(speed, direction);
        }
    }

    #randomAngle(angleRange, direction) {
        const angle = Math.random() * angleRange - angleRange / 2;

        return (direction === 'left' ? 180 - angle : angle) * Math.PI / 180;
    }

    randomize(speed, direction) {
        const angle = this.#randomAngle(45, direction);

        this.sx = Math.cos(angle) * speed;
        this.sy = Math.sin(angle) * speed;
    }

    move(bounds) {
        this.x += this.sx;
        this.y += this.sy;

        this.x = clamp(bounds.left + this.size, this.x, bounds.right - this.size);
        this.y = clamp(bounds.top + this.size, this.y, bounds.bottom - this.size);
    }

    collide(bounds, cells) {
        const rect = this.rect;

        if (rect.left <= bounds.left || rect.right >= bounds.right) {
            this.sx *= -1;
        }
        if (rect.top <= bounds.top || rect.bottom >= bounds.bottom) {
            this.sy *= -1;
        }

        const relatedCells = cells.filter((cell) => {
            const crect = cell.rect;
            
            if (cell.type !== this.type) {
                const dist = distance(rect.center, crect.center);
                cell.__dist = dist;
                const maxDistance = rect.radius + cell.diameter;

                if (dist <= maxDistance) {
                    return true;
                }
            }

            return false;
        });

        relatedCells.sort((a, b) => a.__dist - b.__dist);

        for (const cell of relatedCells) {
            const [intersects, axis] = circleIntersectWithRectangle(rect, cell.rect);

            if (intersects) {
                cell.type = this.type;
                cell.color = this.cellColor;

                this[`s${axis}`] *= -1;

                break;
            }
        }
    }

    draw(ctx, stroke = false) {
        ctx.save();

        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.color;
        ctx.fill();

        if (stroke) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.restore();
    }

    get rect() {
        return {
            left: this.x - this.size,
            right: this.x + this.size,

            top: this.y - this.size,
            bottom: this.y + this.size,

            width: this.size * 2,
            height: this.size * 2,

            center: {
                x: this.x,
                y: this.y,
            },

            radius: this.size,
        }
    }
}

export default Ball;