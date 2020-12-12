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
let members: Array<[string, string]> = []
let your_name: string | undefined

const is_host = (your_name: string, members: Array<[string,string]>): boolean => {
	return members[0][1] == your_name
}

const update_member_list = (members: Array<[string, string]>) => {
	members_ul.innerHTML = ""

	members.forEach(member => {
		const [, name] = member
		const message_li = document.createElement("li")
		message_li.innerHTML = name
		members_ul.append(message_li)
	})
}

const join_room = () => {
	const name = name_input.value
	const room_name = room_name_input.value

	socket.emit(Events.JOIN_ROOM, name, room_name)

	your_name = name

	state = flag.set_flag(state, ClientFlags.IN_ROOM)
}

const update_server = (update: Update) => {
	if (is_host(your_name ?? "", members))
		socket.emit(Events.UPDATE_SERVER, update)
}

socket.on(Events.UPDATE_MEMBERS, (updated_members: Array<[string, string]>) => {
	const am_i_host = is_host(your_name ?? "", updated_members)

	if (am_i_host) {
		state = flag.set_flag(state, ClientFlags.HOST)
	} else
		state = flag.unset_flag(state, ClientFlags.HOST)

	src_input.style.display = am_i_host ? "block" : "none"
	set_src_button.style.display = am_i_host ? "block" : "none"

	members = updated_members

	update_member_list(updated_members)
})

socket.on(Events.UPDATE_CLIENT, (update: Update) => {
	const { src, time, paused } = update

	if (src != undefined && src != video_element.src)
		video_element.src = src

	if (time != undefined && Math.abs(time - video_element.currentTime) > 1)
		video_element.currentTime = time

	if (paused != undefined && paused != video_element.paused)
		paused ? video_element.pause() : video_element.play()
})

setInterval(() => {
	if (flag.has_flag(state, ClientFlags.HOST)) {
		update_server({
			src: video_element.src,
			time: video_element.currentTime,
			paused: video_element.paused
		})
	}
}, 1000)

join_room_button.onclick = join_room

set_src_button.onclick = () => {
	video_element.src = src_input.value
	update_server({ src: video_element.src })
}

video_element.onseeked = () => update_server({ time: video_element.currentTime })
video_element.onplay = () => update_server({ paused: false })
video_element.onpause = () => update_server({ paused: true })
