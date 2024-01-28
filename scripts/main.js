import Ball from './classes/ball.js';
import Cell from './classes/cell.js';
import { createElement } from './assets/utils.js';

const stats = document.querySelector('.stats');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const config = {
    size: 0.65,

    speed: 20,
    bounds: null,

    cellCount: 24,
    cellSize: null,

    ballSize: null,

    types: [
        'spring',
        'summer',
        'autumn',
        'winter',
    ],

    elems: {
        spring: null,
        summer: null,
        autumn: null,
        winter: null,
    },
    
    ballColors: {
        spring: '#007D38',
        summer: '#d49400',
        autumn: '#aB2417',
        winter: '#2265d4',
    },

    colors: {
        spring: '#0F9D58',
        summer: '#F4B400',
        autumn: '#DB4437',
        winter: '#4285F4',
    }
};

let balls = [];
const cells = [];


function init() {
    config.cellSize = Math.trunc((Math.min(window.innerWidth, window.innerHeight) * config.size) / config.cellCount);
    config.ballSize = config.cellSize / 2;

    canvas.width = config.cellCount * config.cellSize;
    canvas.height = canvas.width;

    stats.style.width = `${canvas.width}px`;

    config.bounds = {
        left: 0,
        top: 0,
        right: canvas.width,
        bottom: canvas.height,
    };

    balls.push(
        new Ball({
            x: canvas.height / 4,
            y: canvas.height / 4,
            size: config.ballSize,
            color: config.ballColors.spring,
            cellColor: config.colors.spring,
            type: 'spring',
            speed: config.speed,
        }),
        new Ball({
            x: canvas.height / 4 * 3,
            y: canvas.height / 4,
            size: config.ballSize,
            color: config.ballColors.summer,
            cellColor: config.colors.summer,
            type: 'summer',
            speed: config.speed,
        }),
        new Ball({
            x: canvas.height / 4,
            y: canvas.height / 4 * 3,
            size: config.ballSize,
            color: config.ballColors.winter,
            cellColor: config.colors.winter,
            type: 'winter',
            speed: config.speed,
        }),
        new Ball({
            x: canvas.height / 4 * 3,
            y: canvas.height / 4 * 3,
            size: config.ballSize,
            color: config.ballColors.autumn,
            cellColor: config.colors.autumn,
            type: 'autumn',
            speed: config.speed,
        }),
    );

    for (let j = 0; j < config.cellCount; j++) {
        for (let i = 0; i < config.cellCount; i++) {
            let type = '';
            if (i < config.cellCount / 2) {
                if (j < config.cellCount / 2) {
                    type = 'spring';
                } else {
                    type = 'winter';
                }
            } else {
                if (j < config.cellCount / 2) {
                    type = 'summer';
                } else {
                    type = 'autumn';
                }
            }
            const color = config.colors[type];

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

    for (const type of config.types) {
        const elem = createElement(`<div class='stat ${type}'>
    <span class='color' style='background-color:${config.colors[type]}'></span>
    <span class='name'>${type}:</span>
    <span class='count'></span>
</div>`);

        config.elems[type] = elem;

        stats.appendChild(elem);
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let counts = config.types.reduce((acc, type) => {
        acc[type] = 0;
        return acc;
    }, {});

    for (const cell of cells) {
        cell.draw(ctx);

        counts[cell.type] += 1;
    }

    for (const type of config.types) {
        if (counts[type] === 0) {
            balls = balls.filter((ball) => ball.type !== type);
        }

        config.elems[type].children[2].textContent = counts[type];
    }

    for (const ball of balls) {
        ball.draw(ctx);
    }
}

let animation = null;
function animate() {
    for (const ball of balls) {
        ball.move(config.bounds);
        ball.collide(config.bounds, cells);
    }

    draw();

    animation = requestAnimationFrame(animate);
}

canvas.addEventListener('click', () => {
    if (animation === null) {
        animate();
    } else {
        cancelAnimationFrame(animation);
        animation = null;
    }
});

init();

setTimeout(() => {
    animate();
}, 500);