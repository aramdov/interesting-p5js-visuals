let wavePoints = [];
let modalities = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  
  // Initialize modalities with different properties
  modalities = [
    {
      name: "Vision",
      color: color(100, 200, 255),
      frequency: 0.8,
      amplitude: 1.2,
      phase: 0,
      active: true,
      icon: "👁️"
    },
    {
      name: "Audio",
      color: color(255, 100, 100),
      frequency: 1.2,
      amplitude: 1.0,
      phase: PI / 3,
      active: true,
      icon: "🔊"
    },
    {
      name: "Text",
      color: color(100, 255, 100),
      frequency: 1.5,
      amplitude: 0.8,
      phase: PI / 1.5,
      active: true,
      icon: "📝"
    },
    {
      name: "Sensor",
      color: color(255, 200, 100),
      frequency: 2.0,
      amplitude: 0.6,
      phase: PI,
      active: true,
      icon: "📡"
    }
  ];
  
  // Initialize waveform points
  for (let i = 0; i < 360; i++) {
    wavePoints.push(0);
  }
}

function draw() {
  background(20);
  
  // Center the visualization
  translate(width/2, height/2);
  
  // Update time
  time += 0.02;
  
  // Calculate new waveform points
  for (let i = 0; i < 360; i++) {
    let angle = radians(i);
    let r = 150; // Base radius
    
    // Combine waveforms from active modalities
    let waveform = 0;
    for (let mod of modalities) {
      if (mod.active) {
        waveform += mod.amplitude * 
                    sin(angle * mod.frequency + time + mod.phase) * 
                    20; // Scale factor for wave height
      }
    }
    
    wavePoints[i] = r + waveform;
  }
  
  // Draw the combined waveform
  noFill();
  strokeWeight(2);
  
  // Draw multiple layers with different colors
  for (let layer = 0; layer < modalities.length; layer++) {
    if (modalities[layer].active) {
      stroke(modalities[layer].color);
      beginShape();
      for (let i = 0; i < 360; i++) {
        let angle = radians(i);
        let r = wavePoints[i] - layer * 5; // Offset each layer slightly
        let x = r * cos(angle);
        let y = r * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
  }
  
  // Draw modality indicators around the circle
  let iconRadius = 200;
  textSize(20);
  textAlign(CENTER, CENTER);
  
  for (let i = 0; i < modalities.length; i++) {
    let mod = modalities[i];
    let angle = (TWO_PI / modalities.length) * i - PI/2;
    let x = iconRadius * cos(angle);
    let y = iconRadius * sin(angle);
    
    // Draw indicator background
    fill(20);
    stroke(mod.active ? mod.color : color(100));
    strokeWeight(2);
    circle(x, y, 40);
    
    // Draw icon
    noStroke();
    fill(mod.active ? mod.color : color(100));
    text(mod.icon, x, y);
    
    // Draw label
    textSize(14);
    text(mod.name, x, y + 30);
  }
}

// Toggle modality when clicking near its icon
function mousePressed() {
  let iconRadius = 200;
  let mx = mouseX - width/2;
  let my = mouseY - height/2;
  
  for (let i = 0; i < modalities.length; i++) {
    let angle = (TWO_PI / modalities.length) * i - PI/2;
    let x = iconRadius * cos(angle);
    let y = iconRadius * sin(angle);
    
    // Check if click is within 20 pixels of icon
    if (dist(mx, my, x, y) < 20) {
      modalities[i].active = !modalities[i].active;
      break;
    }
  }
}