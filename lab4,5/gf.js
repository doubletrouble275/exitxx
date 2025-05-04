let isFallingFromPlatform = false;
let fallFromPlatformSpeed = 0;
const platformFallGravity = 0.5;
let targetFallY = 0;
let killSound; // Переменная для звука
let oversound;
let jumpSound;
let vict;
let backd;
let currenter = false; // Переменная для отслеживания состояния в игре
let volumeSlider;
let volumeSlide;
let muteIcon; // Переменная для изображения иконки отключения звука
let isMuted = false; // Переменная для отслеживания состояния звука
let platforms = [];
let dagger = {
    x: 0,
    y: 0,
    isVisible: false,
    isThrown: false,
    isHeld: false,
    speedX: 0,
    speedY: 0,
    direction: 1,
    width: 20,
    height: 40,
    lastThrowTime: 0
};
// Переменные для камеры
let cameraOffset = 0;
const cameraMargin = 200; // Отступ от границы экрана для начала промотки
const worldWidth = 1600; // Ширина игрового мира

function preload() {
    // Загружаем звуковые файлы
    killSound = new Audio("assets/sound.mp3");
    oversound = new Audio("assets/gameover.mp3");
    backd = new Audio("assets/back.mp3");
    jumpSound = new Audio("assets/jump.mp3");
    vict = new Audio("assets/vict.mp3");
    muteIcon = loadImage("images/mute.png", 
        () => console.log("Изображени"), 
        () => console.error("Ошибка"));
}

let gameObjects = {
    scenery: [], // Массив для объектов фона
    collectable: [], // Массив для собираемых предметов
    enemies: [] // Массив для врагов
};

let isSoundPlaying = false;
let mouseXPos;
let mouseYPos;
let mouseSpeedX;
let mouseSpeedY;
let isMouseMoving = false;
let showMouse = false;
let crabX;
let crabY;
let plat1 = false;
let plat2 = false;
let isJumping = false;
let jumpHeight = 0;
const jumpForce = 12;
const gravity = 0.8;
let isFalling = false;
let fallSpeed = 0;
let score = 0;
let enemySpeed = 2;
let enemyDirection = -1; // Направление врагов
let enemies = []; // Массив для хранения врагов

let isRespawnVisible = false;
let isCrabAlive = true;
let isMouseAlive = false;
let mouseDeathCount = 0;

let currentScreen = 'menu';

function setup() {
    createCanvas(800, 600);
    background(16, 100, 250);
    crabX = 400;
    crabY = 500;
    inMousePosition(); // Инициализация позиции мыши

    // функции рисования объектов в массивы
    gameObjects.scenery.push(drawTree);
    gameObjects.scenery.push(drawSign);
    gameObjects.scenery.push(drawCanyon);
    gameObjects.scenery.push(drawback);
    gameObjects.collectable.push(drawMouse);
    platforms.push({ x: 300, y: 440, width: 150, height: 10 }); // Первая платформа
    platforms.push({ x: 480, y: 380, width: 150, height: 10 }); // Вторая платформа
    platforms.push({ x: 630, y: 330, width: 150, height: 10 }); // Третья платформа
    platforms.push({ x: 840, y: 430, width: 150, height: 10 }); // Платформа справа
    platforms.push({ x: 1020, y: 380, width: 150, height: 10 }); // Платформа справа
    platforms.push({ x: 1130, y: 330, width: 150, height: 10 }); // Платформа справа

    //слайдер для громкости музыки
    volumeSlider = createSlider(0, 1, 1, 0.01);
    volumeSlider.position(303, 270);
    volumeSlider.style('width', '200px');
    volumeSlider.input(updateVolume); //  при изменении громкости
    volumeSlider.hide();
    volumeSlide = createSlider(0, 1, 1, 0.01);
    volumeSlide.position(303, 320);
    volumeSlide.style('width', '200px');
    volumeSlide.input(updateVolume2);
    volumeSlide.hide();
}
function spawnDagger() {
    //  (indices 3, 4, 5)
    let platformIndex = floor(random(3)) + 3;
    let platform = platforms[platformIndex];
    
    dagger.x = platform.x + platform.width/2;
    dagger.y = platform.y - 30;
    dagger.isVisible = true;
    dagger.isThrown = false;
    dagger.isHeld = false;
}

function draw() {
    backd.play();
    // какой экран отрисовывать
    if (currentScreen === 'menu') {
        drawMenu();
    } else if (currentScreen === 'game') {
        drawGame();
    } else if (currentScreen === 'settings') {
        drawSettings();
    }
}

function drawMenu() {
    resetGame();
    background(0);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("CRAB GAME", width / 2, height / 3);

    if (drawButton(width / 2 - 50, height / 2, 100, 50, "PLAY")) {
        currentScreen = 'game';
    }

    if (drawButton(width / 2 - 50, height / 2 + 70, 100, 50, "SETTINGS")) {
        currentScreen = 'settings';
        volumeSlider.show();
        volumeSlide.show();
    }
}

function drawSettings() {
    background(50);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("SETTINGS", width / 2, height / 3);

    textSize(16);
    text("Music:", width / 2, height / 3 + 50);
    text("sounds:", width / 2, height / 3 + 105);
    textSize(16);

    // в основном меню или в игре
    if (!currenter) {
        if (drawButton(width / 2 - 50, height / 2 + 200, 100, 50, "BACK")) {
            currentScreen = 'menu';
            volumeSlider.hide();
            volumeSlide.hide();
        }
    }
    if (currenter) {
        if (drawButton(width / 2 - 50, height / 2 + 200, 100, 50, "BACK")) {
            currentScreen = 'game';
            volumeSlider.hide();
            volumeSlide.hide();
            currenter = false;
        }
    }
}
function updateAndDrawDagger() {
    // 
    if (!dagger.isThrown && !dagger.isHeld && dagger.isVisible) {
        push();
        translate(dagger.x, dagger.y);
        fill(200);
        beginShape();
        vertex(0, -15);
        vertex(5, 0);
        vertex(0, 5);
        vertex(-5, 0);
        endShape(CLOSE);
        
        // Handle
        fill(139, 69, 19);
        rect(-3, 5, 6, 15);
        
     
        fill(192, 192, 192);
        ellipse(0, 20, 8, 8);
        pop();
    }
    
    // flying dagger
    if (dagger.isThrown) {
        push();
        translate(dagger.x, dagger.y);
        rotate(dagger.direction === 1 ? 0 : PI);
        // Blade
        fill(200);
        beginShape();
        vertex(0, -15);
        vertex(5, 0);
        vertex(0, 5);
        vertex(-5, 0);
        endShape(CLOSE);
        
        // Handle
        fill(139, 69, 19);
        rect(-3, 5, 6, 15);
        
       
        fill(192, 192, 192);
        ellipse(0, 20, 8, 8);
        pop();
        
        // Update position
        dagger.x += dagger.speedX;
        dagger.y += dagger.speedY;
        
        // Check enemy collisions
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            if (abs(dagger.x - enemy.x) < 20 && abs(dagger.y - enemy.y) < 30) {
                enemies.splice(i, 1);
                score += 1;
                playSound();
                dagger.isVisible = true;
                dagger.isThrown = false;
                addNewEnemy();
                break;
            }
        }
        
        // Check boundaries
        if (dagger.x < cameraOffset || dagger.x > cameraOffset + width || 
            dagger.y < 0 || dagger.y > height) {
            dagger.isVisible = true;
            dagger.isThrown = false;
            // Respawn dagger on platform when it goes off-screen
            if (isCrabAlive) spawnDagger();
        }
    }
    
    //dagger in crabs hand
    if (dagger.isHeld && isCrabAlive) {
        let handX = crabX + (keyIsDown(68) || keyIsDown(100) ? 25 : -25);
        let handY = crabY - 10;
        push();
        translate(handX, handY);
        rotate((keyIsDown(68) || keyIsDown(100) ? -PI/4 : -3*PI/4));
        
        fill(200);
        beginShape();
        vertex(0, -15);
        vertex(5, 0);
        vertex(0, 5);
        vertex(-5, 0);
        endShape(CLOSE);
        
        
        fill(139, 69, 19);
        rect(-3, 5, 6, 15);
        
       
        fill(192, 192, 192);
        ellipse(0, 20, 8, 8);
        pop();
    }
    
    // Check dagger pickup
    if (dagger.isVisible && !dagger.isThrown && !dagger.isHeld && 
        abs(crabX - dagger.x) < 30 && abs(crabY - dagger.y) < 30) {
        dagger.isHeld = true;
        dagger.isVisible = true;
    }
}
function drawGame() {
    
    
    currenter = true;
    background(16, 100, 250);
    
    // Применяем смещение камеры только для игровых объектов
    translate(-cameraOffset, 0);
    
    // Рисуем все игровые объекты с учетом камеры
    for (let drawFunction of gameObjects.scenery) {
        drawFunction();
    }
    drawRightBackground();
   

    if (showMouse && isMouseAlive) {
        for (let collectableFunction of gameObjects.collectable) {
            collectableFunction(mouseXPos + cameraOffset, mouseYPos);
        }
    }

    for (let enemy of enemies) {
        enemy.draw();
    }

    if (isMouseMoving) {
        mouseXPos += mouseSpeedX;
        mouseYPos += mouseSpeedY;
        if (mouseXPos > width || mouseXPos < 0) mouseSpeedX *= -1;
        if (mouseYPos > height || mouseYPos < 0) mouseSpeedY *= -1;
    }
    
    for (let platform of platforms) {
        drawPolicePlatform(platform.x, platform.y, platform.width, platform.height);
    }
    
    if (isCrabAlive) {
        if (isFalling) {
            fallCrab();
        } else {
            moveCrab();
        }
        if (isJumping) {
            jumpCrab();
            jumpSound.play();
        }
        checkCollisions();
    }
    updateAndDrawDagger();
    // Сбрасываем трансформацию 
    resetMatrix();
    
    //  UI 
    displayScore();
    
    if (isRespawnVisible) {
        if (drawButton(width/2 - 50, height/2 - 25, 100, 50, "RESPAWN")) {
            respawnCrab();
        }
    }

    checkEndConditions();
    
    if (drawButton(width - 120, 10, 100, 30, "SETTINGS")) {
        currentScreen = 'settings';
        volumeSlider.show();
        volumeSlide.show();
    }
    
    
    if (drawButton(680, 60, 100, 35, "Main menu")) {
        resetGame();
    }
    
    // Иконка звука (фиксированная позиция)
    let iconSize = 80;
    image(muteIcon, (width - iconSize)/2, 10, iconSize, iconSize);
}
function drawRightBackground() {
    // Дополнительный фон справа
    fill(16, 100, 250);
    quad(800, 0, 800, 400, 1600, 400, 1600, 0);
    fill(255, 255, 255);
    triangle(1520, 200, 1430, 400, 1600, 400);
    fill(75, 83, 32);
    noStroke();
    triangle(1330, 260, 1230, 400, 1400, 400);
    fill(128, 128, 128);
    noStroke();
    triangle(1425, 100, 1310, 400, 1530, 400);
    fill(50, 205, 50);
    quad(800, 600, 1600, 600, 1600, 400, 800, 400);
    stroke(211, 211, 211);
    fill(211, 211, 211);
    circle(900, 100, 60);
    circle(940, 100, 80);
    circle(980, 100, 60);
    circle(980, 40, 30);
    circle(1000, 40, 40);
    circle(1020, 40, 30);
    circle(1460, 100, 55);
    circle(1490, 100, 70);
    circle(1520, 100, 55);
    strokeWeight(3);
    stroke(255, 255, 255);
    fill(255, 255, 255);
    line(1425, 100, 1411, 140);
    line(1438, 140, 1425, 100);
    triangle(1339, 280, 1318, 280, 1330, 260);
    noStroke();
    
    // Деревья справа
    drawTree(1500, 370);
    drawTree(1400, 370);
    drawTree(1300, 500);
    drawTree(1470, 480);
    drawTree(1130, 480);
}
function drawDaggerOnPlatform(x, y) {
    push();
    translate(x, y);
    
    fill(200);
    beginShape();
    vertex(0, -15);
    vertex(5, 0);
    vertex(0, 5);
    vertex(-5, 0);
    endShape(CLOSE);
    
    
    fill(139, 69, 19); 
    rect(-3, 5, 6, 15);
    
   
    fill(192, 192, 192); 
    ellipse(0, 20, 8, 8);
    pop();
}
function drawFlyingDagger(x, y, direction) {
    push();
    translate(x, y);
    rotate(direction === 1 ? 0 : PI); //  if going left
    
    // Blade
    fill(200);
    beginShape();
    vertex(0, -15);
    vertex(5, 0);
    vertex(0, 5);
    vertex(-5, 0);
    endShape(CLOSE);
    
    // Handle
    fill(139, 69, 19);
    rect(-3, 5, 6, 15);
    
    // Pommel
    fill(192, 192, 192);
    ellipse(0, 20, 8, 8);
    pop();
}

function drawDaggerInHand(x, y, direction) {
    push();
    translate(x, y);
    rotate(direction === 1 ? -PI/4 : -3*PI/4);
    
    // Blade
    fill(200);
    beginShape();
    vertex(0, -15);
    vertex(5, 0);
    vertex(0, 5);
    vertex(-5, 0);
    endShape(CLOSE);
    
    // Handle
    fill(139, 69, 19);
    rect(-3, 5, 6, 15);
    
    // Pommel
    fill(192, 192, 192);
    ellipse(0, 20, 8, 8);
    pop();
}
function updateCamera() {
    // Левый край промотки
    if (crabX - cameraOffset < cameraMargin && cameraOffset > 0) {
        cameraOffset = max(0, crabX - cameraMargin);
    }
    // Правый край промотки
    else if (crabX - cameraOffset > width - cameraMargin && cameraOffset < worldWidth - width) {
        cameraOffset = min(worldWidth - width, crabX - (width - cameraMargin));
    }
}

function drawPolicePlatform(x, y, width, height) {
    const stripeWidth = 20; // Ширина одной полосы
    const stripeCount = Math.ceil(width / (stripeWidth * 2));
    
    // Рисуем полосы
    for (let i = 0; i < stripeCount; i++) {
        // Желтая полоса
        fill(255, 255, 0);
        rect(x + i * stripeWidth * 2, y, stripeWidth, height);
        
        // Черная полоса
        fill(0);
        rect(x + i * stripeWidth * 2 + stripeWidth, y, stripeWidth, height);
    }
    
    // Обводка платформы
    stroke(0);
    strokeWeight(1);
    noFill();
    rect(x, y, width, height);
    noStroke();
}

function updateVolume() {
    let volume = volumeSlider.value(); // значение слайдера
    backd.volume = volume; //громкость фонового звука
}

function updateVolume2() {
    let volume2 = volumeSlide.value();
    killSound.volume = volume2;
    oversound.volume = volume2;
    jumpSound.volume = volume2;
}

function checkEndConditions() {
    if (score >= 25) {
        showEndMessage("VICTORY!");
        score = 28;
        vict.play();
        currenter = false;
    } else if (score <= -6) {
        showEndMessage("You're cooked :(");
        currenter = false;
        oversound.play();
    }
}

function showEndMessage(message) {
    isRespawnVisible = false;
    
    // Сбрасываем трансформацию 
    resetMatrix();
    
    // Рисуем полупрозрачный черный фон для сообщения
    fill(0, 0, 0, 200);
    noStroke();
    rect(0, height/2 - 60, width, 120);
    
    // Рисуем само сообщение (фиксированное на экране)
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(message, width / 2, height / 2);

    setTimeout(() => {
        resetGame();
    }, 2500);
}

function resetGame() {
    spawnDagger();
    score = 0;
    isMouseMoving = false;
    isMouseAlive = false;
    isRespawnVisible = false;
    isCrabAlive = true;
    crabX = 400;
    crabY = 500;
    mouseDeathCount = 0;
    currentScreen = 'menu';
    enemySpeed = 2;
    enemies = [];
    cameraOffset = 0;
    addNewEnemy();
}

function checkCollisions() {
    // Проверяем столкновения с врагами
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        
        // Если краб падает на врага (сверху)
        if (abs(crabX - enemy.x) < 30 && 
            crabY < enemy.y && 
            crabY + 25 + fallFromPlatformSpeed > enemy.y && 
            (isJumping || isFallingFromPlatform)) {
            
            // Убиваем врага
            enemy.speed += 0.5;
            enemy.x = 760;
            enemy.y = 500;
            score += 1;
            playSound();
            
            // Отталкиваем краба вверх после удара
            if (isFallingFromPlatform) {
                isFallingFromPlatform = false;
                isJumping = true;
                jumpHeight = jumpForce / 2; // Меньший прыжок после удара
            }
        }
        // Если краб сталкивается с врагом сбоку и не прыгает
        else if ((abs(crabX - enemy.x) < 20 && abs(crabY - enemy.y) < 20) && !isJumping && !isFallingFromPlatform) {
            isRespawnVisible = true;
            isCrabAlive = false;
            score -= 3;
        }
    }

    let onAnyPlatform = false;
    
    // Проверяем столкновения с платформами
    for (let platform of platforms) {
        if (crabX > platform.x && crabX < platform.x + platform.width && 
            crabY + 30 >= platform.y && crabY + 30 <= platform.y + platform.height) {
            
            isJumping = false;
            isFalling = false;
            isFallingFromPlatform = false;
            crabY = platform.y - 30;
            onAnyPlatform = true;
            
            if (platform === platforms[0]) {
                plat1 = true;
            } else {
                plat1 = false;
            }
        }
    }
    
    // Если краб не на платформе и выше земли
    if (!onAnyPlatform && crabY < 500 && !isJumping && !isFallingFromPlatform) {
        isFallingFromPlatform = true;
        fallFromPlatformSpeed = 0;
        targetFallY = 500;
    }
    
    // Обрабатываем падение с платформы
    if (isFallingFromPlatform) {
        fallFromPlatformSpeed += platformFallGravity;
        crabY += fallFromPlatformSpeed;
        
        if (crabY >= targetFallY) {
            crabY = targetFallY;
            isFallingFromPlatform = false;
        } else {
            // Проверяем, не приземлился ли краб на другую платформу во время падения
            for (let platform of platforms) {
                if (crabX > platform.x && crabX < platform.x + platform.width && 
                    crabY + 30 >= platform.y && crabY + 30 <= platform.y + platform.height) {
                    crabY = platform.y - 30;
                    isFallingFromPlatform = false;
                    onAnyPlatform = true;
                    break;
                }
            }
        }
    }

    // Проверяем столкновение с мышью
    if (showMouse && abs(crabX - mouseXPos - cameraOffset) < 30 && crabY < mouseYPos && crabY + 15 > mouseYPos && isMouseAlive) {
        score += 5;
        playSound();
        isMouseAlive = false;
        showMouse = false;
    }

    // Добавляем новых врагов при необходимости
    if (score >= 3 && enemies.length < 2) {
        addNewEnemy();
    }
    if (score >= 10 && enemies.length < 3) {
        addNewEnemy();
    }
}

function playSound() {
    if (isSoundPlaying) {
        killSound.pause(); // Остановка звука
        killSound.currentTime = 0; // Сброс времени воспроизведения
    }
    killSound.play(); // Запуск звука
    isSoundPlaying = true;
}

function addNewEnemy() {
    let spawnRadius = 100; // Радиус, в пределах которого противник не может спавниться
    let newEnemy;

    do {
        newEnemy = {
            x: random(width - 40) + cameraOffset,
            y: 500,
            direction: random([-1, 1]),
            speed: 2,
            draw: function() {
                if (this.direction == -1) {
                    drawSpecificEnemy(this); // Рисуем врага
                } else {
                    drawSpecificEnemy2(this);
                }
                this.x += this.direction * this.speed; // Обновление позиции 
                // Проверка границ экрана
                if (this.x <= cameraOffset || this.x >= cameraOffset + width - 35) {
                    this.direction *= -1;
                }
            }
        };
    } while (abs(newEnemy.x - crabX) < spawnRadius); //противник не спавнится в пределах радиуса

    enemies.push(newEnemy);
}

function drawButton(x, y, w, h, label) {
    fill(255, 255, 0);
    rect(x, y, w, h);
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(label, x + w/2, y + h/2);

    // Проверка нажатия (координаты уже экранные)
    if (mouseIsPressed && mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
        return true;
    }
    return false;
}

function respawnCrab() {
    spawnDagger();
    isRespawnVisible = false;
    isCrabAlive = true;
    crabX = 400;
    crabY = 500;
}

function displayScore() {
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Score: " + score, 10, 10); // Фиксированная позиция
}
function inMousePosition() {
    mouseXPos = random(width);
    mouseYPos = random(height);
    mouseSpeedX = random(2, 7);
    mouseSpeedY = random(2, 7);
    isMouseAlive = true;
}

function drawSpecificEnemy(enemy) {
    fill(139, 69, 19);
    ellipse(enemy.x, enemy.y, 35, 50);

    fill(255, 224, 189);
    ellipse(enemy.x, enemy.y - 35, 35, 35); // Голова

    fill(0);
    arc(enemy.x, enemy.y - 35, 60, 30, PI, 0, CHORD);

    fill(0);
    ellipse(enemy.x - 10, enemy.y - 36, 8, 8);
    ellipse(enemy.x + 10, enemy.y - 36, 8, 8);
    fill(255);
    ellipse(enemy.x - 10, enemy.y - 36, 3, 3);
    ellipse(enemy.x + 10, enemy.y - 36, 3, 3);

    fill(139, 69, 19); // Коричневый 
    arc(enemy.x, enemy.y - 35, 40, 20, 0, PI); // Борода

    fill(255, 0, 0);
    arc(enemy.x, enemy.y - 30, 20, 10, 0, PI);
    
    stroke(255, 215, 0); 
    strokeWeight(5); 
    line(enemy.x - 15, enemy.y - 20, enemy.x - 30, enemy.y + 15); 
    noFill();

    noStroke();
    fill(0, 0, 255);
    rect(enemy.x - 12, enemy.y + 20, 7, 20);
    rect(enemy.x + 7, enemy.y + 20, 7, 20);
}

function drawSpecificEnemy2(enemy) {
    fill(139, 69, 19);
    ellipse(enemy.x, enemy.y, 35, 50);

    fill(255, 224, 189);
    ellipse(enemy.x, enemy.y - 35, 35, 35); // Голова

    fill(0);
    arc(enemy.x, enemy.y - 35, 60, 30, PI, 0, CHORD);

    fill(0);
    ellipse(enemy.x - 10, enemy.y - 36, 8, 8);
    ellipse(enemy.x + 10, enemy.y - 36, 8, 8);
    fill(255);
    ellipse(enemy.x - 10, enemy.y - 36, 3, 3);
    ellipse(enemy.x + 10, enemy.y - 36, 3, 3);

    fill(139, 69, 19); // Коричневый 
    arc(enemy.x, enemy.y - 35, 40, 20, 0, PI); // Борода

    fill(255, 0, 0);
    arc(enemy.x, enemy.y - 30, 20, 10, 0, PI);
    
    stroke(255, 215, 0); 
    strokeWeight(5); 
    line(enemy.x +15, enemy.y - 20, enemy.x +30, enemy.y + 15); 
    noFill();

    noStroke();
    fill(0, 0, 255);
    rect(enemy.x - 12, enemy.y + 20, 7, 20);
    rect(enemy.x + 7, enemy.y + 20, 7, 20);
}

function mousePressed() {
    if (currentScreen === 'game') {
        let iconSize = 80; // Размер изображения
        if (mouseX >= (width - iconSize)/2 && mouseX <= (width + iconSize)/2 && mouseY >= 10 && mouseY <= 10 + iconSize) {
            isMuted = !isMuted; // Переключаем состояние звука
            if (isMuted) {
                // Если звук выключен, ставим громкость на 0
                backd.volume = 0;
                killSound.volume = 0;
                oversound.volume = 0;
                jumpSound.volume = 0;
                vict.volume = 0;
            } else {
                // Если звук включен, восстанавливаем громкость
                backd.volume = volumeSlider.value();
                killSound.volume = volumeSlide.value();
                oversound.volume = volumeSlide.value();
                jumpSound.volume = volumeSlide.value();
                vict.volume = volumeSlide.value();
            }
        }
        
        let signWidth = 130;
        let signHeight = 70;
        let signX = 180 - signWidth / 2 - cameraOffset;
        let signY = 370 - signHeight / 2;

        if (mouseX >= 110 - cameraOffset && mouseX <= 240 - cameraOffset &&
            mouseY >= 330 && mouseY <= 400 && !isMouseAlive) { // Проверяем, жива ли мышь
            showMouse = true;
            isMouseAlive = true;
            inMousePosition();
            isMouseMoving = true;
        }
    }
    if (mouseButton === LEFT && dagger.isHeld && isCrabAlive) {
            let currentTime = millis();
            if (currentTime - dagger.lastThrowTime > 1000) { // 1 second cd
                dagger.isHeld = false;
                dagger.isVisible = true;
                dagger.isThrown = true;
                
                // Determine direction 
                if (keyIsDown(68) || keyIsDown(100)) { 
                    dagger.direction = 1;
                    dagger.x = crabX + 30;
                    dagger.y = crabY - 10;
                    dagger.speedX = 10;
                } else { // Default to left
                    dagger.direction = -1;
                    dagger.x = crabX - 30;
                    dagger.y = crabY - 10;
                    dagger.speedX = -10;
                }
                
                dagger.speedY = 0;
                dagger.lastThrowTime = currentTime;
            }
        }
    }


function moveCrab() {
    if (keyIsDown(65) || keyIsDown(97)) { // A или a
        crabX -= 5; // Двигаем краба влево
        if (!(keyIsDown(68) || keyIsDown(100) || keyIsDown(17) || (key === ' ' && (keyIsDown(65) || keyIsDown(97))))) { // проверка одновременного нажатия кнопок
            drawCrabMoveLeft(crabX, crabY);
        }
        checkPlatformEdge();
    }

    if (keyIsDown(68) || keyIsDown(100)) { // D или d
        crabX += 5; // Двигаем краба вправо
        if (!(keyIsDown(65) || keyIsDown(97) || keyIsDown(17) || (key === ' ' && (keyIsDown(68) || keyIsDown(100))))) {
            drawCrabMoveRight(crabX, crabY);
        }
        checkPlatformEdge();
    }

    if ((keyIsDown(68) || keyIsDown(100)) && (keyIsDown(65) || keyIsDown(97))) { // если A&D
        drawCrabStand(crabX, crabY);
    }

    if ((!(keyIsDown(68) || keyIsDown(17) || keyIsDown(100)|| isJumping == true || keyIsDown(65) || keyIsDown(97)))) { // если ничего не нажато
        drawCrabStand(crabX, crabY);
    }

    if ((crabY < 500) && (key === ' ') && (keyIsDown(68) || keyIsDown(100))) {
        drawCrabJumpRight(crabX, crabY);
    }
    if ((crabY == 500) && (key === ' ') && (keyIsDown(68) || keyIsDown(100))) {
        drawCrabMoveRight(crabX, crabY);
    }
    if ((crabY < 500) && (key === ' ') && (keyIsDown(65) || keyIsDown(97))) {
        drawCrabJumpLeft(crabX, crabY);
    }
    if ((crabY == 500) && (key === ' ') && (keyIsDown(65) || keyIsDown(97))) {
        drawCrabMoveLeft(crabX, crabY);
    }

    // Обновляем камеру
    updateCamera();

    // Проверка на падение в каньон
    if (crabX > 170 && crabX < 200 && crabY >= 500) {
        isFalling = true; // Начинаем падение
        fallSpeed = 0; // Сброс скорости падения
    }
    
    // Границы мира
    if (crabX > worldWidth) {
        crabX = worldWidth;
    }
    if (crabX < 0) {
        crabX = 0;
    }
}

function checkPlatformEdge() {
    let wasOnPlatform = false;
    
    for (let platform of platforms) {
        if (crabY === platform.y - 30) {
            wasOnPlatform = true;
            if (crabX < platform.x || crabX > platform.x + platform.width) {
                isFallingFromPlatform = true;
                fallFromPlatformSpeed = 0;
                targetFallY = 500; // Падаем до земли
            }
        }
    }
    
    // Если краб был на платформе, но больше не на любой из них
    if (!wasOnPlatform && crabY < 500 && !isJumping && !isFallingFromPlatform) {
        isFallingFromPlatform = true;
        fallFromPlatformSpeed = 0;
        targetFallY = 500;
    }
}

function keyPressed() {
    if (key === ' ' && !isJumping && !isFalling) {
        isJumping = true;
        jumpHeight = jumpForce;
    }
}

function jumpCrab() {
    if (jumpHeight > 0) {
        crabY -= jumpHeight; // Двигаем краба вверх на высоту прыжка
        jumpHeight -= gravity; // Уменьшаем высоту для следующего кадра
    } else {
        crabY += 6; // Если прыжок завершен, добавляем гравитацию для падения
        if (crabY >= 500) { // Проверяем, чтобы краб не уходил ниже начальной позиции
            crabY = 500; // Устанавливаем краба на землю
            isJumping = false; // Завершаем прыжок
        }
    }
    if (!(keyIsDown(68) || keyIsDown(100) || keyIsDown(65) || keyIsDown(97) || keyIsDown(17))) {
        drawCrabJump(crabX, crabY); // Рисуем краба во время прыжка
    }
}

function fallCrab() {
    fallSpeed += gravity;
    crabY += fallSpeed;

    if (crabY >= height) {
        crabY = 500;
        crabX = 400;
        isFalling = false;
        score -= 3;
    }
    drawCrabJump(crabX, crabY);
}

function drawback() {
    fill(16, 100, 250);
    quad(800, 0, 800, 400, 0, 400, 0, 0);
    fill(255, 255, 255);
    triangle(520, 200, 430, 400, 600, 400);
    fill(75, 83, 32);
    noStroke();
    triangle(330, 260, 230, 400, 400, 400);
    fill(128, 128, 128);
    noStroke();
    triangle(425, 100, 310, 400, 530, 400);
    fill(50, 205, 50);
    quad(0, 600, 800, 600, 800, 400, 0, 400);
    stroke(211, 211, 211);
    fill(211, 211, 211);
    circle(100, 100, 60);
    circle(140, 100, 80);
    circle(180, 100, 60);
    circle(180, 40, 30);
    circle(200, 40, 40);
    circle(220, 40, 30);
    circle(660, 100, 55);
    circle(690, 100, 70);
    circle(720, 100, 55);
    strokeWeight(3);
    stroke(255, 255, 255);
    fill(255, 255, 255);
    line(425, 100, 411, 140);
    line(438, 140, 425, 100);
    triangle(339, 280, 318, 280, 330, 260);
    noStroke();
    drawSign();
    drawTree(700, 370);
    drawTree(600, 370);
    drawTree(500, 500);
    drawTree(670, 480);
    drawTree(330, 480);
    drawCanyon(180, 540);
}

function drawSign() {
    let signWidth = 130;
    let signHeight = 70;
    let x = 180 - signWidth / 2;
    let y = 370 - signHeight / 2;

    noStroke();
    fill(139, 69, 19);
    rect(x, y, signWidth, signHeight, 10);
    for (let i = 0; i < 5; i++) {
        fill(160, 82, 45);
        rect(x + i * (signWidth / 5), y, signWidth / 5, signHeight / 5);
    }

    stroke(0);
    strokeWeight(5);
    noFill();
    rect(x, y, signWidth, signHeight, 10);

    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text("Click on the\nleft mouse button\nfor the mouse", 180, 370);

    let legHeight = 50;
    let legWidth = 20;
    let legX = x + signWidth / 2 - legWidth / 2;
    let legY = y + signHeight;
    fill(139, 69, 19);
    rect(legX, legY, legWidth, legHeight);

    noStroke();
}

function drawTree(x, y) {
    fill(139, 69, 19);
    rect(x, y, 20, 40);

    fill(34, 139, 34);
    ellipse(x - 10, y - 10, 60, 80);
    ellipse(x + 10, y - 30, 70, 90);
    ellipse(x + 40, y - 10, 50, 70);
    ellipse(x - 40, y - 10, 50, 70);

    fill(0, 100, 0);
    ellipse(x - 10, y - 30, 20, 20);
    ellipse(x + 15, y - 20, 15, 15);
    ellipse(x - 25, y - 20, 15, 15);
    noStroke();
}

function drawMouse(x, y) {
    fill(150, 75, 0);
    ellipse(x, y, 50, 30);
    ellipse(x + 20, y, 30, 20);
    fill(200, 100, 0);
    ellipse(x + 30, y - 5, 15, 15);
    ellipse(x + 10, y - 5, 15, 15);
    fill(255);
    ellipse(x + 25, y, 5, 5);
    fill(0);
    ellipse(x + 25, y, 2, 2);
    stroke(150, 75, 0);
    strokeWeight(5);
    noFill();
    line(x - 20, y, x - 40, y);
    noStroke();
}

function drawCrabJump(x, y) {
    fill(255, 0, 0); // Красный
    ellipse(x, y - 20, 60, 30); // Основное тело 

    // Клешни
    fill(255, 0, 0);
    ellipse(x - 30, y - 10, 20, 10); // Левая клешня
    ellipse(x + 30, y - 10, 20, 10); // Правая клешня

    // Глаза
    fill(255); // Белый
    ellipse(x - 10, y - 25, 10, 10); // Левый глаз
    ellipse(x + 10, y - 25, 10, 10); // Правый глаз

    fill(0); // Черный
    ellipse(x - 10, y - 23, 5, 5); // Зрачок левого глаза
    ellipse(x + 10, y - 23, 5, 5); // Зрачок правого глаза

    // Ноги
    stroke(255, 0, 0);
    strokeWeight(5);
    line(x - 20, y, x - 20, y + 10); // Левая нога
    line(x + 20, y, x + 20, y + 10); // Правая нога
    noStroke();
}

function drawCrabStand(x, y) {
    fill(255, 0, 0); // Красный
    ellipse(x, y, 60, 30); // Основное тело

    // Клешни
    fill(255, 0, 0);
    ellipse(x - 39, y - 2, 20, 10); // Левая клешня
    ellipse(x + 39, y - 2, 20, 10); // Правая клешня

    // Глаза
    fill(255); // Белый
    ellipse(x - 10, y - 10, 10, 10); // Левый глаз
    ellipse(x + 10, y - 10, 10, 10); // Правый глаз

    fill(0); // Черный
    ellipse(x - 10, y - 10, 5, 5); // Зрачок левого глаза
    ellipse(x + 10, y - 10, 5, 5); // Зрачок правого глаза

    // Ноги
    stroke(255, 0, 0);
    strokeWeight(5);
    line(x - 20, y + 10, x - 20, y + 30); // Левая нога
    line(x + 20, y + 10, x + 20, y + 30); // Правая нога
    noStroke();
}

function drawCrabMoveLeft(x, y) {
    fill(255, 0, 0); // Красный
    ellipse(x, y, 60, 30); // Основное тело

    // Клешни
    fill(255, 0, 0);
    ellipse(x - 40, y, 20, 10); // Левая клешня
    ellipse(x + 30, y, 20, 10); // Правая клешня (сдвинута)

    // Глаза
    fill(255); // Белый
    ellipse(x - 15, y - 10, 10, 10); // Левый глаз
    ellipse(x + 15, y - 10, 10, 10); // Правый глаз

    fill(0); // Черный
    ellipse(x - 17, y - 10, 5, 5); // Зрачок левого глаза
    ellipse(x + 13, y - 10, 5, 5); // Зрачок правого глаза

    // Ноги
    stroke(255, 0, 0);
    strokeWeight(5);
    line(x - 20, y + 10, x - 30, y + 30); // Левая нога
    line(x + 10, y + 10, x + 20, y + 30); // Правая нога
    noStroke();
}

function drawCrabMoveRight(x, y) {
    fill(255, 0, 0); // Красный
    ellipse(x, y, 60, 30); // Основное тело

    // Клешни
    fill(255, 0, 0);
    ellipse(x - 30, y, 20, 10); // Левая клешня (сдвинута)
    ellipse(x + 40, y, 20, 10); // Правая клешня

    // Глаза
    fill(255); // Белый
    ellipse(x - 15, y - 10, 10, 10); // Левый глаз
    ellipse(x + 15, y - 10, 10, 10); // Правый глаз

    fill(0); // Черный
    ellipse(x - 13, y - 10, 5, 5); // Зрачок левого глаза
    ellipse(x + 17, y - 10, 5, 5); // Зрачок правого глаза

    // Ноги
    stroke(255, 0, 0);
    strokeWeight(5);
    line(x - 20, y + 10, x - 20, y + 30); // Левая нога
    line(x + 20, y + 10, x + 30, y + 30); // Правая нога
    noStroke();
}

function drawCrabJumpLeft(x, y) {
    fill(255, 0, 0); // Красный
    ellipse(x, y, 60, 30); // Основное тело

    // Клешни
    fill(255, 0, 0);
    ellipse(x - 37, y + 5, 20, 10); // Левая клешня
    ellipse(x + 33, y + 5, 20, 10); // Правая клешня 

    // Глаза
    fill(255); // Белый
    ellipse(x - 15, y - 10, 10, 10); // Левый глаз
    ellipse(x + 15, y - 10, 10, 10); // Правый глаз

    fill(0); // Черный
    ellipse(x - 17, y - 7, 5, 5); // Зрачок левого глаза
    ellipse(x + 13, y - 7, 5, 5); // Зрачок правого глаза

    // Ноги
    stroke(255, 0, 0);
    strokeWeight(5);
    line(x - 10, y + 10, x - 5, y + 30); // Левая нога
    line(x + 10, y + 10, x + 20, y + 30); // Правая нога
    noStroke();
}

function drawCrabJumpRight(x, y) {
    fill(255, 0, 0); // Красный
    ellipse(x, y, 60, 30); // Основное тело

    // Клешни
    fill(255, 0, 0);
    ellipse(x - 33, y + 3, 20, 10); // Левая клешня (сдвинута)
    ellipse(x + 37, y + 3, 20, 10); // Правая клешня

    // Глаза
    fill(255); // Белый
    ellipse(x - 15, y - 10, 10, 10); // Левый глаз
    ellipse(x + 15, y - 10, 10, 10); // Правый глаз

    fill(0); // Черный
    ellipse(x - 13, y - 7, 5, 5); // Зрачок левого глаза
    ellipse(x + 17, y - 7, 5, 5); // Зрачок правого глаза

    // Ноги
    stroke(255, 0, 0);
    strokeWeight(5);
    line(x - 12, y + 10, x - 20, y + 30); // Левая нога
    line(x + 10, y + 10, x, y + 30); // Правая нога
    noStroke();
}

function drawCrabSit(x, y) {
    // Тело краба
    fill(255, 0, 0); // Красный
    ellipse(x, y + 5, 60, 30); // Основное тело

    // Клешни
    fill(255, 0, 0);
    ellipse(x - 40, y + 5, 20, 10); // Левая клешня
    ellipse(x + 40, y + 5, 20, 10); // Правая клешня

    // Глаза
    fill(255); // Белый
    ellipse(x - 15, y - 5, 10, 10); // Левый глаз
    ellipse(x + 15, y - 5, 10, 10); // Правый глаз

    fill(0); // Черный
    ellipse(x - 15, y - 5, 5, 5); // Зрачок левого глаза
    ellipse(x + 15, y - 5, 5, 5); // Зрачок правого глаза
    stroke(255, 0, 0);
    strokeWeight(5);
    line(x - 20, y + 15, x - 30, y + 30); // Левая нога впереди
    line(x + 20, y + 15, x + 30, y + 30); // Правая нога впереди
    line(x - 25, y + 15, x - 35, y + 25); // Левая нога сзади
    line(x + 25, y + 15, x + 35, y + 25); // Правая нога сзади
    noStroke();
}

function drawCanyon(x, y) {
    fill(0); // Чёрный цвет
    ellipse(x, y, 80, 30); // Ос
    quad(140, 540, 220, 550, 220, 600, 140, 600);

    stroke(150); // Серый цвет 
    strokeWeight(5);
    noFill();
    ellipse(x, y, 85, 35);
    fill(80); // (темно-серый)
    noStroke();
    rect(x + 50, y - 10, 70, 10, 5);
    fill(150); // Более светлый серый
    ellipse(x + 50, y - 10, 20, 10);
}