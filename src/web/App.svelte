<script lang="ts">
	import page from "page"
	import Home from "./Home.svelte"
	import Watch from "./Watch.svelte";

	import "purecss/build/pure-min.css"
	import "purecss/build/grids-responsive-min.css"
	import "./style.css"

	let route
	let context

	page("/", ctx => create_route(ctx, Home))
	page("/watch/:room_id", ctx => create_route(ctx, Watch))
	page("/watch/:room_id/:name", ctx => create_route(ctx, Watch))

	page()

	const create_route = (ctx, component) => {
		route = component
		context = ctx
	}
</script>

<body>
	<svelte:component this={route} context={context}></svelte:component>
</body>
