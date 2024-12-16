// Generate p5.js code that visualizes a hive of AI agents collaborating to solve a puzzle in real time, using glowing nodes and dynamic network connections to represent their interactions.

let agents = [];
let connections = [];
let maxAgents = 20;
let puzzleProgress = 0;

function setup() {
  createCanvas(800, 800);
  noStroke();
  
  // Initialize agents
  for (let i = 0; i < maxAgents; i++) {
    agents.push(new Agent(random(width), random(height)));
  }
}

function draw() {
  background(20, 20, 30, 100);

  // Update and display agents
  for (let agent of agents) {
    agent.update();
    agent.display();
  }

  // Create dynamic connections
  connections = [];
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      let d = dist(agents[i].x, agents[i].y, agents[j].x, agents[j].y);
      if (d < 150) {
        connections.push({ a: agents[i], b: agents[j], distance: d });
      }
    }
  }

  // Display connections
  for (let conn of connections) {
    let alpha = map(conn.distance, 0, 150, 255, 50);
    stroke(0, 150, 255, alpha);
    strokeWeight(1.5);
    line(conn.a.x, conn.a.y, conn.b.x, conn.b.y);
  }

  // Simulate puzzle progress
  puzzleProgress += 0.1;
  if (puzzleProgress > 100) puzzleProgress = 100;

  // Display puzzle progress
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(18);
  text(`Puzzle Progress: ${nf(puzzleProgress, 0, 1)}%`, width / 2, height - 20);
}

class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.size = random(8, 15);
    this.color = color(random(50, 150), random(150, 255), random(200, 255));
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce on edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);

    // Glowing effect
    for (let i = 0; i < 5; i++) {
      fill(red(this.color), green(this.color), blue(this.color), 50 - i * 10);
      ellipse(this.x, this.y, this.size + i * 5);
    }
  }
}