const boardX = 100,
    boardY = 100,
    boardWidth = 12,
    boardHeight = 12,
    cellWidth = 50,
    startX = 2,
    startY = 8;

class Ball {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.speed = createVector(cellWidth, cellWidth);
        // this.speed.normalize();
        // this.speed.mult(5);
    }

    move() {
        this.pos.add(this.speed);
    }

    draw() {
        ellipse(this.pos.x, this.pos.y, 5, 5);
    }

    clampX(minV, maxV) {
        this.pos.x = max(minV, this.pos.x);
        this.pos.x = min(maxV, this.pos.x);
    }

    clampY(minV, maxV) {
        this.pos.y = max(minV, this.pos.y);
        this.pos.y = min(maxV, this.pos.y);
    }

    drawLine(x, y) {
        line(x, y, this.pos.x, this.pos.y);
    }
}

let ball;
let iterations;
let lastPos;
let traces = [];

const drawBoard = () => {
    for (let i = 0; i <= boardHeight; i += boardHeight) {
        line(
            boardX,
            boardY + cellWidth * i,
            boardX + boardWidth * cellWidth,
            boardY + cellWidth * i
        );
    }

    for (let i = 0; i <= boardWidth; i += boardWidth) {
        line(
            boardX + cellWidth * i,
            boardY,
            boardX + cellWidth * i,
            boardY + boardHeight * cellWidth
        );
    }

    for (let trace of traces) {
        const { x: x0, y: y0 } = trace.from;
        const { x: x1, y: y1 } = trace.to;
        line(x0, y0, x1, y1);
    }
};

const isCorner = (v) => {
    if (!v?.copy) return false;

    const corners = [
        createVector(boardX, boardY),
        createVector(boardX, boardY + boardHeight * cellWidth),
        createVector(boardX + boardWidth * cellWidth, boardY),
        createVector(
            boardX + boardWidth * cellWidth,
            boardY + boardHeight * cellWidth
        ),
    ];

    for (let corner of corners) {
        if (v.copy().dist(corner) < cellWidth / 5) return true;
    }

    return false;
};

function setup() {
    iterations = 0;
    ball = new Ball(boardX + cellWidth * startX, boardY + cellWidth * startY);
    createCanvas(windowWidth, windowHeight);
    lastPos = createVector(ball.pos.x, ball.pos.y);
}

function draw() {
    if (iterations % 1 == 0 && (!isCorner(ball.pos) || iterations == 0)) {
        clear();
        drawBoard();

        ball.move();
        ball.clampX(boardX, boardX + boardWidth * cellWidth);
        ball.clampY(boardY, boardY + boardHeight * cellWidth);
        ball.draw();
        ball.drawLine(lastPos.x, lastPos.y);

        const { x, y } = ball.pos;
        if (x == boardX + boardWidth * cellWidth || x == boardX) {
            traces.push({
                from: lastPos.copy(),
                to: createVector(x, y),
            });
            lastPos = createVector(x, y);

            ball.speed = createVector(-ball.speed.x, ball.speed.y);
        } else if (y == boardY + boardHeight * cellWidth || y == boardY) {
            traces.push({
                from: lastPos.copy(),
                to: createVector(x, y),
            });
            lastPos = createVector(x, y);

            ball.speed = createVector(ball.speed.x, -ball.speed.y);
        }
    }
    iterations++;
}
