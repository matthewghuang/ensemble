import { Server, Socket } from "socket.io"
import Events from "../common/events"
import Update from "../common/update"

const io = new Server(3000, {
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

		if (updates[room_name])
			socket.emit(Events.UPDATE_CLIENT, updates[room_name])
	})

	socket.on(Events.UPDATE_SERVER, (update: Update) => {
		for (const room of socket.rooms) {
			if (room == socket.id)
				continue

			const cur_update = updates[room]

			let should_update_clients: boolean = false

			if (cur_update) {
				should_update_clients = (update.src != undefined && cur_update.src != update.src) ||
					(update.paused != undefined && cur_update.paused != update.paused) ||
					((update.time != undefined && cur_update.time != undefined) && Math.abs(cur_update.time - update.time) > 1)
			} else
				should_update_clients = true

			updates[room] = update

			if (should_update_clients)
				socket.in(room).emit(Events.UPDATE_CLIENT, update)
		}
	})

	socket.on(Events.DISCONNECTING, () => {
		for (const room of socket.rooms) {
			if (room == socket.id)
				continue

			members[room].splice(members[room].findIndex(v => v[0] == socket.id), 1)
		
			socket.in(room).emit(Events.UPDATE_MEMBERS, members[room])
		}
	})
})
