let capture; 

// ml5 Face Detection Model
let faceapi;
let detections = [];
//arrays to store the x and y positions of the four corner dots
let pointpositionsx = [];
let pointpositionsy = [];

let x = 320;
let y = 180;
let xspeed = 0;
let yspeed = 2;
face_x = 0;
face_y = 0;

var tl_x;
var tl_y;
var bl_x;
var bl_y;
var tr_x;
var tr_y;
var br_x;
var br_y;


let r = 25;

function setup() {
  //createCanvas(640, 360);
  createCanvas(1280, 720);
  // Creat the video and start face tracking
  capture = createCapture(VIDEO);
  //capture.size(640, 360);
  capture.size(1280, 720);
  capture.hide();
  // Only need landmarks for this example
  const faceOptions = { withLandmarks: true, withExpressions: false, withDescriptors: false ,};
  faceapi = ml5.faceApi(capture, faceOptions, faceReady);
}

// Start detecting faces
function faceReady() {
  faceapi.detect(gotFaces);
}

// Got faces
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  detections = result;
  faceapi.detect(gotFaces);
}

function draw() {
  
  
  background(0);
 
  translate(1280, 0);
  scale(-1.0, 1.0);
  //image(capture, 0, 0, 640, 360);
  image(capture, 0, 0, 1280, 720);
  translate(1280, 0);
  scale(-1.0, 1.0);
  
  // Just look at the first face and draw all the points
  if (detections.length > 0) {
    let points = detections[0].landmarks.positions;
    for (let i = 0; i < 68 /*points.length*/; i++) {
      stroke(161, 95, 251);
      strokeWeight(4);
      if(i == 16) {
        stroke(255,0,0);
        tr_x = points[i]._x;
        tr_y = points[i]._y;
        point(1280 - points[i]._x, points[i]._y);
        pointpositionsx[0] = 1280 - points[i]._x;
        pointpositionsy[0] = points[i]._y;
      }
      if(i == 0) {
        tl_x = points[i]._x;
        tl_y = points[i]._y;
        point(1280 - points[i]._x, points[i]._y);
        pointpositionsx[1] = 1280 - points[i]._x;
        pointpositionsy[1] = points[i]._y;
      }
      if(i == 3) {
        bl_x = points[i]._x;
        bl_y = points[i]._y;
        stroke(0,255,0);
        point(1280 - points[i]._x, points[i]._y);
        pointpositionsx[2] = 1280 - points[i]._x;
        pointpositionsy[2] = points[i]._y;
      }
      if(i == 12) {
        br_x = points[i]._x;
        br_y = points[i]._y;
        stroke(0,0,255);
        point(1280 - points[i]._x, points[i]._y);
        pointpositionsx[3] = 1280 - points[i]._x;
        pointpositionsy[3] = points[i]._y;
      }
    }
  }
  
  color(0, 255, 0);
  ellipse(x, y - r, r*2, r*2);
  rect(mouseX-50, mouseY-50, 100, 100);
  x += xspeed;
  y -= yspeed;
  face_y_upper = mouseY-50;
  face_y_lower = mouseY+50;
  face_x_lower = mouseX-50;
  face_x_upper = mouseX+50;
  //ellipse(x, y, 5, 5);
  color(255, 0, 0);
  
  yspeed -= 0.2;
  if (x > width - r || x < r) {
    xspeed = -xspeed;
  }
  if (y > height - r)  {
    yspeed = random(5, 10);
    xspeed = random(-6, 6);
    //yspeed = -yspeed;
  }
  
    if (y < 0)  {
    yspeed = -random(5, 10);
    xspeed = random(-6, 6);
    //yspeed = -yspeed;
  }
   
  //here is where I would swap out the positions of the box corners with the four dots
  if ((y > tl_y) && (x < tr_x) && (x > tl_x) && (y < br_y)) {
    yspeed = random(5, 10);
    xspeed = random(-6, 6);
    //yspeed = -yspeed;
  }
  
   if ((y < face_y_lower) && (x < face_x_upper) && (x > face_x_lower) && (y > face_y_upper)) {
    yspeed = random(5, 10);
    xspeed = random(-6, 6);
    //yspeed = -yspeed;
  }


}
