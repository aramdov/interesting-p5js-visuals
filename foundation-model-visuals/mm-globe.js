let rotation = 0;
let globe;
let dataLayers = [];
let dataPulses = [];
let modelHub;
let activeLayer = 0;

class DataLayer {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.alpha = 0;
    this.targetAlpha = 0;
    this.points = [];
    this.icons = [];
    
    // Generate random data points
    for (let i = 0; i < 20; i++) {
      this.points.push({
        lat: random(-80, 80),
        lon: random(-180, 180),
        size: random(5, 15)
      });
    }
    
    // Generate icons
    for (let i = 0; i < 8; i++) {
      this.icons.push({
        lat: random(-60, 60),
        lon: random(-180, 180),
        rotation: random(TWO_PI)
      });
    }
  }

  update() {
    // Smooth alpha transition
    this.alpha = lerp(this.alpha, this.targetAlpha, 0.1);
    
    // Animate icons
    this.icons.forEach(icon => {
      icon.rotation += 0.02;
    });
  }

  draw(radius) {
    push();
    
    // Draw data points
    this.points.forEach(point => {
      let pos = latLonToVector(point.lat, point.lon, radius);
      push();
      translate(pos.x, pos.y, pos.z);
      rotateX(PI/2);
      noStroke();
      fill(this.color[0], this.color[1], this.color[2], this.alpha * 255);
      circle(0, 0, point.size * (1 + 0.2 * sin(frameCount * 0.1)));
      pop();
    });

    // Draw icons based on type
    this.icons.forEach(icon => {
      let pos = latLonToVector(icon.lat, icon.lon, radius + 10);
      push();
      translate(pos.x, pos.y, pos.z);
      rotateX(PI/2);
      rotateZ(icon.rotation);
      noStroke();
      fill(this.color[0], this.color[1], this.color[2], this.alpha * 255);
      
      switch(this.type) {
        case 'satellite':
          drawSatelliteIcon();
          break;
        case 'audio':
          drawAudioIcon();
          break;
        case 'text':
          drawTextIcon();
          break;
      }
      pop();
    });
    
    pop();
  }
}

class DataPulse {
  constructor(lat, lon, radius) {
    this.pos = latLonToVector(lat, lon, radius);
    this.targetPos = createVector(0, -200, 0); // Hub position
    this.progress = 0;
    this.speed = random(0.01, 0.02);
    this.size = random(4, 8);
    this.color = color(random(100, 255), random(100, 255), random(200, 255));
  }

  update() {
    this.progress += this.speed;
  }

  draw() {
    let currentPos = p5.Vector.lerp(this.pos, this.targetPos, this.progress);
    push();
    translate(currentPos.x, currentPos.y, currentPos.z);
    noStroke();
    fill(this.color);
    sphere(this.size * (1 - this.progress * 0.5));
    pop();
  }

  isDone() {
    return this.progress >= 1;
  }
}

class ModelHub {
  constructor() {
    this.rotation = 0;
    this.pulseSize = 0;
  }

  update() {
    this.rotation += 0.01;
    this.pulseSize = 15 + sin(frameCount * 0.05) * 5;
  }

  draw() {
    push();
    translate(0, -200, 0);
    rotateY(this.rotation);
    
    // Core
    fill(100, 200, 255, 200);
    noStroke();
    sphere(30);
    
    // Orbiting rings
    for (let i = 0; i < 3; i++) {
      push();
      rotateX(this.rotation + i * TWO_PI/3);
      stroke(100, 200, 255, 100);
      noFill();
      torus(50, 2);
      pop();
    }
    
    // Pulse effect
    noFill();
    stroke(100, 200, 255, 50);
    sphere(this.pulseSize);
    
    pop();
  }
}

function latLonToVector(lat, lon, radius) {
  const phi = (90 - lat) * PI/180;
  const theta = (lon + 180) * PI/180;
  
  const x = -radius * sin(phi) * cos(theta);
  const y = radius * cos(phi);
  const z = radius * sin(phi) * sin(theta);
  
  return createVector(x, y, z);
}

function drawSatelliteIcon() {
  // Simple satellite icon
  rect(-5, -5, 10, 10);
  rect(-15, -2, 30, 4);
}

function drawAudioIcon() {
  // Simple audio wave icon
  for (let i = -2; i <= 2; i++) {
    rect(i * 5, -abs(i) * 3, 2, abs(i) * 6 + 5);
  }
}

function drawTextIcon() {
  // Simple text icon
  rect(-10, -5, 20, 10);
  rect(-8, -3, 16, 2);
  rect(-8, 2, 12, 2);
}

function setup() {
  createCanvas(800, 600, WEBGL);
  
  // Initialize data layers
  dataLayers = [
    new DataLayer('satellite', [255, 100, 100]),  // Red for satellite
    new DataLayer('audio', [100, 255, 100]),      // Green for audio
    new DataLayer('text', [100, 100, 255])        // Blue for text
  ];
  
  // Initialize model hub
  modelHub = new ModelHub();
  
  // Activate first layer
  dataLayers[0].targetAlpha = 1;
}

function draw() {
  background(0);
  
  // Add ambient light
  ambientLight(60);
  
  // Add directional light
  directionalLight(255, 255, 255, 1, 1, -1);
  
  // Control globe rotation
  if (mouseIsPressed) {
    rotation = map(mouseX, 0, width, -PI, PI);
  }
  
  push();
  // Draw globe
  rotateY(rotation);
  
  // Base globe
  noStroke();
  fill(30);
  sphere(150);
  
  // Update and draw data layers
  dataLayers.forEach(layer => {
    layer.update();
    layer.draw(150);
  });
  
  pop();
  
  // Generate new data pulses
  if (frameCount % 30 === 0) {
    dataPulses.push(new DataPulse(
      random(-80, 80),
      random(-180, 180),
      150
    ));
  }
  
  // Update and draw data pulses
  for (let i = dataPulses.length - 1; i >= 0; i--) {
    dataPulses[i].update();
    dataPulses[i].draw();
    if (dataPulses[i].isDone()) {
      dataPulses.splice(i, 1);
    }
  }
  
  // Update and draw model hub
  modelHub.update();
  modelHub.draw();
}

function keyPressed() {
  // Switch active layer with number keys
  if (key >= '1' && key <= '3') {
    let newLayer = parseInt(key) - 1;
    dataLayers.forEach((layer, i) => {
      layer.targetAlpha = (i === newLayer) ? 1 : 0;
    });
    activeLayer = newLayer;
  }
}