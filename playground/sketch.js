let muFont;
/*
var wordData;
function getDataFromServer() {
  var result;
  $(function () {
    $.ajax({
      type: "get",
      url: "http://192.168.0.103:8988/get_data",
      result,
      success: function (word) {
        result = word;
        alert("1" + result);
      }
    });
  }
  alert("2" + result);
  return result;

};
*/

var word;
//ajax调用无参数后台方法
function get_data() {
  var wordData;
    $.ajax({
              type: "get",
              url: "http://192.168.11.242:8988/get_data",
              dataType: 'json',
              async:false,
              wordData,
              success: function (word) {
                  wordData = word;
              }
          })
  return wordData;
};
word = get_data();
// alert(word);

function preload() {
  myFont = loadFont('./source/Noto_Serif_TC/NotoSerifTC-Light.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //思源宋字体显示不全 textFont(myFont);
}

function movement(){
  //  The the word movement speed
  return [0, 0];
}

let charItem = {size: 60, text: "haroldh"};
function draw() {
  background(220);
  // ellipse(width/2, height/2, mouseX, mouseY);  amazing effect :)

  let weight = word['size'];  //  这个size不能太大 如果大了就会不显示 目前极限 13, 72
  //console.log(typeof(weight));
  let content = word['text'];
  textSize(weight);

  textAlign(CENTER, CENTER);
  //alert(word['text']);
  //ellipse(mouseX, mouseY, word['size'], height/2);
  text(content, width/2, height/2, 80, 80);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
