        // Node class to represent different modalities
        class Node {
            constructor(x, y, type, label) {
                this.x = x;
                this.y = y;
                this.radius = 20;
                this.type = type;
                this.label = label;
                this.active = true;
                this.pulsePhase = random(TWO_PI);
                this.pulseSpeed = random(0.02, 0.04);
            }

            // Get color based on modality type
            getColor() {
                const colors = {
                    'video': '#FF6B6B',    // Red
                    'audio': '#4ECDC4',     // Cyan
                    'text': '#45B7D1',      // Blue
                    'radar': '#96CEB4',     // Green
                    'satellite': '#FFEEAD', // Yellow
                    'hub': '#FF8C42'        // Orange
                };
                return colors[this.type] || '#FFFFFF';
            }

            update() {
                this.pulsePhase += this.pulseSpeed;
                if (this.pulsePhase > TWO_PI) this.pulsePhase -= TWO_PI;
            }

            draw() {
                if (!this.active) return;

                const pulseSize = sin(this.pulsePhase) * 5;
                const color = this.getColor();
                
                // Draw outer glow
                noFill();
                for (let i = 0; i < 3; i++) {
                    const alpha = map(i, 0, 3, 100, 0);
                    stroke(color.slice(0, -1) + `,${alpha})`);
                    circle(this.x, this.y, this.radius * 2 + pulseSize + i * 5);
                }

                // Draw main node
                fill(color);
                stroke(255, 100);
                circle(this.x, this.y, this.radius * 2);

                // Draw label
                noStroke();
                fill(255);
                textAlign(CENTER, CENTER);
                textSize(12);
                text(this.label, this.x, this.y + this.radius * 1.5);
            }
        }

        // Connection class to represent data flow
        class Connection {
            constructor(startNode, endNode) {
                this.startNode = startNode;
                this.endNode = endNode;
                this.particles = [];
                this.particleSpeed = 2;
                this.lastParticleTime = 0;
            }

            update() {
                if (!this.startNode.active || !this.endNode.active) return;

                // Add new particles periodically
                if (millis() - this.lastParticleTime > 1000) {
                    this.particles.push(0); // 0 represents start of path
                    this.lastParticleTime = millis();
                }

                // Update particle positions
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    this.particles[i] += this.particleSpeed;
                    if (this.particles[i] > 100) {
                        this.particles.splice(i, 1);
                    }
                }
            }

            draw() {
                if (!this.startNode.active || !this.endNode.active) return;

                // Draw base connection line
                stroke(255, 30);
                noFill();
                line(this.startNode.x, this.startNode.y, 
                     this.endNode.x, this.endNode.y);

                // Draw moving particles
                this.particles.forEach(percent => {
                    const x = lerp(this.startNode.x, this.endNode.x, percent / 100);
                    const y = lerp(this.startNode.y, this.endNode.y, percent / 100);
                    
                    const particleColor = lerpColor(
                        color(this.startNode.getColor()),
                        color(this.endNode.getColor()),
                        percent / 100
                    );
                    
                    fill(particleColor);
                    noStroke();
                    circle(x, y, 4);
                });
            }
        }

        let nodes = [];
        let connections = [];
        let hubNode;

        function setup() {
            createCanvas(600, 400);

            // Create hub node at center
            hubNode = new Node(width/2, height/2, 'hub', 'Foundation\nModel Hub');

            // Create modality nodes in a circle around the hub
            const modalityTypes = [
                {type: 'video', label: 'Video'},
                {type: 'audio', label: 'Audio'},
                {type: 'text', label: 'Text'},
                {type: 'radar', label: 'Radar'},
                {type: 'satellite', label: 'Satellite'}
            ];

            const radius = 150;
            const angleStep = TWO_PI / modalityTypes.length;

            modalityTypes.forEach((modality, i) => {
                const angle = i * angleStep - PI/2;
                const x = width/2 + cos(angle) * radius;
                const y = height/2 + sin(angle) * radius;
                
                const node = new Node(x, y, modality.type, modality.label);
                nodes.push(node);
                
                // Create connection to hub
                connections.push(new Connection(node, hubNode));
                connections.push(new Connection(hubNode, node));
            });

            // Add hub node last so it renders on top
            nodes.push(hubNode);
        }

        function draw() {
            background(26);

            // Update and draw connections
            connections.forEach(conn => {
                conn.update();
                conn.draw();
            });

            // Update and draw nodes
            nodes.forEach(node => {
                node.update();
                node.draw();
            });
        }

        // Toggle nodes on click
        function mousePressed() {
            nodes.forEach(node => {
                const d = dist(mouseX, mouseY, node.x, node.y);
                if (d < node.radius) {
                    node.active = !node.active;
                }
            });
        }