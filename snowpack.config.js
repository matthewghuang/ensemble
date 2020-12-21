module.exports = {
	installOptions: {
		polyfillNode: true
	},
	plugins: [
		"@snowpack/plugin-svelte"
	],
	mount: {
		"src/web": "/",
		"src/common": "/common"
	}
}
