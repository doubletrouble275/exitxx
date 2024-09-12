function setup(){
    createCanvas(800, 600);
    background(16, 100, 250);
}
function draw(){


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
}

