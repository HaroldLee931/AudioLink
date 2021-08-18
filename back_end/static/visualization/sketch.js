var word;
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
word = get_data();

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(TOP);
}

function draw() {
  background(220);
  // ellipse(width/2, height/2, mouseX, mouseY);  amazing effect :)

  let weight = word['size'];  //  这个size不能太大 如果大了就会不显示 目前极限 13, 72
  let content = word['text'];
  textSize(weight);

  // textAlign(TOP);
  //alert(word['text']);
  //ellipse(mouseX, mouseY, word['size'], height/2);
  text(content, width/2, height/2, 80, 80);
  //ellipse(width/2, height/2 ,weight, weight);
}
