const COLS = 28;
const ROWS = 22;
const BLOCK_SIZE = 20;
const IMAGE = document.getElementById("apple");

const COLOR_MAPPING = [
    'red',
    'pink',
    'yellow',
    'black',
    'blue',
    'green',
    'yellowgreen',
    'white'
];

const KEY_CODES = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    UP: 'ArrowUp',
};

const CANVAS = document.getElementById('board');
const CTX = CANVAS.getContext('2d');
CANVAS.width = COLS * BLOCK_SIZE;
CANVAS.height = ROWS * BLOCK_SIZE;
CTX.fillStyle = COLOR_MAPPING[5];
CTX.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

// Tọa độ
class Vector2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        // CTX.fillStyle = COLOR_MAPPING[0];
        // CTX.fillRect(this.x * BLOCK_SIZE, this.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        CTX.drawImage(IMAGE, this.x * BLOCK_SIZE, this.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    clear() {
        CTX.fillStyle = COLOR_MAPPING[5];
        CTX.fillRect(this.x * BLOCK_SIZE, this.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    randomNumber(snake) {
        var kt = false
        while (!kt) {
            this.x = Math.floor(Math.random() * COLS);
            this.y = Math.floor(Math.random() * ROWS);
            kt = snake.body.every((value) => {
                return value.x != this.x && value.y != this.y;
            });
        }
    }

    spawn(snake) {
        this.randomNumber(snake);
        this.draw();
    }

}

// draw Snake
class Snake {
    constructor() {
        this.body = [
            new Vector2d(CANVAS.width / 2, CANVAS.height / 2),
            new Vector2d(CANVAS.width / 2 - BLOCK_SIZE, CANVAS.height / 2),
            new Vector2d(CANVAS.width / 2 - 2 * BLOCK_SIZE, CANVAS.height / 2),
            new Vector2d(CANVAS.width / 2 - 3 * BLOCK_SIZE, CANVAS.height / 2)
        ]
        this.speed = new Vector2d(1, 0);
        this.check = false;
    }

    draw() {
        CTX.fillStyle = COLOR_MAPPING[1];
        CTX.fillRect(this.body[0].x, this.body[0].y, BLOCK_SIZE, BLOCK_SIZE);
        for (let i = 1; i < this.body.length; i++) {
            CTX.fillStyle = COLOR_MAPPING[2];
            CTX.fillRect(this.body[i].x, this.body[i].y, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    clear() {
        for (let i = 0; i < this.body.length; i++) {
            CTX.fillStyle = COLOR_MAPPING[5];
            CTX.fillRect(this.body[i].x, this.body[i].y, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    move() {
        this.clear();
        for (let i = this.body.length - 1; i >= 1; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        this.body[0].x += this.speed.x * BLOCK_SIZE;
        this.body[0].y += this.speed.y * BLOCK_SIZE;
        this.draw();
    }

    checkend() {
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                this.check = true;
            }
        }

    }

    reset() {
        this.body = [
            new Vector2d(CANVAS.width / 2, CANVAS.height / 2),
            new Vector2d(CANVAS.width / 2 - BLOCK_SIZE, CANVAS.height / 2),
            new Vector2d(CANVAS.width / 2 - 2 * BLOCK_SIZE, CANVAS.height / 2),
            new Vector2d(CANVAS.width / 2 - 3 * BLOCK_SIZE, CANVAS.height / 2)
        ]
        this.speed = new Vector2d(1, 0);
        this.check = false;
        this.draw();
    }
}

snake = new Snake();
snake.draw();
food = new Food();

const timePlay = 100;
const PLAY_BTN = document.querySelector('.play-btn');
const SCORE = document.getElementById('score');

PLAY_BTN.onclick = () => {

    var score = 0;
    CTX.fillStyle = COLOR_MAPPING[5];
    CTX.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    snake.reset();
    food.spawn(snake);
    SCORE.innerHTML = score;

    var refresh = setInterval(() => {
        if (snake.body[0].y === 22 * BLOCK_SIZE) {
            snake.body[0].y = 0 * BLOCK_SIZE;
        }
        else if (snake.body[0].y === -1 * BLOCK_SIZE) {
            snake.body[0].y = 22 * BLOCK_SIZE;
        }
        else if (snake.body[0].x === 28 * BLOCK_SIZE) {
            snake.body[0].x = 0 * BLOCK_SIZE;
        }
        else if (snake.body[0].x === -1 * BLOCK_SIZE) {
            snake.body[0].x = 28 * BLOCK_SIZE;
        }
        if (snake.body[0].x === food.x * BLOCK_SIZE && snake.body[0].y === food.y * BLOCK_SIZE) {
            snake.body.push(new Vector2d(food.x * BLOCK_SIZE, food.y * BLOCK_SIZE));
            snake.draw();
            score++;
            SCORE.innerHTML = score;
            food.spawn(snake);
        }
        snake.move();
        snake.checkend();
        if (snake.check) {
            clearInterval(refresh);
        }
    }, timePlay);

    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case KEY_CODES.DOWN:
                if (snake.body[1].y === snake.body[0].y + BLOCK_SIZE) {
                    break;
                }
                snake.speed = new Vector2d(0, 1);
                break;
            case KEY_CODES.UP:
                if (snake.body[1].y === snake.body[0].y - BLOCK_SIZE) {
                    break;
                }
                snake.speed = new Vector2d(0, -1);
                break;
            case KEY_CODES.RIGHT:
                if (snake.body[1].x === snake.body[0].x + BLOCK_SIZE) {
                    break;
                }
                snake.speed = new Vector2d(1, 0);
                break;
            case KEY_CODES.LEFT:
                if (snake.body[1].x === snake.body[0].x - BLOCK_SIZE) {
                    break;
                }
                snake.speed = new Vector2d(-1, 0);
                break;
            default:
                break;

        }
    });
}