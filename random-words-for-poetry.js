// Inspiration: https://p5js.org/examples/listing-data-with-arrays-random-poetry/


// Define poetic words that could create interesting connections
let words = [
  'moonlight', 'whisper', 'dream', 'ocean', 'storm',
  'shadow', 'flutter', 'silence', 'star', 'dance',
  'memory', 'wind', 'heart', 'time', 'soul',
  'crystal', 'flame', 'echo', 'cloud', 'river'
];


// Node class to represent words
class Node {
  constructor(word, x, y) {
    this.word = word;
    this.x = x;
    this.y = y;
    this.radius = textWidth(word) / 2 + 20; // Dynamic radius based on word length
    this.connections = [];
  }

  // Check collision with another node
  collidesWith(other) {
    let minDist = this.radius + other.radius + 30; // Add padding between circles
    let actualDist = dist(this.x, this.y, other.x, other.y);
    return actualDist < minDist;
  }
}

// Edge class to represent connections
class Edge {
  constructor(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
  }
}

let nodes = [];
let edges = [];

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(16);
  
  // Create nodes with random positions
  for (let word of words) {
    let attempts = 0;
    let node;
    
    do {
      node = new Node(
        word,
        random(100, width - 100),
        random(100, height - 100)
      );
      attempts++;
    } while (checkCollisions(node) && attempts < 100);
    
    if (attempts < 100) {
      nodes.push(node);
    }
  }
  
  // // Create random connections (multiple edges per node possible)
  // for (let i = 0; i < nodes.length; i++) {
  //   let numConnections = floor(random(1, 3)); // 1-2 connections per node
  //   for (let j = 0; j < numConnections; j++) {
  //     let otherNode = nodes[floor(random(nodes.length))];
  //     if (otherNode !== nodes[i] && !nodes[i].connections.includes(otherNode)) {
  //       edges.push(new Edge(nodes[i], otherNode));
  //       nodes[i].connections.push(otherNode);
  //     }
  //   }
  // }

  // Create exactly one connection per node
  let availableNodes = [...nodes]; // Copy of nodes array for tracking unconnected nodes
  
  while (availableNodes.length > 1) {
    let currentNode = availableNodes.pop();
    let possibleConnections = availableNodes.filter(n => n.connections.length === 0);
    
    if (possibleConnections.length > 0) {
      let otherNode = possibleConnections[floor(random(possibleConnections.length))];
      edges.push(new Edge(currentNode, otherNode));
      currentNode.connections.push(otherNode);
      otherNode.connections.push(currentNode);
    }
  }

}

function draw() {
  background(240);
  
  // Draw edges first (so they appear behind nodes)
  stroke(180, 180, 220);
  strokeWeight(1);
  for (let edge of edges) {
    line(edge.node1.x, edge.node1.y, edge.node2.x, edge.node2.y);
  }
  
  // Draw nodes
  for (let node of nodes) {
    // Draw circle
    fill(255);
    stroke(100, 100, 160);
    strokeWeight(2);
    circle(node.x, node.y, node.radius * 2);
    
    // Draw word
    fill(60);
    noStroke();
    text(node.word, node.x, node.y);
  }
}

// Helper function to check if a node collides with any existing nodes
function checkCollisions(newNode) {
  for (let existingNode of nodes) {
    if (newNode.collidesWith(existingNode)) {
      return true;
    }
  }
  return false;
}

// Optional: Add interactivity to drag nodes
let draggingNode = null;

function mousePressed() {
  for (let node of nodes) {
    let d = dist(mouseX, mouseY, node.x, node.y);
    if (d < node.radius) {
      draggingNode = node;
      break;
    }
  }
}

function mouseDragged() {
  if (draggingNode) {
    draggingNode.x = mouseX;
    draggingNode.y = mouseY;
  }
}

function mouseReleased() {
  draggingNode = null;
}