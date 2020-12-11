"use strict";
exports.__esModule = true;
var socket_io_client_1 = require("socket.io-client");
var video_element = document.getElementById("video");
var socket = socket_io_client_1.io("http://localhost:3000");
socket.on("room_data", function (data) {
    var parsed = JSON.parse(data);
    var cur_src = video_element.getAttribute("src");
    var cur_time = video_element.currentTime;
    cur_src != parsed.video ?
        video_element.setAttribute("src", parsed.video) :
        null;
    parsed.playing ?
        video_element.play() :
        video_element.pause();
    parsed.time != cur_time ?
        video_element.currentTime = parsed.time :
        null;
});
var send_sync = function () {
    var cur_src = video_element.getAttribute("src");
    var cur_time = video_element.currentTime;
    var cur_playing = !video_element.paused;
    var cur_room_data = {
        video: cur_src,
        time: cur_time,
        playing: cur_playing
    };
    socket.emit("sync", JSON.stringify(cur_room_data));
};
video_element.addEventListener("play", send_sync);
video_element.addEventListener("pause", send_sync);
video_element.addEventListener("seeked", send_sync);
