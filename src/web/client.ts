import { io } from "socket.io-client"
import Room from "../common/room"

const video_element: HTMLVideoElement =
	document.getElementById("video") as HTMLVideoElement

const socket = io("http://localhost:3000")

socket.on("room_data", (data: string) => {
	const room = JSON.parse(data) as Room

	const { src, time } = room

	if (room.src != src)
		video_element.setAttribute("src", room.src ?? "")

	if (room.paused)
		video_element.pause()
	else
		video_element.play()

	if (room.time != time)
		video_element.currentTime = room.time ?? 0
})

const send_sync = () => {
	const new_room_data: Room = {
		src: video_element.getAttribute("src") ?? "",
		time: video_element.currentTime,
		paused: video_element.paused
	}

	socket.emit("sync", JSON.stringify(new_room_data))
}

video_element.addEventListener("play", send_sync)
video_element.addEventListener("pause", send_sync)
video_element.addEventListener("seeked", send_sync)
