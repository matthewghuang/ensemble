import { Server, Socket } from "socket.io"
import Events from "../common/events"
import Update from "../common/update"

const io = new Server(3000, {
	cors: {
		origin: "*"
	}
})

const members: Record<string, string[]> = {}

io.on("connection", (socket: Socket) => {
	socket.on(Events.JOIN_ROOM, (name: string, room_name: string) => {
		socket.join(room_name)

		if (!members[room_name])
			members[room_name] = []

		members[room_name].push(name)

		io.in(room_name).emit(Events.UPDATE_MEMBERS, members[room_name])
	})

	socket.on(Events.UPDATE_SERVER, (update: Update) => {
		for (const room of socket.rooms) {
			if (room == socket.id)
				continue

			socket.in(room).emit(Events.UPDATE_CLIENT, room)
		}
	})

	socket.on(Events.DISCONNECTING, () => {
		for (const room of socket.rooms) {
			if (room == socket.id)
				continue
		
			members[room].splice(members[room].findIndex(r => r == room), 1)
		
			socket.in(room).emit(Events.UPDATE_MEMBERS, members[room])
		}
	})
})
