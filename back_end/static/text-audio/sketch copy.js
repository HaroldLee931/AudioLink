/*
var canvas;
var mic;
let cg;

function windowResized() {
  //console.log('resized');
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  pixelDensity(1);
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  // mic = new p5.AudioIn();
  // mic.start();

  cg = createGraphics(windowWidth, windowHeight);
  noStroke();
}

function keyPressed() {
  // clear();
}

function draw() {
  let s = "Harold";
  cg.textSize(90);
  cg.fill(255);
  cg.background(0);

  cg.text(s, windowWidth/2 , windowHeight/2);
  cg.textAlign(CENTER, CENTER);

  for(let i =0; i< 100; i++){
    let x = random(windowWidth);
    let y = random(windowHeight);

    if( cg.get(x, y)[0] == 255 ){
     let r = int(random(3));
     if( r == 0){
     fill(255,0,80);
     } else if( r == 1){
      fill(255,200,0);
     } else if( r == 2){
      fill(0,80,255);
     }
     ellipse(x, y, random(1, 10));
    }
  }
  // var vol = mic.getLevel();
  // ellipse(width / 2, height / 2, vol * width);
}
*/