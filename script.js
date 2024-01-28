let KEY_SPACE = false;
let KEY_UP = false;
let KEY_DOWN = false;
let canvas;
let ctx;
let backgroundImage = new Image();
let backgroundMusic = document.getElementById("backgroundMusic");
let canShoot = true;
let gameStarted = false;
let highscore = 0;
let gameActive = true;

let rocket = {
    x: 50,
    y: 200,
    width: 120,
    height: 80,
    src: './img/rocket.png',
};

let enemies = [];
let shots = [];

let background = {}

document.addEventListener('keydown', function (e) {
    if (gameActive) {
        if (e.key == " ") {
            if (canShoot) {
                KEY_SPACE = true;
            } else {
                KEY_SPACE = false;
            }
        }
        if (e.key == "ArrowUp") {
            KEY_UP = true;
        }
        if (e.key == "ArrowDown") {
            KEY_DOWN = true;
        }
    }
});

document.addEventListener('keyup', function (e) {
    if (e.key == " ") {
        KEY_SPACE = false;
    }
    if (e.key == "ArrowUp") {
        KEY_UP = false;
    }
    if (e.key == "ArrowDown") {
        KEY_DOWN = false;
    }
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        loadImages();
        backgroundMusic.play();
        setInterval(update, 1000 / 60);
        setInterval(createEnemy, getRandomInt(500, 4000)); //erstellt Gegner zufällig zwischen 2 und 5 sekunden
        setInterval(checkCollisions, 1000 / 30);
        setInterval(checkShots, 1000 / 15);
        draw();
    }
}

function checkCollisions() {
    enemies.forEach(function (enemy) {
        if (rocket.x + rocket.width > enemy.x &&
            rocket.y + rocket.height > enemy.y &&
            rocket.x < enemy.x + enemy.width &&
            rocket.y < enemy.y + enemy.height
        ) {
            document.getElementById('hitSound').play();
            rocket.img.src = './img/explosion.png';
            gameActive = false;
            setTimeout(() => {
                resetGame();
                gameActive = true;
            }, 2000);
            enemies = enemies.filter(u => u != enemy);
        }
        shots.forEach(function (shot) {
            if (shot.x + shot.width > enemy.x &&
                shot.y + shot.height > enemy.y &&
                shot.x < enemy.x + enemy.width &&
                shot.y < enemy.y + enemy.height &&
                !shot.hit
            ) {
                enemy.hit = true;
                let impactSound = new Audio('./audio/impact.mp3');
                impactSound.play();
                enemy.img.src = 'img/explosion.png';
                shot.hit = true;
                shot.img.src = '';
                highscore += 500;

                setTimeout(() => {
                    enemies = enemies.filter(u => u != enemy);
                }, 100);
            }
        });

    });
}

function createEnemy() {
    let enemy = {
        x: 750,
        y: Math.random() * (canvas.height - 50),
        width: 50,
        height: 35,
        src: './img/enemy.png',
        img: new Image()
    };
    enemy.img.src = enemy.src; //Gegner-Bild wird geladen
    enemies.push(enemy);


}

function checkShots() {
    if (KEY_SPACE && canShoot) {
        let shot = {
            x: rocket.x + 110,
            y: rocket.y + 22,
            width: 60,
            height: 20,
            src: './img/shot.png',
            img: new Image()
        };
        shot.img.src = shot.src;
        shots.push(shot);
        canShoot = false;
        let shootSound = new Audio('./audio/laser.mp3');
        shootSound.play();
    } else if (!KEY_SPACE) {
        canShoot = true;
    }
}

function update() {

    const rocketSpeed = 6;
    const enemySpeed = 3;
    const shotSpeed = 15;

    if (KEY_UP && rocket.y > 0) {
        rocket.y -= rocketSpeed;
    }
    if (KEY_DOWN && rocket.y + rocket.height < canvas.height) {
        rocket.y += rocketSpeed;
    }

    enemies.forEach(function (enemy) {
        enemy.x -= enemySpeed;
    });
    shots.forEach(function (shot) {
        shot.x += shotSpeed;
    });
}

function loadImages() {
    backgroundImage.src = './img/background.jpg';
    rocket.img = new Image();
    rocket.img.src = rocket.src;
}

function draw() {
    ctx.drawImage(backgroundImage, 0, 0);
    ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

    enemies.forEach(function (enemy) {
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    });
    shots.forEach(function (shot) {
        if (!shot.hit) {
            ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
        }
    });
    const hiScoreText = 'Hi-Score: ' + highscore;
    const hiScoreTextWidth = ctx.measureText(hiScoreText).width;

    const hiScoreX = Math.max(canvas.width - 20 - hiScoreTextWidth, 10);

    ctx.fillStyle = '#fff';
    ctx.font = '20px Pixelify Sans, sans-serif';
    ctx.fillText(hiScoreText, hiScoreX, 30);

    requestAnimationFrame(draw);
}

function resetGame() {
    rocket.x = 50;
    rocket.y = 200;
    enemies = [];
    shots = [];
    rocket.img.src = './img/rocket.png';
}