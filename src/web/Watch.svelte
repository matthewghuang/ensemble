<svelte:head>
	<title>ensemble | watch</title>
</svelte:head>

<script lang="ts">
	import { onMount } from "svelte"
	import { io } from "socket.io-client"
	import Events from "../common/events"
	import videojs from "video.js"
	import "videojs-youtube/dist/Youtube.min.js"
	import "video.js/dist/video-js.min.css"

	const socket = io("https://ensemble-rla.herokuapp.com")

	let player
	let your_name: string
	let members: Array<[string, string]> = []
	let src_value

	$: is_host = members[0] ? members[0][1] == your_name : false

	onMount(async () => {
		player = videojs("video")

		player.on("seeked", () => update_server({ time: player.currentTime() }))
		player.on("play", () => update_server({ paused: false }))
		player.on("pause", () => update_server({ paused: true }))
	})

	socket.on(Events.CONNECT, () => {
		const search_params = new URLSearchParams(window.location.search)

		const name = search_params.get("name") ?? ""
		const room_id = search_params.get("room_id") ?? ""

		socket.emit(Events.JOIN_ROOM, name, room_id)

		your_name = name

		setInterval(() => {
			if (is_host && player) {
				const update = {
					src: player.src(),
					time: player.currentTime,
					paused: player.paused()
				}

				update_server(update)
			}
		}, 1000)
	})

	socket.on(Events.UPDATE_CLIENT, (update) => {
		const { src, time, paused } = update

		if (src != undefined && src != (player.src() as any))
			set_src(src)
		
		if (time != undefined && Math.abs(time - player.currentTime()) > 1)
			player.currentTime(time); console.log("setting time", time, player.currentTime())
		
		if (paused != undefined)
			paused ? player.pause() : player.play()
	})

	socket.on(Events.UPDATE_MEMBERS, u => members = u)

	const set_src = (src: string) => {
		player.src({ src: src, type: "video/mp4" })
	}

	const update_server = (update) => {
		socket.emit(Events.UPDATE_SERVER, update)
	}

	const change_media = () => {
		set_src(src_value)
	}
</script>

<div class="watch">
	<div class="container">
		<h1><a href="/">ensemble</a></h1>

		<video id="video" class="video-js" controls></video>

		<div class="pure-g">
			<div class="pure-u-1 pure-u-md-1-2">
				<h2>members</h2>
				<ul>
					{#each members as [_, name], i }
						{#if i == 0}
							<li>{name} (host)</li>	
						{:else}
							<li>{name}</li>	
						{/if}
					{/each}
				</ul>
			</div>
			{#if is_host}
				<div class="pure-u-1 pure-u-md-1-2">
					<form class="pure-form pure-form-stacked">
						<fieldset>
							<h2>change media</h2>
							<label for="src">Source</label>
							<input type="text" name="src" bind:value={src_value}>
							<button on:click|preventDefault={change_media}>Change Media</button>
						</fieldset>
					</form>
				</div>
			{/if}
		</div>
	</div>
</div>
