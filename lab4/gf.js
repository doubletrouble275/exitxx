alert("control buttons: AD, Space");

let gameObjects = {
    scenery: [],
    collectable: []
};

let mouseXPos; 
let mouseYPos; 
let mouseSpeedX; 
let mouseSpeedY; 
let isMouseMoving = false; 
let showMouse = false; 
let crabX;
let crabY;
let isJumping = false; // состояние
let jumpHeight = 0;
const jumpForce = 12; // Сила прыжка
const gravity = 0.8; // Гравитация

function setup() {
    createCanvas(800, 600);
    background(16, 100, 250);
    crabX = 400; // Начальная позиция по оси X
    crabY = 500; // Начальная позиция по оси Y
    inMousePosition();

    //функции отрисовки в массив scenery
    gameObjects.scenery.push(drawTree);
    gameObjects.scenery.push(drawSign);
    gameObjects.scenery.push(drawback);
    gameObjects.scenery.push(drawMouse);
    gameObjects.scenery.push(drawCanyon);
}
function drawback(){
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
    fill(0, 60, 255);
    
    drawTree(700, 370);
    drawTree(600, 370);
    drawTree(500, 500);
    drawTree(670, 480);
    drawTree(330, 480);
    drawSign();
}
function draw() {
    

    // Вызыв функции из массива scenery
    for (let drawFunction of gameObjects.scenery) {
        drawFunction(); 
    }

    if (isMouseMoving) {
        mouseXPos += mouseSpeedX;
        mouseYPos += mouseSpeedY;

        // Мышь не выходит за границы
        if (mouseXPos > width || mouseXPos < 0) {
            mouseSpeedX *= -1;
        }
        if (mouseYPos > height || mouseYPos < 0) {
            mouseSpeedY *= -1;
        }
    }

    // Мышь
    if (showMouse) {
        drawMouse(mouseXPos, mouseYPos);
    }
    moveCrab(); // Перемещение краба

    if (isJumping) {
        jumpCrab(); // Обработка прыжка
    }
}
function drawCanyon(){
    fill(0, 60, 255);
    quad(90, 510, 160, 510, 250, 600, 120, 600);
    quad(100, 450, 140, 450, 160, 510, 90, 510);
    quad(80, 400, 100, 400, 140, 450, 100, 450);
}
function drawTree(x, y) {
    fill(139, 69, 19); // коричневый
    rect(x, y, 20, 40); 
    
    fill(34, 139, 34); // Темно-зеленый 
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

function drawSign() {
    // размеры и координаты таблички
    let signWidth = 130;
    let signHeight = 70;
    let x = 180 - signWidth / 2; 
    let y = 370 - signHeight / 2; 

    // фон таблички
    noStroke();
    fill(139, 69, 19); 
    rect(x, y, signWidth, signHeight, 10); 
    for (let i = 0; i < 5; i++) {
        fill(160, 82, 45); 
        rect(x + i * (signWidth / 5), y, signWidth / 5, signHeight / 5);
    }

    // рамка
    stroke(0);
    strokeWeight(5);
    noFill();
    rect(x, y, signWidth, signHeight, 10); 

    fill(255); // Цвет текста
    textSize(14);
    textAlign(CENTER, CENTER); // выравнивание

    // текст на несколько строк
    text("Click on the\nleft mouse button\nfor the mouse", 180, 370);

    // ножка таблички
    let legHeight = 50; // Высота ножки
    let legWidth = 20; // Ширина ножки
    let legX = x + signWidth / 2 - legWidth / 2; 
    let legY = y + signHeight; 
    fill(139, 69, 19); 
    rect(legX, legY, legWidth, legHeight); 

    noStroke();
}

function moveCrab() {
    if (keyIsDown(65) || keyIsDown(97)) { // A или a
        crabX -= 5; // Двигаем краба влево
        if (!(keyIsDown(68) || keyIsDown(100) || keyIsDown(17) || (key === ' ' && (keyIsDown(65) || keyIsDown(97))))) { // проверка одновременного нажатия кнопок
            drawCrabMoveLeft(crabX, crabY);
        }
    }

    if (keyIsDown(68) || keyIsDown(100)) { // D или d
        crabX += 5; // Двигаем краба вправо
        if (!(keyIsDown(65) || keyIsDown(97) || keyIsDown(17) || (key === ' ' && (keyIsDown(68) || keyIsDown(100))))) {
            drawCrabMoveRight(crabX, crabY);
        }
    }

    if ((keyIsDown(68) || keyIsDown(100)) && (keyIsDown(65) || keyIsDown(97))) { // если A&D
        drawCrabStand(crabX, crabY);
    }

    if ((!(keyIsDown(68) || keyIsDown(17) || keyIsDown(100) || keyIsDown(65) || keyIsDown(97))) && (crabY == 500)) { // если ничего не нажато
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
    
        
}

function keyPressed() {
    // Начинаем прыжок при нажатии клавиши ' '.
    if (key === ' ' && !isJumping) {
        isJumping = true;
        jumpHeight = jumpForce; // установка начальной высоты
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

    // Ноги
    stroke(255, 0, 0);
    strokeWeight(5);
    line(x - 20, y + 15, x - 30, y + 30); // Левая нога впереди
    line(x + 20, y + 15, x + 30, y + 30); // Правая нога впереди
    line(x - 25, y + 15, x - 35, y + 25); // Левая нога сзади
    line(x + 25, y + 15, x + 35, y + 25); // Правая нога сзади
    noStroke();
}

function inMousePosition() {
    // случайная позиция и скорость
    mouseXPos = random(width);
    mouseYPos = random(height);
    mouseSpeedX = random(2, 7);
    mouseSpeedY = random(2, 7);
}

function mousePressed() {
    showMouse = !showMouse;
    if (showMouse) {
        isMouseMoving = true;
        inMousePosition();  // движение с random pos
    } else {
        isMouseMoving = false; 
    }
}

function drawMouse(x, y) {
    // Тело мыши
    fill(150, 75, 0);
    ellipse(x, y, 50, 30);

    // Голова мыши
    ellipse(x + 20, y, 30, 20);
    
    // Уши
    fill(200, 100, 0);
    ellipse(x + 30, y - 5, 15, 15);
    ellipse(x + 10, y - 5, 15, 15);
    
    // Глаза
    fill(255);
    ellipse(x + 25, y, 5, 5);
    fill(0);
    ellipse(x + 25, y, 2, 2);
    
    // Хвост
    stroke(150, 75, 0);
    strokeWeight(5);
    noFill();
    line(x - 20, y, x - 40, y);
    noStroke();
}
