// Environmental Monitoring Station Visualization
let particles = [];
let graphData = [];
let currentTemp = 24;
let currentHumidity = 65;
let currentAQI = 42;
let time = 0;

function setup() {
  createCanvas(800, 600);
  // Initialize particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      speed: random(0.5, 2)
    });
  }
  
  // Initialize graph data
  for (let i = 0; i < 60; i++) {
    graphData.push({
      temp: random(18, 28),
      humidity: random(55, 75),
      aqi: random(30, 60)
    });
  }
}

function draw() {
  background(20, 22, 30);
  
  // Update time
  time += 0.01;
  
  // Draw particle background
  drawParticles();
  
  // Draw main circular display
  drawMainDisplay();
  
  // Draw graphs
  drawGraphs();
  
  // Draw data labels
  drawLabels();
  
  // Update data periodically
  if (frameCount % 60 === 0) {
    updateData();
  }
}

function drawParticles() {
  stroke(100, 150, 255, 50);
  strokeWeight(1);
  
  for (let p of particles) {
    // Move particles
    p.y -= p.speed;
    if (p.y < 0) p.y = height;
    
    // Draw particle
    point(p.x, p.y);
  }
}

function drawMainDisplay() {
  push();
  translate(width * 0.3, height * 0.4);
  
  // Draw outer ring
  noFill();
  stroke(100, 150, 255);
  strokeWeight(2);
  ellipse(0, 0, 200, 200);
  
  // Draw dynamic ring
  strokeWeight(4);
  let angle = map(currentAQI, 0, 100, 0, TWO_PI);
  arc(0, 0, 180, 180, -HALF_PI, angle - HALF_PI);
  
  // Draw center display
  fill(30, 34, 45);
  noStroke();
  ellipse(0, 0, 150, 150);
  
  // Draw temperature
  textAlign(CENTER, CENTER);
  textSize(36);
  fill(255);
  text(currentTemp + '°C', 0, 0);
  
  pop();
}

function drawGraphs() {
  push();
  translate(width * 0.6, height * 0.3);
  
  // Draw graph background
  fill(30, 34, 45);
  noStroke();
  rect(0, 0, 300, 200);
  
  // Draw graph lines
  strokeWeight(2);
  noFill();
  
  // Temperature graph
  stroke(255, 100, 100);
  beginShape();
  for (let i = 0; i < graphData.length; i++) {
    let x = map(i, 0, graphData.length - 1, 0, 300);
    let y = map(graphData[i].temp, 15, 30, 180, 20);
    vertex(x, y);
  }
  endShape();
  
  // Humidity graph
  stroke(100, 255, 100);
  beginShape();
  for (let i = 0; i < graphData.length; i++) {
    let x = map(i, 0, graphData.length - 1, 0, 300);
    let y = map(graphData[i].humidity, 40, 80, 180, 20);
    vertex(x, y);
  }
  endShape();
  
  pop();
}

function drawLabels() {
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  
  // Main display labels
  text('Air Quality Index: ' + currentAQI, width * 0.2, height * 0.6);
  text('Humidity: ' + currentHumidity + '%', width * 0.2, height * 0.65);
  
  // Graph labels
  text('Temperature History', width * 0.6, height * 0.2);
  text('Humidity History', width * 0.6, height * 0.25);
}

function updateData() {
  // Simulate data updates
  currentTemp += random(-0.5, 0.5);
  currentHumidity += random(-1, 1);
  currentAQI += random(-2, 2);
  
  // Keep values in realistic ranges
  currentTemp = constrain(currentTemp, 18, 28);
  currentHumidity = constrain(currentHumidity, 55, 75);
  currentAQI = constrain(currentAQI, 30, 60);
  
  // Update graph data
  graphData.push({
    temp: currentTemp,
    humidity: currentHumidity,
    aqi: currentAQI
  });
  graphData.shift();
}