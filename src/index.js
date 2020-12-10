"use strict";
exports.__esModule = true;
var socket_io_1 = require("socket.io");
// setup socket.io server on port 3000
var io = new socket_io_1.Server(3000, {
    cors: {
        origin: "*"
    }
});
io.on("connection", function (socket) {
    console.log("user connected");
    socket.on("disconnect", function () {
        console.log("user disconnected");
    });
});
