import { io } from "socket.io-client"
import Events from "../common/events"

const video_element = document.getElementById("video") as HTMLVideoElement

const name_input = document.getElementById("name_input") as HTMLInputElement

const room_name_input =
	document.getElementById("room_name_input") as HTMLInputElement
const join_room_button =
	document.getElementById("join_room_button") as HTMLButtonElement

const src_input = document.getElementById("src_input") as HTMLInputElement
const set_src_button =
	document.getElementById("set_src_button") as HTMLButtonElement

const members_ul = document.getElementById("members_ul") as HTMLUListElement

const socket = io("http://localhost:3000")

let members: string[] = []

const update_member_list = () => {
	members_ul.innerHTML = ""

	members.forEach(member => {
		const message_li = document.createElement("li")
		message_li.innerHTML = member
		members_ul.append(message_li)
	})
}

const join_room = () => {
	const name = name_input.value
	const room_name = room_name_input.value

	socket.emit(Events.JOIN_ROOM, name, room_name)

	members.push(name)
	update_member_list()
}

socket.on(Events.UPDATE_MEMBERS, (updated_members: string[]) => {
	members = updated_members
	update_member_list()
})

join_room_button.onclick = join_room
