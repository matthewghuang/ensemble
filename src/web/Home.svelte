<svelte:head>
	<title>ensemble | home</title>
</svelte:head>

<script>
	import page from "page"

	let name_value
	let room_id_value
	let error

	const redirect = () => {
		if (!name_value) {
			error = "error: must provide a name"
			return
		}

		if (!room_id_value) {
			error = "error: must provide a room"
			return
		}

		page(`/watch/${room_id_value}/${name_value}`)
	}
</script>

<div class="home">
	<div class="container">
		<h1>ensemble <small>watch videos, together</small></h1>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<form class="pure-form pure-form-stacked">
			<fieldset>
				<label for="name">Your Name</label>
				<input type="text" name="name" bind:value={name_value}>

				<label for="room_id">Room ID</label>
				<input type="text" name="room_id" bind:value={room_id_value}>
				<button class="pure-button" on:click|preventDefault={redirect}>Join or Create Room</button>
			</fieldset>
		</form>
	</div>
</div>

<style>
	.error {
		background-color: lightcoral;
		padding: 15px;
	}
</style>
