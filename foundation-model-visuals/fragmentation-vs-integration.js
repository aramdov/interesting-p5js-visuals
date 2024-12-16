let panels = [];
let integrationProgress = 0;
let transitioning = false;

function setup() {
  createCanvas(800, 600);
  
  // Initialize panels in fragmented state
  panels = [
    new Panel(200, 150, "Security", color(255, 100, 100)),
    new Panel(600, 150, "Robotics", color(100, 255, 100)),
    new Panel(200, 450, "Vision", color(100, 100, 255)),
    new Panel(600, 450, "Language", color(255, 255, 100))
  ];
}

function draw() {
  background(20);
  
  if (transitioning) {
    integrationProgress = min(integrationProgress + 0.01, 1);
  }
  
  // Draw connecting lines between panels
  if (integrationProgress > 0) {
    stroke(255, 255 * integrationProgress);
    strokeWeight(2 * integrationProgress);
    for (let i = 0; i < panels.length; i++) {
      for (let j = i + 1; j < panels.length; j++) {
        line(
          lerp(panels[i].x, width/2, integrationProgress),
          lerp(panels[i].y, height/2, integrationProgress),
          lerp(panels[j].x, width/2, integrationProgress),
          lerp(panels[j].y, height/2, integrationProgress)
        );
      }
    }
  }
  
  // Draw panels
  for (let panel of panels) {
    panel.update();
    panel.display();
  }
  
  // Draw central foundation model when integrated
  if (integrationProgress > 0) {
    push();
    translate(width/2, height/2);
    rotate(frameCount * 0.01);
    noFill();
    stroke(255, 255 * integrationProgress);
    strokeWeight(2);
    circle(0, 0, 100 * integrationProgress);
    pop();
    
    // Add text for foundation model
    textAlign(CENTER, CENTER);
    textSize(16 * integrationProgress);
    fill(255, 255 * integrationProgress);
    noStroke();
    text("Foundation\nModel", width/2, height/2);
  }
}

class Panel {
  constructor(x, y, label, c) {
    this.originalX = x;
    this.originalY = y;
    this.x = x;
    this.y = y;
    this.label = label;
    this.color = c;
    this.size = 100;
  }
  
  update() {
    // Move towards center based on integration progress
    this.x = lerp(this.originalX, width/2, integrationProgress);
    this.y = lerp(this.originalY, height/2, integrationProgress);
    
    // Reduce size as panels integrate
    this.size = lerp(100, 60, integrationProgress);
  }
  
  display() {
    // Draw panel
    fill(red(this.color), green(this.color), blue(this.color), 150);
    stroke(255);
    strokeWeight(2);
    rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    
    // Draw label
    textAlign(CENTER, CENTER);
    textSize(16);
    fill(255);
    noStroke();
    text(this.label, this.x, this.y);
  }
}

function mousePressed() {
  transitioning = !transitioning;
  if (!transitioning) {
    integrationProgress = 0;
  }
}