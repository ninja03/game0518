const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dino = {
    x: 50,
    y: canvas.height - 40,
    width: 20,
    height: 40,
    vy: 0,
    gravity: 0.8,
    jumpPower: -12,
    onGround: true,
};

function resetDino() {
    dino.y = canvas.height - dino.height;
    dino.vy = 0;
    dino.onGround = true;
}

let obstacles = [];
let spawnTimer = 0;
let score = 0;
let gameOver = false;

resetDino();

function jump() {
    if (dino.onGround && !gameOver) {
        dino.vy = dino.jumpPower;
        dino.onGround = false;
    } else if (gameOver) {
        obstacles = [];
        score = 0;
        gameOver = false;
        spawnTimer = 0;
        resetDino();
    }
}

function spawnObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 30,
        width: 20,
        height: 30,
    });
}

function update() {
    if (gameOver) return;

    if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = 90 + Math.random() * 60;
    } else {
        spawnTimer--;
    }

    obstacles.forEach(o => {
        o.x -= 6;
    });
    obstacles = obstacles.filter(o => o.x + o.width > 0);

    dino.vy += dino.gravity;
    dino.y += dino.vy;

    if (dino.y > canvas.height - dino.height) {
        dino.y = canvas.height - dino.height;
        dino.vy = 0;
        dino.onGround = true;
    }

    obstacles.forEach(o => {
        if (dino.x < o.x + o.width &&
            dino.x + dino.width > o.x &&
            dino.y < o.y + o.height &&
            dino.y + dino.height > o.y) {
            gameOver = true;
        }
    });

    score += 0.1;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    ctx.fillStyle = '#0a0';
    obstacles.forEach(o => {
        ctx.fillRect(o.x, o.y, o.width, o.height);
    });

    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + Math.floor(score), 10, 20);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '20px sans-serif';
        ctx.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        jump();
    }
});

document.addEventListener('mousedown', jump);
document.addEventListener('touchstart', e => {
    e.preventDefault();
    jump();
});

gameLoop();
