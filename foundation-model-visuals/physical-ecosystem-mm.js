let sources = [];
let particles = [];
let cloudY;
let time = 0;

class Source {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.pulseRadius = 0;
    this.active = false;
    this.cooldown = 0;
    
    // Define properties based on type
    switch(type) {
      case 'factory':
        this.color = color(255, 100, 100);
        this.icon = '🏭';
        break;
      case 'forest':
        this.color = color(100, 255, 100);
        this.icon = '🌳';
        break;
      case 'satellite':
        this.color = color(100, 200, 255);
        this.icon = '🛰️';
        break;
      case 'city':
        this.color = color(255, 200, 100);
        this.icon = '🏙️';
        break;
    }
  }
  
  update() {
    // Update pulse animation
    if (this.active) {
      this.pulseRadius += 2;
      if (this.pulseRadius > 50) {
        this.active = false;
        this.pulseRadius = 0;
      }
    }
    
    // Random activation
    if (this.cooldown <= 0 && random() < 0.02) {
      this.active = true;
      this.cooldown = 60;
      
      // Generate new particle
      particles.push(new Particle(
        this.x,
        this.y,
        this.color,
        random(['input', 'output']),
        this.type
      ));
    }
    
    this.cooldown = max(0, this.cooldown - 1);
  }
  
  display() {
    push();
    // Draw pulse circle
    if (this.active) {
      noFill();
      stroke(this.color);
      strokeWeight(2);
      circle(this.x, this.y, this.pulseRadius * 2);
    }
    
    // Draw icon background
    fill(20);
    stroke(this.color);
    strokeWeight(2);
    circle(this.x, this.y, 40);
    
    // Draw icon
    textAlign(CENTER, CENTER);
    textSize(20);
    noStroke();
    text(this.icon, this.x, this.y);
    pop();
  }
}

class Particle {
  constructor(x, y, color, type, sourceType) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.sourceType = sourceType;
    this.size = 8;
    this.alpha = 255;
    this.complete = false;
    
    // Calculate target position
    if (type === 'input') {
      this.targetX = width/2 + random(-50, 50);
      this.targetY = cloudY;
    } else {
      // Find a random different source as target
      let possibleTargets = sources.filter(s => s.type !== sourceType);
      let target = random(possibleTargets);
      this.targetX = target.x;
      this.targetY = target.y;
    }
    
    // Calculate control points for curved path
    this.ctrl1X = lerp(this.x, this.targetX, 0.5) + random(-100, 100);
    this.ctrl1Y = lerp(this.y, this.targetY, 0.33) + random(-50, 50);
    this.ctrl2X = lerp(this.x, this.targetX, 0.5) + random(-100, 100);
    this.ctrl2Y = lerp(this.y, this.targetY, 0.66) + random(-50, 50);
    
    this.progress = 0;
  }
  
  update() {
    this.progress += 0.02;
    
    if (this.progress >= 1) {
      this.complete = true;
      // Generate output particle if this was an input
      if (this.type === 'input') {
        particles.push(new Particle(
          this.targetX,
          this.targetY,
          this.color,
          'output',
          this.sourceType
        ));
      }
    }
    
    // Calculate current position using cubic bezier
    let t = this.progress;
    this.x = bezierPoint(this.x, this.ctrl1X, this.ctrl2X, this.targetX, t);
    this.y = bezierPoint(this.y, this.ctrl1Y, this.ctrl2Y, this.targetY, t);
  }
  
  display() {
    push();
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), 
         255 * (1 - abs(0.5 - this.progress) * 2));
    circle(this.x, this.y, this.size);
    pop();
  }
}

function setup() {
  createCanvas(800, 600);
  cloudY = height * 0.3;
  
  // Initialize sources
  sources = [
    new Source(200, 450, 'factory'),
    new Source(600, 450, 'factory'),
    new Source(150, 350, 'forest'),
    new Source(650, 350, 'forest'),
    new Source(300, 500, 'city'),
    new Source(500, 500, 'city'),
    new Source(400, 200, 'satellite')
  ];
}

function draw() {
  background(20);
  time += 0.01;
  
  // Draw cloud
  push();
  translate(width/2, cloudY);
  noStroke();
  
  // Draw glowing effect
  for (let i = 4; i > 0; i--) {
    fill(100, 150, 255, 10);
    ellipse(0, 0, 200 + i * 20 + sin(time * 2) * 10,
            100 + i * 10 + sin(time * 2) * 5);
  }
  
  // Draw main cloud
  fill(150, 200, 255);
  ellipse(0, 0, 200 + sin(time * 2) * 10,
          100 + sin(time * 2) * 5);
  
  // Add "AI Foundation Model" text
  fill(20);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('AI Foundation\nModel', 0, 0);
  pop();
  
  // Update and display sources
  for (let source of sources) {
    source.update();
    source.display();
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    // Remove completed particles
    if (particles[i].complete) {
      particles.splice(i, 1);
    }
  }
}