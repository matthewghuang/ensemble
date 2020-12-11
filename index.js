"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
// setup socket.io server on port 3000
const io = new socket_io_1.Server(3000, {
    cors: {
        origin: "*"
    }
});
let mock_room = {
    name: "test",
    video: "http://techslides.com/demos/sample-videos/small.mp4",
    time: 0,
    playing: false
};
io.on("connection", (socket) => {
    console.log("user connected");
    socket.emit("room_data", JSON.stringify(mock_room));
    socket.on("sync", (data) => {
        mock_room = Object.assign(Object.assign({}, mock_room), JSON.parse(data));
        io.emit("room_data", JSON.stringify(mock_room));
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
