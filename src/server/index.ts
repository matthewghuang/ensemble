import { Server, Socket } from "socket.io"
import Room from "../common/room"

const io = new Server(3000, {
	cors: {
		origin: "*"
	}
})

let mock_room: Room = {
	src: "http://techslides.com/demos/sample-videos/small.mp4",
	time: 0,
	paused: false
}

io.on("connection", (socket: Socket) => {
	socket.emit("room_data", JSON.stringify(mock_room))

	socket.on("sync", (data: string) => {
		mock_room = { ...mock_room, ...JSON.parse(data) }
		io.emit("room_data", JSON.stringify(mock_room))
	})
})
