// Render a simple sine wave. Original by Daniel Shiffman.

let xspacing = 12.2; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 75.0; // Height of wave
let period = 500.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave

let sentence = "Rebuild the link between us.   re:Babel   rebuild the link between us.   rebuild the link between us.   re:Babel   rebuild the link between us.";
let sentenceArray = [];

function windowResized() {
  //console.log('resized');
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  w = width + 16;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));

}

function draw() {
  background(0);
  calcWave();
  renderWave();
}

function calcWave() {
  // Increment theta (try different values for
  // 'angular velocity' here)
  theta += 0.02;

  // For every x value, calculate a y value with sine function
  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = cos(x) * amplitude;
    x += dx;
  }
}

function renderWave() {
  sentenceArray = sentence.split("");
  noStroke();
  fill(255);
  // A simple way to draw the wave with an ellipse at each location
  for (let x = 0; x < sentenceArray.length; x++) {
    // ellipse(x * xspacing, height / 2 + yvalues[x], 16, 16);
    text(sentenceArray[x], x * xspacing, height / 2 + yvalues[x], 16, 16);
    for (var i = 0; i <= windowHeight / 200; i++) {
      text(sentenceArray[x], x * xspacing, height / 2 + yvalues[x] - i * 100, 16, 16);
      text(sentenceArray[x], x * xspacing, height / 2 + yvalues[x] + i * 100, 16, 16);
    }
  }
}

/* 定时刷新数据功能
var counter = 1;
function changeContext() {
  sentence = counter + "assdwqdqaqfa";
  counter++;
}
setInterval(changeContext,1000);
*/