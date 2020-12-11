import "jasmine"

import { io, Socket } from "socket.io-client"
import Events from "../common/events"
import { hri } from "human-readable-ids"

describe("room", () => {
	const socket = io("http://localhost:3000")
	
	it("should allow a user to join", (done) => {
		const random_name = hri.random()
		const random_room = hri.random()
		socket.emit(Events.JOIN_ROOM, random_name, random_room) 

		socket.on(Events.UPDATE_MEMBERS, (members: string[]) => {
			expect(members[0]).toBe(random_name)
			done()
		})
	})

	it("should allow multiple users to join", (done) => {
		const random_name1 = hri.random()
		const random_name2 = hri.random()
		let count = 0
		const random_room = hri.random()

		socket.emit(Events.JOIN_ROOM, random_name1, random_room)
		socket.emit(Events.JOIN_ROOM, random_name2, random_room)

		socket.on(Events.UPDATE_MEMBERS, (members: string[]) => {
			count++

			if (count == 2) {
				expect(members[0]).toBe(random_name1)
				expect(members[1]).toBe(random_name2)
				done()
			}
		})
	})
})
