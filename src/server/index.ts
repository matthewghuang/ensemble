import { Server, Socket } from "socket.io"
import Events from "../common/events"
import Update from "../common/update"
import express from "express"
import http from "http"
import path from "path"

const port: number = Number(process.env.PORT) || 3000

const app = express()
const http_server = http.createServer(app)

app.use(express.static(path.join(__dirname, "../../build")))

app.get("/", (req, res) => {
	res.sendFile("index.html", { root: path.join(__dirname, "../../build") })
})

const io = new Server(http_server, {
	cors: {
		origin: "*"
	}
})

const updates: Record<string, Update> = {}
const members: Record<string, Array<[string, string]>> = {}

io.on("connection", (socket: Socket) => {
	socket.on(Events.JOIN_ROOM, (name: string, room_name: string) => {
		socket.join(room_name)

		if (!members[room_name])
			members[room_name] = []

		members[room_name].push([socket.id, name])

		io.in(room_name).emit(Events.UPDATE_MEMBERS, members[room_name])

		if (updates[room_name]) {
			socket.emit(Events.UPDATE_CLIENT, updates[room_name])
		}
	})

	socket.on(Events.UPDATE_SERVER, (update: Update) => {
		for (const room of socket.rooms) {
			if (room == socket.id)
				continue

			if (members[room][0][0] == socket.id) {
				updates[room] = update
				socket.in(room).emit(Events.UPDATE_CLIENT, update)
			}
		}
	})

	socket.on(Events.DISCONNECTING, () => {
		for (const room of socket.rooms) {
			if (room == socket.id)
				continue

			members[room].splice(members[room]
				.findIndex(([id]) => id == socket.id), 1)
		
			socket.in(room).emit(Events.UPDATE_MEMBERS, members[room])
		}
	})
})

http_server.listen(port, () => {
	console.log(`server listening on port ${port}`)
})
