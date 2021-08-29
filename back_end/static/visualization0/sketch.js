var raw;
//ajax调用无参数后台方法
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
// Flying text 1 by Andreas Furster
// https://discourse.processing.org/t/flying-text-animation-jitter/10296

let items = [];
let msec  = 500; //every 500ms.
let count = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  update();
  setInterval(update, 60000);
  setInterval(add_item,msec);  // Add an item every 500ms.
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  for (let i = 0; i < items.length; i++) {     // Draw all items
    push();
//    textSize(items[i].size);   // kll disable use scale instead, but not better
    translate( items[i].left, items[i].top);
    map( items[i].gray, min. max, 180, 250);
    fill(180, items[i].opacity);
    scale(items[i].size/50.0);
    text(items[i].text,0,0);
    items[i].size += 1;//0.1;// Increase size and lower opacity each draw to animate
    items[i].opacity -= 0.7;
    pop();
  }
  // Remove all invisible items to increse performance
  items = items.filter(function(item) {
    return item.opacity > 0;
  })
}

function add_item() {
  if (items.length < 45) {
    items.push({
      text: words[count],
      gray: raw[words[count]],
      size: 10,
      opacity: 255,
      left: random(windowWidth),
      top: random(windowHeight)
    });
    count = (count + 1) % Object.keys(words).length;
  }
}
