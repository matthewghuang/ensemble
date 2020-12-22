<script lang="ts">
	import page from "page"
	import Home from "./Home.svelte"
	import Watch from "./Watch.svelte";

	import "purecss/build/pure-min.css"
	import "purecss/build/grids-responsive-min.css"

	let route
	let context

	const create_route = (ctx, component) => {
		route = component
		context = ctx
	}

	page("/", ctx => create_route(ctx, Home))
	page("/watch/:room_id/:name", ctx => create_route(ctx, Watch))

	page()
</script>

<body>
	<svelte:component this={route} context={context}></svelte:component>
</body>

<style>
	:global(.container) {
		padding-left: 15px;
		padding-right: 15px;
		margin-left: auto;
		margin-right: auto;
	}

	@media (min-width: 768px) {
		:global(.container) {
			width: 750px;
		}
	}

	@media (min-width: 992px) {
		:global(.container) {
			width: 970px;
		}
	}

	@media (min-width: 1200px) {
		:global(.container) {
			width: 1170px;
		}
	}
</style>
