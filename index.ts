import { Server, Socket } from "socket.io"

// setup socket.io server on port 3000
const io = new Server(3000, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket: Socket) => {
    console.log("user connected")

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
})