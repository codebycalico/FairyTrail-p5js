// Calico Rose
// August 25, 2025
// Particle System tutorial by Patt Vira
// https://www.youtube.com/watch?v=QlpadcXok8U
// The Coding Train's tutorial video for pose estimation:
// https://www.youtube.com/watch?v=T99fNXTUUaQ&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=1
// COCO dataset - common objects in context
// Good reference: Humans of AI and MoveNet blog post

let speedMin = 0.002;
let speedMax = 0.4;
let particleSystem = [];
let hueArray = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250]

// Body detection variables
let video;
let bodyPose;
let poses = [];
let lastPersonSeen;

function preload() {
  // The model is being loaded from the cloud (Google server somewhere)
  // Images processed through model happens on computer
  bodyPose = ml5.bodyPose("MoveNet");
}

function gotPoses(results) {
  poses = results;
}

function idle() {
  // random() returns a float value between [0, 1)
  if(random() < 0.05) {
    particleSystem.push(new System(random(width/4, width-(width/2)), random(height/4, height-(height/4)), random(10)*25));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  video = createCapture(VIDEO);
  video.hide();

  // .detect looks at one image one time
  // .detectStart continuously detects
  // callback function for anytime it has recieved a result from the model
  bodyPose.detectStart(video, gotPoses);
}

function draw() {
  push();
  translate(width, 0);
  scale(-1, 1);

  background(0);

  if(poses.length > 0) {
    if(millis() - lastPersonSeen >= 2000) {
      // if it has been at least 2 seconds since a person was
      // last detected, shuffle the hue array'
      hueArray = shuffle(hueArray, true);
    } 
    // Start timer when at least one person is detected
    lastPersonSeen = millis();
    //console.log("at least one pose detected");
    // for each person detected
    for(let i = 0; i < poses.length; i++) {
      for(let j = 0; j < poses[i].keypoints.length; j++) {
        // find the first keypoint with a good confidence score
        // create the particle system there and break out of the
        // keypoint loop
        if(poses[i].keypoints[j].confidence > 0.5) {
          // particle system at each keypoint
          particleSystem.push(new System(poses[i].keypoints[j].x,
                              poses[i].keypoints[j].y, hueArray[i] ));
          // particle system at first confident keypoint
          // have break so it breaks after drawing the first confident one
          // without break, will draw at each detected keypoint
          break;
        }
      }
      // for each keypoint in each person detected
      //console.log("in person for loop");
      /*for(let j = 0; j < poses[i].keypoints.length; j++) {
        //console.log("in keypoint for loop");
        if(poses[i].keypoints[j].confidence > 0.5) {
          console.log("Confidence is over 0.5");
          if(particleSystem.length <= 20) {
            particleSystem.push(new System(poses[i].keypoints[j].x,
                                        poses[i].keypoints[j].y
          ))
          }
        }
      } */
    }
  } else {
    idle();
  }

  for(let i = particleSystem.length - 1; i >= 0; i--) {
    particleSystem[i].update();
    particleSystem[i].display();

    if(particleSystem[i].done) {
      particleSystem.splice(i , 1);
    }
    console.log(particleSystem.length);
  }

  //currentSpeed = random(speedMin, speedMax);
  //x += currentSpeed;
  //y += currentSpeed;

  //sinX = sin(x);
  //cosY = cos(y);

  //x2 = map(sinX, -1, 1, 0, width - (width/4));
  //y2 = map(cosY, -1, 1, 0, height - (height/4));

  //ellipse(x2, y2, 50, 50);
  pop();
}

function mouseClicked() {
  particleSystem.push(new System(mouseX, mouseY));
  console.log(poses);
}