// P5.js Cyberpunk Energy Grid Interface
let circuits = [];
let powerSurges = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  
  // Create grid nodes
  for (let i = 0; i < 15; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      size: random(5, 15),
      pulseRate: random(0.02, 0.05),
      phase: random(TWO_PI)
    });
  }
  
  // Create circuit connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y) < 200) {
        circuits.push({
          start: nodes[i],
          end: nodes[j],
          energy: random(0.2, 0.8),
          frequency: random(0.01, 0.03)
        });
      }
    }
  }
}

function draw() {
  background(10, 20, 30);
  time += 0.01;
  
  // Draw circuits
  strokeWeight(2);
  for (let circuit of circuits) {
    let energy = circuit.energy + sin(time * circuit.frequency) * 0.2;
    let alpha = map(energy, 0, 1, 50, 200);
    stroke(0, 150 + energy * 100, 200 + energy * 55, alpha);
    
    // Draw glowing effect
    for (let i = 3; i >= 0; i--) {
      strokeWeight(i * 2);
      let e = map(i, 0, 3, 1, 0.2);
      stroke(0, 150 + energy * 100, 200 + energy * 55, alpha * e);
      line(circuit.start.x, circuit.start.y, circuit.end.x, circuit.end.y);
    }
  }
  
  // Draw nodes
  for (let node of nodes) {
    let pulse = sin(time * node.pulseRate + node.phase) * 0.5 + 0.5;
    let size = node.size * (1 + pulse * 0.3);
    let alpha = map(pulse, 0, 1, 100, 255);
    
    // Glow effect
    noStroke();
    for (let i = 4; i >= 0; i--) {
      let s = size + i * 3;
      let a = alpha * (1 - i/4);
      fill(0, 200 + pulse * 55, 255, a);
      circle(node.x, node.y, s);
    }
  }
  
  // Generate random power surges
  if (random() < 0.03) {
    let circuit = random(circuits);
    powerSurges.push({
      start: circuit.start,
      end: circuit.end,
      progress: 0,
      speed: random(0.02, 0.05)
    });
  }
  
  // Draw and update power surges
  powerSurges = powerSurges.filter(surge => {
    surge.progress += surge.speed;
    if (surge.progress >= 1) return false;
    
    let pos = {
      x: lerp(surge.start.x, surge.end.x, surge.progress),
      y: lerp(surge.start.y, surge.end.y, surge.progress)
    };
    
    // Draw surge particle
    let alpha = sin(surge.progress * PI) * 255;
    for (let i = 3; i >= 0; i--) {
      fill(255, 255, 200, alpha * (1 - i/3));
      circle(pos.x, pos.y, 8 - i * 2);
    }
    
    return true;
  });
  
  // Draw interface elements
  drawInterface();
}

function drawInterface() {
  // Draw border
  noFill();
  strokeWeight(2);
  stroke(0, 150, 200, 100);
  rect(10, 10, width - 20, height - 20);
  
  // Draw corner decorations
  let cornerSize = 20;
  stroke(0, 200, 255, 150);
  for (let x of [10, width - 10 - cornerSize]) {
    for (let y of [10, height - 10 - cornerSize]) {
      line(x, y, x + cornerSize, y);
      line(x, y, x, y + cornerSize);
    }
  }
  
  // Draw system status
  textAlign(LEFT, TOP);
  textSize(14);
  fill(0, 200, 255);
  noStroke();
  text("GRID STATUS: OPERATIONAL", 30, 30);
  text(`POWER SURGES: ${powerSurges.length}`, 30, 50);
  text(`SYSTEM TIME: ${nf(hour(), 2)}:${nf(minute(), 2)}:${nf(second(), 2)}`, 30, 70);
  
  // Draw flickering status indicator
  let flicker = random() < 0.1 ? 0 : 1;
  fill(0, 255, 200, 150 * flicker);
  circle(20, 35, 8);
}