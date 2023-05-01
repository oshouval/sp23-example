let fishes = [];

class Fish {
  constructor(x, y) {
    this.location = createVector(x, y);
    this.length = random(20, 75);
    this.height = random(20, 50);

    this.color = color(random(255), random(255), random(255));

    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxSpeed = 10;
    this.maxForce = .1;

    this.faceDirection = this.velocity.heading();
  }

  display() {
    stroke(this.color);
    noFill();
    push();
    translate(this.location.x, this.location.y);
    rotate(this.faceDirection);
    triangle(
      -this.length / 4,
      0,
      -(this.length * 3) / 4,
      this.height / 2,
      -(this.length * 3) / 4,
      -this.height / 2
    );
    ellipse(0, 0, this.length, this.height);
    ellipse(0 + this.length / 4, 0, 5, 5);
    pop();
  }

  update() {
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;

    this.faceDirection = this.velocity.heading();

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);

    this.acceleration.mult(0);
  }

  align(fishes) {

    let steering = createVector();
    let total = 0;
    for (let other of fishes) {


      if (other != this) {
        steering.add(other.velocity);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(fishes) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;

     for (let other of fishes){
        steering.add(other.location);
        total++;
      }


    if (total > 0) {
      steering.div(total);
      steering.sub(this.location);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(fishes) {

    let steering = createVector();
    let total = 0;
    for (let other of fishes) {
      let d = dist(
        this.location.x,
        this.location.y,
        other.location.x,
        other.location.y
      );

      if (other != this) {
        let diff = p5.Vector.sub(this.location, other.location);
        diff.div(d);
        steering.add(diff);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }





  flock(fishes) {

    let perceptionRadius = 100;
    let closeFish = [];

    for (let other of fishes) {
      let d = dist(
        this.location.x,
        this.location.y,
        other.location.x,
        other.location.y
      );

      if (other != this && d < perceptionRadius) {

        closeFish.push(other);

      }
    }



    let alignment = this.align(closeFish);
    let cohesion = this.cohesion(closeFish);
    let separation = this.separation(closeFish);

   alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  constrain() {
    if (this.location.x > width + this.length) {
      this.location.x = -this.length;
    }
    if (this.location.y > height + this.height) {
      this.location.y = -this.height;
    }
    if (this.location.x < -this.length) {
      this.location.x = width + this.length;
    }
    if (this.y < -this.height) {
      this.location.y = height + this.height;
    }
  }
}



let alignSlider, cohesionSlider, separationSlider;

function setup() {
  createCanvas(windowWidth, windowHeight);

  alignSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 1, 0.1);

  for(var i = 0; i<75; i++){
     fishes.push(new Fish(random(width), random(height)));
  }


}

function draw() {
  background(10);

  for (var i = 0; i < fishes.length; i++) {
    fishes[i].display();

    fishes[i].update();
    fishes[i].flock(fishes);
    fishes[i].constrain();
  }
}


function mouseDragged() {

}
