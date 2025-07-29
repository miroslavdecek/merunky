const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: 'rgb(255, 182, 193)',
    speed: 5,
    dx: 0
};

// Apricots
const apricots = [];
const apricotProps = {
    width: 20,
    height: 20,
    color: 'orange',
    speed: 2
};

let score = 0;
let gameOver = false;

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw apricots
function drawApricots() {
    apricots.forEach(apricot => {
        ctx.fillStyle = apricotProps.color;
        ctx.fillRect(apricot.x, apricot.y, apricotProps.width, apricotProps.height);
    });
}

// Move player
function movePlayer() {
    player.x += player.dx;

    // Wall detection
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Game loop
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 40);
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawApricots();
    movePlayer();
    updateApricots();

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    requestAnimationFrame(gameLoop);
}

// Spawn apricots
function spawnApricot() {
    const x = Math.random() * (canvas.width - apricotProps.width);
    apricots.push({ x: x, y: 0 });
}

// Update apricots
function updateApricots() {
    apricots.forEach((apricot, index) => {
        apricot.y += apricotProps.speed;

        // Collision detection
        if (
            apricot.x < player.x + player.width &&
            apricot.x + apricotProps.width > player.x &&
            apricot.y < player.y + player.height &&
            apricot.y + apricotProps.height > player.y
        ) {
            apricots.splice(index, 1);
            score++;
        }

        // Off screen
        if (apricot.y + apricotProps.height > canvas.height) {
           gameOver = true;
        }
    });
}


// Keyboard event handlers
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        player.dx = player.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        player.dx = -player.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Start game
setInterval(spawnApricot, 2000);
gameLoop();
