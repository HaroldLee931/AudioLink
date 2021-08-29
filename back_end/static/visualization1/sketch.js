var raw;

function get_data() {
  var wordData;
    $.ajax({
              type: "get",
              url: "/get_data",
              dataType: 'json',
              async:false,
              wordData,
              success: function (word) {
                  wordData = word;
              }
          });
  console.log(wordData['size']);
  return wordData;
};

var words, min, max;

function update() {
  raw = get_data();
  words = Object.keys(raw);
  max = raw[words[0]];
  min = min = raw[words[0]];
  for (key in raw) {
    if (raw[key] > max) max =  raw[key];
    if (raw[key] < max) max =  raw[key];
  }
}

var xList = [0,   0,   0,   0,   0  ];
var yList = [3/6, 4/6, 1/6, 5/6, 2/6];
var aList = [0.7, 0.85,1,   1.15,1.3];
var speedX = 1;
var speedX1 = 1.5;
var speedY= 1.6;

let items = [];
let msec  = 500; //every 500ms.
let count = 0;

var pause;
var continue_;
var timer;
var counter = 0;
var location_counter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  update();
  setInterval(update, 60000);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {
  timer = millis() % 7000;
  background(0);
  //y = y + random(-speedY, speedY);
  //if (timer < 5000) {
    for (var i1 = 0; i1 < 5; i1 ++) {xList[i1] = xList[i1] + aList[i1];}
  //}
  counter = counter % words.length;
  console.log(counter);
  var many = 2
  for (var k = 0; k < 5; k++ ) {
    for (var i = 0; i < many; i++){
      //ellipse((xList[k] + i * windowWidth/many)%windowWidth, yList[k] * windowHeight, (10 - many)*10,(10 - many)*10);
      fill(map( raw[words[counter + i + k * many]], min, max, 180, 250));
      // scale((10 - many)*10);
      textSize(80 - many * 10);
      text(words[counter + i + k * many], (xList[k] + i * windowWidth/many)%windowWidth, yList[k] * windowHeight);
      // translate((xList[k] + i * windowWidth/many)%windowWidth, yList[k] * windowHeight);
      //ellipse(0,0,(10 - many)*10,(10 - many)*10);
      //scale((10 - many)*10);
      //text("HHE",0,0);

    }
    location_counter++;
    if (location_counter >= windowWidth/many) {counter++; location_counter=0}
    many++;

  }

}
