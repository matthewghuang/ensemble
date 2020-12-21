<script lang="ts">
	import page from "page"
	import Home from "./Home.svelte"
	import Watch from "./Watch.svelte";

	import "purecss/build/pure-min.css"
	import "purecss/build/grids-responsive-min.css"
	import "./style.css"

	let route = Watch;

	page("/", () => route = Home)
	page("/watch", () => route = Watch)
</script>

<body>
	<svelte:component this={route}></svelte:component>
</body>
