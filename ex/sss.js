
function setup()
{
    createCanvas(800, 600);
    background(16, 100, 250);
}
function update()//обновляет поле
{
    MainDraw();
    background(16, 100, 250);
    requestAnimationFrame(update)
}
update();

function draw()//, landscape
{


    fill(255, 255, 255);
    triangle(520, 200, 430, 400, 600, 400);
    fill(75, 83, 32);
    noStroke();
    triangle(330, 260, 230, 400, 400, 400);
    fill(128, 128, 128);
    noStroke();
    triangle(425, 100, 310, 400, 530, 400);
    fill(50, 205, 50);
    quad(0,600, 800, 600, 800,400, 0, 400);
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
    noStroke()
    fill(0,60, 255)
    quad(90,510, 160, 510, 250,600, 120, 600);
    quad(100,450, 140, 450, 160,510, 90, 510);
    quad(80,400, 100, 400, 140,450, 100, 450);
    
    drawTree(700, 370);
    drawTree(600, 370);
    drawTree(500, 500);
    drawTree(670, 480);
    drawTree(330, 480);
    
    drawCrabJump(220, 400);
    drawCrabSit(250, 500);
    drawCrabMoveLeft(350, 550);
    drawCrabMoveRight(450, 550);
    drawCrabStand(590, 550);
    drawCrabJumpLeft(120, 350);
    drawCrabJumpRight(80, 390);
    
}

function drawTree(x, y) 
{
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

function drawCrabSit(x, y) {
    // Тело краба
    fill(255, 0, 0); // Красный
    ellipse(x, y, 60, 30); // Основное тело

    // Клешни
    fill(255, 0, 0);
    ellipse(x - 40, y, 20, 10); // Левая клешня
    ellipse(x + 40, y, 20, 10); // Правая клешня

    // Глаза
    fill(255); // Белый
    ellipse(x - 15, y - 10, 10, 10); // Левый глаз
    ellipse(x + 15, y - 10, 10, 10); // Правый глаз

    fill(0); // Черный
    ellipse(x - 15, y - 10, 5, 5); // Зрачок левого глаза
    ellipse(x + 15, y - 10, 5, 5); // Зрачок правого глаза

    // Ноги
    stroke(255, 0, 0);
    strokeWeight(5);
    line(x - 20, y + 15, x - 30, y + 30); // Левая нога впереди
    line(x + 20, y + 15, x + 30, y + 30); // Правая нога впереди
    line(x - 25, y + 15, x - 35, y + 25); // Левая нога сзади
    line(x + 25, y + 15, x + 35, y + 25); // Правая нога сзади
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
function drawCrabJumpLeft(x, y) {
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
    line(x -10, y + 10, x - 5, y + 30); // Левая нога
    line(x + 10, y + 10, x + 20, y + 30); // Правая нога
    noStroke();
}
function drawCrabJumpRight(x, y) {
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
    line(x - 12, y + 10, x - 20, y + 30); // Левая нога
    line(x +10, y + 10, x , y + 30); // Правая нога
    noStroke(); 
}