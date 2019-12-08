let boing;
let boing2;
let rockSound;
let capture; 
var score;
let col;
let fifaFont;
let startScreen, soccerBall, rock;
let point_trigger = false;

//boolean for game on/off
let gameState;
let endState = false;

//start and quit buttons
let startButton, quitButton;
let startText, quitText;

// ml5 Face Detection Model
let faceapi;
let detections = [];

let x = 640;
//let y = 100;
let y = -500;
let xspeed = 0;
let yspeed = 2;
face_x = 0;
face_y = 0;

let rock_x = 10;
let rock_y = 0;

var tl_x;
var tl_y;
var bl_x;
var bl_y;
var tr_x;
var tr_y;
var br_x;
var br_y;


let r = 50;

function preload() {
  soundFormats('ogg', 'mp3');
  startScreen = loadImage("startScreen.jpg");
  fifaFont = loadFont('EASPORTS15.ttf');
  soccerBall = loadImage("soccerBall.png");
  rock = loadImage("rock.png");
}

function setup() {
  boing = loadSound('boing.mp3');
  boing2 = loadSound('boing2.mp3');
  rockSound = loadSound('rock.mp3');
  
  createCanvas(1280, 720);
  
  // Creat the video and start face tracking
  capture = createCapture(VIDEO);
  capture.size(1280, 720);
  capture.hide();
  // Only need landmarks for this example
  const faceOptions = { withLandmarks: true, withExpressions: false, withDescriptors: false ,};
  faceapi = ml5.faceApi(capture, faceOptions, faceReady);
  
  score = 0;
  
  gameState = false;
  gameButtons(gameState);
}

function gameButtons() {
  if(gameState == false) {
    col = color(220,20,60);
    
    startButton = createButton("Start Game");
    startButton.position(840, 420);
    startButton.size(200, 80);
    startButton.style('font-size', '26px');
    startButton.style('font-family', 'EASPORTS15');
    startButton.style('background-color', col);
    startButton.style('color', '#ffffff');
    startButton.mousePressed(power);
  }
  if(gameState == true) {
    quitButton = createButton("Quit");
    quitButton.position(15, 668);
    quitButton.size(80, 32);
    quitButton.style('font-size', '16px');
    quitButton.style('font-family', 'EASPORTS15');
    quitButton.style('background-color', col);
    quitButton.style('color', '#ffffff');
    quitButton.mousePressed(power);
  }
}

function power() {
  if(gameState == false) {
    gameState = true;
    startButton.hide();
    gameButtons();
  }
  
  else {
    gameState = false;
    quitButton.hide();
    score = 0;
    gameButtons();
  }
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

function mouseClicked() {
  if (endState == true)
  {
    endState = false;
    gameState = true;
    x = 640;
    y = 100;
    score = 0;
    //rock_y = 0;
    rock_y = -500;
    xspeed = 0;
    yspeed = 2;
  }
}

function draw() {
  
  if(gameState == false) {
    textAlign(RIGHT);
    image(startScreen, 0, 0, 1280, 720);
    textFont(fifaFont, 100);
    fill(col);
    stroke(255);
    strokeWeight(4);
    text("Head Ball", 1190, 330);
  }
  
  if(endState == true)
  {
    textAlign(RIGHT);
    image(startScreen, 0, 0, 1280, 720);
    textFont(fifaFont, 100);
    fill(col);
    stroke(255);
    strokeWeight(4);
    text("Game Over!", 1190, 300);
    text("Score ", 960, 400);
    text(score, 1050, 400);
    textFont('Calibri', 100);
    text(": ", 1010, 390);
    textFont(fifaFont, 30);
    text("click  anywhere  to  play  again", 1135, 500);
  }
  
  if(gameState == true) {

    background(0);
   
    translate(1280, 0);
    scale(-1.0, 1.0);
    image(capture, 0, 0, 1280, 720);
    translate(1280, 0);
    scale(-1.0, 1.0);
    
    textSize(32);
    fill(col);
    stroke(255);
    textAlign(RIGHT);
    text("Score: " + score, 1260, 700);
    
    // Just look at the first face and draw all the points
    if (detections.length > 0) {
      let points = detections[0].landmarks.positions;
      for (let i = 0; i < 68 /*points.length*/; i++) {
        strokeWeight(4);
        if(i == 16) {
          stroke(255,0,0);
          tl_x = 1280 - points[i]._x;
          tl_y = points[i]._y;
          point(1280 - points[i]._x, points[i]._y);
        }
        if(i == 0) {
          stroke(161, 95, 251);
          tr_x = 1280 - points[i]._x;
          tr_y = points[i]._y;
          point(1280 - points[i]._x, points[i]._y);
        }
        if(i == 3) {
          stroke(0,255,0);
          br_x = 1280 - points[i]._x;
          br_y = points[i]._y;
          point(1280 - points[i]._x, points[i]._y);
        }
        if(i == 12) {
          stroke(0,0,255);
          bl_x = 1280 - points[i]._x;
          bl_y = points[i]._y;
          point(1280 - points[i]._x, points[i]._y);
        }
      }
    }
    
    stroke(255);
    //ellipse(x, y - r, r*2, r*2);
    //replaced the elipse with soccer ball image
    image(soccerBall, x, y-100, r*2, r*2);
    image(rock, rock_x, rock_y-100, 100, 100);
    rock_y += 4;
    //rect(mouseX-50, mouseY-50, 100, 100);
    x += xspeed;
    y -= yspeed;
    face_y_upper = mouseY-50;
    face_y_lower = mouseY+50;
    face_x_lower = mouseX-50;
    face_x_upper = mouseX+50;
    
    //yspeed -= 0.5;
    yspeed -= 0.1;
    if (x > width - r || x < r) {
      xspeed = -xspeed;
    }
    if (y > height - r)  {
      yspeed = random(30, 40);
      //xspeed = random(-6, 6);
      //yspeed = -yspeed;
      gameState = false;
      endState = true;
    }
    
    if (rock_y > height - 30)  {
      rock_x = random(100, 1000);
      rock_y = 0;
    }
    
      if (y < 0)  {
      yspeed = -random(15, 20);
      //xspeed = random(-6, 6);
      //yspeed = -yspeed;
    }
    
    if ((y > tl_y) && (x < tr_x) && (x > tl_x) && (y > tr_y)) {
      if (point_trigger == false)
      {
        boing2.play();
        score += 1;
        point_trigger = true;
      }
      yspeed = random(15, 20);
      xspeed = random(-12, 12);
      //yspeed = -yspeed;
    }
    
     else if ((y < face_y_lower) && (x < face_x_upper) && (x > face_x_lower) && (y > face_y_upper)) {
      if (point_trigger == false)
      {
        boing2.play();
        score += 1;
        point_trigger = true;
      }
      yspeed = random(15, 20);
      xspeed = random(-12, 12);
      //yspeed = -yspeed;
    }
    else
    {
      point_trigger = false;
    }
    
    if ((rock_y > tl_y) && (rock_x < tr_x) && (rock_x > tl_x) && (rock_y > tr_y)) {
      rockSound.play();
      gameState = false;
      endState = true;
    }
    
     else if ((rock_y < face_y_lower) && (rock_x < face_x_upper) && (rock_x > face_x_lower) && (rock_y > face_y_upper)) {
      rockSound.play();
      gameState = false;
      endState = true;
    }
    
  }

}
