// Particle class
// Velocity = speed and direction
// Acceleration = change in speed of velocity (compounded over time)

class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = p5.Vector.random2D();
        this.acc.mult(random(0.05));

        this.colorAlpha = 255;
        this.done = false;
    }

    update() {
        this.finished();

        this.vel.add(this.acc);
        this.pos.add(this.vel);

        this.colorAlpha -= 4;
    }

    display() {
        noStroke();
        fill(255, 0, 0, this.colorAlpha);
        ellipse(this.pos.x, this.pos.y, 2, 2);
    }

    finished() {
        if(this.colorAlpha < 0) {
            this.done = true;
        } else {
            this.done = false;
        }
    }
}