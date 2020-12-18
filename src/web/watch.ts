import { io } from "socket.io-client"
import Update from "../common/update"
import Events from "../common/events"
import SourceType from "../common/source-type"
import * as flag from "../common/flag"
import Plyr from "plyr"
import "purecss/build/pure-min.css"
import "plyr/dist/plyr.css"
import "./style.css"

const src_input = document.getElementById("src") as HTMLInputElement
const change_media_button = document.getElementById("change_media") as HTMLButtonElement
const members_ul = document.getElementById("members") as HTMLUListElement

const socket = io("http://localhost:3000")

enum ClientFlags {
	NONE = 0,
	IN_ROOM = 1 << 0,
	HOST = 1 << 1
}

let state: number = ClientFlags.NONE
let members: Array<[string, string]> = []
let your_name: string | undefined

let player: Plyr = new Plyr("#video")

const is_host = (your_name: string, members: Array<[string, string]>): boolean => {
	return members[0][1] == your_name
}

const get_source_type = (src: string): SourceType => {
	const has = (str: string, find: string): boolean => {
		return str.indexOf(find) != -1
	}

	if (has(src, "youtu"))
		return SourceType.YOUTUBE
	else if (has(src, "vimeo"))
		return SourceType.VIMEO
	else
		return SourceType.HTML5
}

const update_member_list = (members: Array<[string, string]>) => {
	members_ul.innerHTML = ""

	members.forEach((member, idx) => {
		const [, name] = member
		const message_li = document.createElement("li")
		if (idx == 0)
			message_li.innerHTML = name + " (host)"
		else
			message_li.innerHTML = name
		members_ul.append(message_li)
	})
}

const join_room = () => {
	const search_params = new URLSearchParams(window.location.search)

	const name = search_params.get("name") ?? ""
	const room_id = search_params.get("room_id")

	socket.emit(Events.JOIN_ROOM, name, room_id)

	your_name = name

	state = flag.set_flag(state, ClientFlags.IN_ROOM)
}

const update_server = (update: Update) => {
	if (is_host(your_name ?? "", members))
		socket.emit(Events.UPDATE_SERVER, update)
}

const set_src = (src, src_type, player) => {
	if (src_type == SourceType.HTML5) {
		player.source = {
			type: "video",
			sources: [
				{
					src: src,
					type: "video/mp4"
				}
			]
		}
	} else if (src_type == SourceType.YOUTUBE || src_type == SourceType.VIMEO) {
		player.source = {
			type: "video",
			sources: [
				{
					src: src,
					provider: src_type
				}
			]
		}
	}
}

socket.on(Events.UPDATE_MEMBERS, (updated_members: Array<[string, string]>) => {
	const am_i_host = is_host(your_name ?? "", updated_members)

	if (am_i_host) {
		state = flag.set_flag(state, ClientFlags.HOST)
	} else
		state = flag.unset_flag(state, ClientFlags.HOST)

	members = updated_members

	update_member_list(updated_members)

	if (am_i_host)
		document.getElementById("media-form").removeAttribute("hidden")
	else
		document.getElementById("media-form").setAttribute("hidden", "")
})

socket.on(Events.UPDATE_CLIENT, (update: Update) => {
	const { src, src_type, time, paused } = update

	if (src != undefined && src != (player.source as any))
		set_src(src, src_type, player)

	if (time != undefined && Math.abs(time - player.currentTime) > 1)
		player.currentTime = time

	if (paused != undefined)
		player.togglePlay(!paused)
})

setInterval(() => {
	if (flag.has_flag(state, ClientFlags.HOST)) {
		update_server({
			src: player.source as any,
			src_type: get_source_type(player.source as any),
			time: player.currentTime,
			paused: player.paused
		})
	}
}, 1000)

setTimeout(() => {
	join_room()
}, 1000)

change_media_button.onclick = () => {
	set_src((document.getElementById("src") as HTMLInputElement).value, get_source_type(src_input.value), player)
	update_server({ src: player.source as any, src_type: get_source_type(src_input.value) })
	return false
}

player.on("seeked", () => update_server({ time: player.currentTime }))
player.on("play", () => update_server({ paused: false }))
player.on("pause", () => update_server({ paused: true }))
