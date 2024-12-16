// Classes for physical world elements
class Cloud {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = random(0.5, 1);
      this.size = random(40, 80);
    }
  
    update() {
      this.x += this.speed;
      if (this.x > width/2) this.x = -50;
    }
  
    draw() {
      push();
      noStroke();
      fill(255, 200);
      ellipse(this.x, this.y, this.size, this.size * 0.6);
      ellipse(this.x + this.size * 0.2, this.y - this.size * 0.1, this.size * 0.7, this.size * 0.5);
      ellipse(this.x - this.size * 0.2, this.y + this.size * 0.1, this.size * 0.6, this.size * 0.4);
      pop();
    }
  }
  
  class Tree {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.height = random(40, 80);
      this.swayOffset = random(TWO_PI);
    }
  
    update() {
      this.swayOffset += 0.02;
    }
  
    draw() {
      push();
      let sway = sin(this.swayOffset) * 2;
      
      // Tree trunk
      stroke(101, 67, 33);
      strokeWeight(6);
      line(this.x, this.y, this.x + sway, this.y - this.height * 0.4);
      
      // Tree top
      fill(34, 139, 34, 200);
      noStroke();
      let topX = this.x + sway;
      let topY = this.y - this.height * 0.4;
      triangle(
        topX - 20, topY,
        topX + 20, topY,
        topX, topY - this.height * 0.6
      );
      pop();
    }
  }
  
  // Classes for digital world elements
  class Grid {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.cellSize = 20;
      this.activeCells = new Set();
    }
  
    update() {
      // Randomly activate/deactivate cells
      if (frameCount % 10 === 0) {
        let cellX = floor(random(this.w/this.cellSize));
        let cellY = floor(random(this.h/this.cellSize));
        let key = `${cellX},${cellY}`;
        if (this.activeCells.has(key)) {
          this.activeCells.delete(key);
        } else {
          this.activeCells.add(key);
        }
      }
    }
  
    draw() {
      push();
      stroke(0, 255, 255, 50);
      
      // Draw grid lines
      for (let x = 0; x <= this.w; x += this.cellSize) {
        line(this.x + x, this.y, this.x + x, this.y + this.h);
      }
      for (let y = 0; y <= this.h; y += this.cellSize) {
        line(this.x, this.y + y, this.x + this.w, this.y + y);
      }
  
      // Draw active cells
      fill(0, 255, 255, 30);
      this.activeCells.forEach(key => {
        let [cellX, cellY] = key.split(',').map(Number);
        rect(
          this.x + cellX * this.cellSize,
          this.y + cellY * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      });
      pop();
    }
  }
  
  class DataParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.targetX = random(width/2 + 50, width - 50);
      this.targetY = random(50, height - 50);
      this.speed = random(0.02, 0.04);
      this.progress = 0;
      this.size = random(4, 8);
      this.color = color(255, 255, 255, 150);
    }
  
    update() {
      if (this.progress < 1) {
        this.progress += this.speed;
      }
      
      // Transform color as particle moves to digital side
      if (this.x > width/2) {
        let digitalProgress = (this.x - width/2) / (width/2);
        this.color = lerpColor(
          color(255, 255, 255, 150),
          color(0, 255, 255, 150),
          digitalProgress
        );
      }
    }
  
    draw() {
      push();
      let currentX = lerp(this.x, this.targetX, this.progress);
      let currentY = lerp(this.y, this.targetY, this.progress);
      
      fill(this.color);
      noStroke();
      circle(currentX, currentY, this.size);
      pop();
    }
  
    isDone() {
      return this.progress >= 1;
    }
  }
  
  // Global variables
  let clouds = [];
  let trees = [];
  let grid;
  let particles = [];
  let bridge;
  
  function setup() {
    createCanvas(800, 600);
    
    // Initialize physical world elements
    for (let i = 0; i < 5; i++) {
      clouds.push(new Cloud(random(-50, width/2), random(50, height/2)));
      trees.push(new Tree(random(50, width/2 - 50), height - 50));
    }
    
    // Initialize digital world elements
    grid = new Grid(width/2 + 50, 50, width/2 - 100, height - 100);
    
    // Create gradient for the bridge
    bridge = drawingContext.createLinearGradient(width/2 - 100, 0, width/2 + 100, 0);
    bridge.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    bridge.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)');
    bridge.addColorStop(1, 'rgba(0, 255, 255, 0.2)');
  }
  
  function draw() {
    background(0);
    
    // Draw physical world background
    drawingContext.fillStyle = createRadialGradient(width/4, height/2, 0, width/4, height/2, width/2);
    rect(0, 0, width/2, height);
    
    // Draw digital world background
    drawingContext.fillStyle = createDigitalGradient();
    rect(width/2, 0, width/2, height);
    
    // Update and draw physical world elements
    clouds.forEach(cloud => {
      cloud.update();
      cloud.draw();
    });
    
    trees.forEach(tree => {
      tree.update();
      tree.draw();
    });
    
    // Draw the bridge
    drawBridge();
    
    // Update and draw digital world elements
    grid.update();
    grid.draw();
    
    // Generate new particles
    if (frameCount % 20 === 0) {
      particles.push(new DataParticle(
        random(50, width/2 - 50),
        random(50, height - 50)
      ));
    }
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].isDone()) {
        particles.splice(i, 1);
      }
    }
  }
  
  function createRadialGradient(x, y, r1, x1, y1, r2) {
    let gradient = drawingContext.createRadialGradient(x, y, r1, x1, y1, r2);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(1, '#1a237e');
    return gradient;
  }
  
  function createDigitalGradient() {
    let gradient = drawingContext.createLinearGradient(width/2, 0, width, height);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#1a1a1a');
    return gradient;
  }
  
  function drawBridge() {
    push();
    drawingContext.fillStyle = bridge;
    beginShape();
    vertex(width/2 - 100, 0);
    vertex(width/2 + 100, 0);
    vertex(width/2 + 100, height);
    vertex(width/2 - 100, height);
    endShape(CLOSE);
    pop();
  }