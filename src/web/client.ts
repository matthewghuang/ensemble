import { io } from "socket.io-client"
import Update from "../common/update"
import Events from "../common/events"
import * as flag from "../common/flag"
import { Client } from "socket.io/dist/client"

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

enum ClientFlags {
	NONE = 0,
	IN_ROOM = 1 << 0,
	HOST = 1 << 1
}

let state: number = ClientFlags.NONE
let members: string[] = []
let your_name: string | undefined

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

	your_name = name

	members.push(name)
	update_member_list()

	state = flag.set_flag(state, ClientFlags.IN_ROOM)

	if (members[0] == your_name)
		state = flag.set_flag(state, ClientFlags.HOST)
}

const update_server = (src?: string, time?: number, paused?: boolean) => {
	const update: Update = {}

	if (src)
		update.src = src

	if (time)
		update.time = time

	if (paused)
		update.paused = paused

	socket.emit(Events.UPDATE_SERVER, update)
}

socket.on(Events.UPDATE_MEMBERS, (updated_members: string[]) => {
	members = updated_members	

	if (members[0] == your_name)
		state = flag.set_flag(state, ClientFlags.HOST)
	else
		state = flag.unset_flag(state, ClientFlags.HOST)

	update_member_list()
})

socket.on(Events.UPDATE_CLIENT, (update: Update) => {
	const { src, time, paused } = update

	if (src != undefined)
		video_element.src = src

	if (time != undefined)
		video_element.currentTime = time

	if (paused != undefined)
		paused ? video_element.pause() : video_element.play()
})

setInterval(() => {
	if (flag.has_flag(state, ClientFlags.HOST))
		update_server(video_element.src, video_element.currentTime, video_element.paused)
}, 1000)

join_room_button.onclick = join_room
