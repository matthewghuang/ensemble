module.exports = {
	installOptions: {
		polyfillNode: true
	},
	plugins: [
		"@snowpack/plugin-svelte"
	],
	experiments: {
		routes: [
			{ src: ".*", dest: "/index.html", match: "routes" }
		]
	},
	mount: {
		"src/web": "/",
		"src/common": "/common"
	}
}
