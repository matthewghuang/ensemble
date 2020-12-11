System.register(["socket.io-client"], function (exports_1, context_1) {
    "use strict";
    var socket_io_client_1, video_element, socket, send_sync;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (socket_io_client_1_1) {
                socket_io_client_1 = socket_io_client_1_1;
            }
        ],
        execute: function () {
            video_element = document.getElementById("video");
            socket = socket_io_client_1.io("http://localhost:3000");
            socket.on("room_data", function (data) {
                var _a, _b;
                var room = JSON.parse(data);
                var src = room.src, time = room.time;
                if (room.src != src)
                    video_element.setAttribute("src", (_a = room.src) !== null && _a !== void 0 ? _a : "");
                if (room.paused)
                    video_element.pause();
                else
                    video_element.play();
                if (room.time != time)
                    video_element.currentTime = (_b = room.time) !== null && _b !== void 0 ? _b : 0;
            });
            send_sync = function () {
                var _a;
                var new_room_data = {
                    src: (_a = video_element.getAttribute("src")) !== null && _a !== void 0 ? _a : "",
                    time: video_element.currentTime,
                    paused: video_element.paused
                };
                socket.emit("sync", JSON.stringify(new_room_data));
            };
            video_element.addEventListener("play", send_sync);
            video_element.addEventListener("pause", send_sync);
            video_element.addEventListener("seeked", send_sync);
        }
    };
});
