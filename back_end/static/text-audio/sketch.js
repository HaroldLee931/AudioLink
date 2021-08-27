var r_width = 0.027;
var r_start = [0,   1,   2,   3,   4,   5,    5];
var r_hight = [0.2, 0.3, 0.4, 0.7, 0.5, 0.25, 0.15];
var space = 0.009;
var speed =   [3.5,   2.5,    1.5,    0.5,    1.5,    2.5,   3.5];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  basic = windowHeight/100;
  r_hight = r_hight.map(function(i){return i * windowHeight})
  console.log(windowWidth);
}

function windowResized() {
  //console.log('resized');
  resizeCanvas(windowWidth, windowHeight);
  r_start = [0,   1,   2,   3,   4,   5,    6];
  r_hight = [0.2, 0.3, 0.4, 0.7, 0.5, 0.25, 0.15];
  r_hight = r_hight.map(function(i){return i * windowHeight})
}

function draw() {
  background(0);
  for(var i = 0; i <= 6; i++) {
    rect(windowWidth * 3/4 + i * (space + r_width) * windowWidth,
         r_start[i],
         r_width * windowWidth,
         r_hight[i]
         , 15);
    r_start[i] = r_start[i] + speed[i];
    if(r_start[i] > windowHeight - r_hight[i] || r_start[i] < 0){
      speed[i] = -speed[i];
    }
  }
}