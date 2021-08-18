// This file for saving the user input data.

var constraints = { audio: true,video:false }
var promise = navigator.mediaDevices.getUserMedia(constraints);
promise.then(function (stream) {
    var audio = document.createElement('audio');
    var recorder = new MediaRecorder(stream);
    recorder.start(); // 开始记录

    setTimeout(() => { recorder.stop() }, 5000); // 5秒后停止记录

    recorder.ondataavailable = function (event) {
    	// 当停止记录后播放数据
        console.log(event.data); // Blob
        audio.src = URL.createObjectURL(event.data);
        audio.play()
    }
});


promise.catch(function (error) {
    console.log(error)
});

window.onkeypress = function () {
  console.log("keypress!!!");
}
/*
window.onkeydown = function () {
  console.log("keydown!!!");
}
*/
window.onkeyup = function () {
  console.log("keyup!!!");
}

function checkKeyBoard() {
  console.log(window.onkeypress);
};