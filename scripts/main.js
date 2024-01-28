import Ball from './classes/ball.js';
import Cell from './classes/cell.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const config = {
    size: 0.8,

    speed: 15,
    bounds: null,

    cellCount: 30,
    cellSize: null,

    ballSize: 12,
    ballOffset: 30,
    dayColor: '#f3f3fa',
    nightColor: '#131329',
};

const balls = [];
const cells = [];


function init() {
    config.cellSize = Math.trunc((Math.min(window.innerWidth, window.innerHeight) * 0.8) / config.cellCount);

    canvas.width = config.cellCount * config.cellSize;
    canvas.height = canvas.width;

    config.bounds = {
        left: 0,
        top: 0,
        right: canvas.width,
        bottom: canvas.height,
    };

    balls.push(
        new Ball({
            x: config.ballOffset + config.ballSize,
            y: canvas.height / 2,
            type: 'day',
            size: config.ballSize,
            color: config.nightColor,
            cellColor: config.dayColor,
            direction: 'right',
            speed: config.speed,
        }),
        new Ball({
            x: canvas.width - config.ballSize - config.ballOffset,
            y: canvas.height / 2,
            type: 'night',
            size: config.ballSize,
            color: config.dayColor,
            cellColor: config.nightColor,
            direction: 'left',
            speed: config.speed,
        })
    );

    for (let j = 0; j < config.cellCount; j++) {
        for (let i = 0; i < config.cellCount; i++) {
            const type = i < config.cellCount / 2 ? 'day' : 'night'
            const color = config[`${type}Color`];

            cells.push(
                new Cell({
                    x: i * config.cellSize, 
                    y: j * config.cellSize, 
                    size: config.cellSize, 
                    color,
                    type,
                })
            );
        }
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const cell of cells) {
        cell.draw(ctx);
    }

    for (const ball of balls) {
        ball.draw(ctx);
    }
}

function animate() {
    for (const ball of balls) {
        ball.move(config.bounds);
        ball.collide(config.bounds, cells);
    }

    draw();

    requestAnimationFrame(animate);
}

init();
animate();