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

// Body detection variables
let video;
let bodyPose;
let poses = [];
let lerpedX = 0;
let lerpedY = 0;

function preload() {
  // The model is being loaded from the cloud (Google server somewhere)
  // Images processed through model happens on computer
  bodyPose = ml5.bodyPose("MoveNet", {flipped:true});
}

function gotPoses(results) {
  poses = results;
}

function setup() {
  createCanvas(600, 600);
  //particleSystem = new System(width/2, height/2);
  video = createCapture(VIDEO);
  video.hide();

  // .detect looks at one image one time
  // .detectStart continuously detects
  // callback function for anytime it has recieved a result from the model
  bodyPose.detectStart(video, gotPoses);
}

function draw() {
  background(0);

  // random() returns a value between [0, 1)
  //if(random() < 0.3) {
  //  particleSystem.push(new System(mouseX, mouseY));
  //}
  if(poses.length > 0) {
    //console.log("at least one pose detected");
    // for each person detected
    for(let i = 0; i < poses.length; i++) {
      // for each keypoint in each person detected
      //console.log("in person for loop");
      for(let j = 0; j < poses[i].keypoints.length; j++) {
        //console.log("in keypoint for loop");
        if(poses[i].keypoints[j].confidence > 0.5) {
          console.log("Confidence is over 0.5");
          if(particleSystem.length <= 100) {
            particleSystem.push(new System(poses[i].keypoints[j].x,
                                        poses[i].keypoints[j].y
          ))
          }
        }
      }
    }
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
}

function mouseClicked() {
  particleSystem.push(new System(mouseX, mouseY));
  console.log(poses);
}