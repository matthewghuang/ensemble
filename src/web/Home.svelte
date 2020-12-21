<svelte:head>
	<title>ensemble | home</title>
</svelte:head>

<div class="home">
	<div class="container">
		<h1>ensemble <small>watch videos, together</small></h1>

		<form action="/watch" class="pure-form pure-form-stacked">
			<fieldset>
				<label for="name">Your Name</label>
				<input type="text" name="name">

				<label for="room_id">Room ID</label>
				<input type="text" name="room_id">
				<input type="submit" value="Join or Create Room">
			</fieldset>
		</form>
	</div>
</div>
