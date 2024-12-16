// Stream classes to handle different data types
class VideoStream {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.frames = [];
      this.processingLevel = 0;
      
      // Generate some random "frames"
      for (let i = 0; i < 8; i++) {
        this.frames.push(this.generateFrame());
      }
    }
  
    generateFrame() {
      let frame = [];
      for (let i = 0; i < 4; i++) {
        frame.push(random(255));
      }
      return frame;
    }
  
    update() {
      // Simulate new frame arrival
      if (frameCount % 10 === 0) {
        this.frames.shift();
        this.frames.push(this.generateFrame());
      }
      
      // Update processing indicator
      this.processingLevel = noise(frameCount * 0.02) * 100;
    }
  
    draw() {
      push();
      // Draw stream container
      noFill();
      stroke(200);
      rect(this.x, this.y, this.w, this.h);
      
      // Draw frames
      let frameWidth = this.w / 8;
      for (let i = 0; i < this.frames.length; i++) {
        let frame = this.frames[i];
        fill(frame[0], frame[1], frame[2], frame[3]);
        noStroke();
        rect(this.x + i * frameWidth, this.y, frameWidth, this.h);
      }
      
      // Draw processing indicator
      this.drawProcessingBar();
      
      // Label
      fill(255);
      noStroke();
      textAlign(LEFT, TOP);
      text("Video Stream", this.x, this.y - 20);
      pop();
    }
  
    drawProcessingBar() {
      // Draw processing progress bar
      let barHeight = 5;
      noStroke();
      fill(100);
      rect(this.x, this.y + this.h + 5, this.w, barHeight);
      fill(0, 255, 0);
      rect(this.x, this.y + this.h + 5, this.w * (this.processingLevel/100), barHeight);
    }
  }
  
  class AudioStream {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.waveform = [];
      this.processingLevel = 0;
      
      // Initialize waveform
      for (let i = 0; i < 100; i++) {
        this.waveform.push(0);
      }
    }
  
    update() {
      // Simulate audio waveform
      this.waveform.shift();
      this.waveform.push(noise(frameCount * 0.1) * 2 - 1);
      
      // Update processing indicator
      this.processingLevel = noise(frameCount * 0.015) * 100;
    }
  
    draw() {
      push();
      // Draw stream container
      noFill();
      stroke(200);
      rect(this.x, this.y, this.w, this.h);
      
      // Draw waveform
      stroke(0, 255, 255);
      noFill();
      beginShape();
      for (let i = 0; i < this.waveform.length; i++) {
        let x = map(i, 0, this.waveform.length, this.x, this.x + this.w);
        let y = this.y + (this.h/2) + (this.waveform[i] * this.h/2);
        vertex(x, y);
      }
      endShape();
      
      // Draw processing indicator
      this.drawProcessingBar();
      
      // Label
      fill(255);
      noStroke();
      textAlign(LEFT, TOP);
      text("Audio Stream", this.x, this.y - 20);
      pop();
    }
  
    drawProcessingBar() {
      let barHeight = 5;
      noStroke();
      fill(100);
      rect(this.x, this.y + this.h + 5, this.w, barHeight);
      fill(0, 255, 255);
      rect(this.x, this.y + this.h + 5, this.w * (this.processingLevel/100), barHeight);
    }
  }
  
  class TextStream {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.text = "";
      this.words = ["processing", "multimodal", "data", "streams", "AI", "learning", 
                    "neural", "networks", "foundation", "model"];
      this.processingLevel = 0;
    }
  
    update() {
      // Simulate text input
      if (frameCount % 20 === 0) {
        this.text += this.words[floor(random(this.words.length))] + " ";
        if (this.text.length > 100) {
          this.text = this.text.slice(50);
        }
      }
      
      // Update processing indicator
      this.processingLevel = noise(frameCount * 0.025) * 100;
    }
  
    draw() {
      push();
      // Draw stream container
      noFill();
      stroke(200);
      rect(this.x, this.y, this.w, this.h);
      
      // Draw scrolling text
      fill(255);
      noStroke();
      textSize(14);
      textAlign(LEFT, CENTER);
      text(this.text, this.x + 10, this.y, this.w - 20, this.h);
      
      // Draw processing indicator
      this.drawProcessingBar();
      
      // Label
      fill(255);
      noStroke();
      textAlign(LEFT, TOP);
      text("Text Stream", this.x, this.y - 20);
      pop();
    }
  
    drawProcessingBar() {
      let barHeight = 5;
      noStroke();
      fill(100);
      rect(this.x, this.y + this.h + 5, this.w, barHeight);
      fill(255, 200, 0);
      rect(this.x, this.y + this.h + 5, this.w * (this.processingLevel/100), barHeight);
    }
  }
  
  class StructuredDataStream {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.dataPoints = [];
      this.maxPoints = 50;
      this.processingLevel = 0;
      
      // Initialize with some data points
      for (let i = 0; i < this.maxPoints; i++) {
        this.dataPoints.push(random());
      }
    }
  
    update() {
      // Simulate new data arrival
      if (frameCount % 5 === 0) {
        this.dataPoints.shift();
        this.dataPoints.push(noise(frameCount * 0.05));
      }
      
      // Update processing indicator
      this.processingLevel = noise(frameCount * 0.03) * 100;
    }
  
    draw() {
      push();
      // Draw stream container
      noFill();
      stroke(200);
      rect(this.x, this.y, this.w, this.h);
      
      // Draw graph
      stroke(255, 100, 100);
      noFill();
      beginShape();
      for (let i = 0; i < this.dataPoints.length; i++) {
        let x = map(i, 0, this.dataPoints.length, this.x, this.x + this.w);
        let y = map(this.dataPoints[i], 0, 1, this.y + this.h, this.y);
        vertex(x, y);
      }
      endShape();
      
      // Draw processing indicator
      this.drawProcessingBar();
      
      // Label
      fill(255);
      noStroke();
      textAlign(LEFT, TOP);
      text("Structured Data Stream", this.x, this.y - 20);
      pop();
    }
  
    drawProcessingBar() {
      let barHeight = 5;
      noStroke();
      fill(100);
      rect(this.x, this.y + this.h + 5, this.w, barHeight);
      fill(255, 100, 100);
      rect(this.x, this.y + this.h + 5, this.w * (this.processingLevel/100), barHeight);
    }
  }
  
  // Global variables
  let videoStream;
  let audioStream;
  let textStream;
  let structuredDataStream;
  
  function setup() {
    createCanvas(800, 600);
    
    // Initialize streams with different positions and sizes
    videoStream = new VideoStream(50, 50, 300, 100);
    audioStream = new AudioStream(50, 200, 300, 100);
    textStream = new TextStream(400, 50, 300, 100);
    structuredDataStream = new StructuredDataStream(400, 200, 300, 100);
  }
  
  function draw() {
    background(30);
    
    // Update and draw all streams
    videoStream.update();
    videoStream.draw();
    
    audioStream.update();
    audioStream.draw();
    
    textStream.update();
    textStream.draw();
    
    structuredDataStream.update();
    structuredDataStream.draw();
  }