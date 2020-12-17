const gulp = require("gulp")
const ts = require("gulp-typescript")
const htmlmin = require("gulp-htmlmin")
const terser = require("gulp-terser")
const pug = require("gulp-pug")
const browserify = require("browserify")
const source = require("vinyl-source-stream")
const streamify = require("gulp-streamify")
const rename = require("gulp-rename")

const compiler_options = {
	target: "ES6",
	moduleResolution: "node",
	strict: true,
	esModuleInterop: true,
	skipLibCheck: true,
	downlevelIteration: true
}

const compile_server = () => {
	return gulp.src([
			"src/server/index.ts",
			"src/common/*.ts"
		], { base: "src" })
		.pipe(ts({
			...compiler_options,
			module: "commonjs"
		}))
		.pipe(gulp.dest("out"))

}

const compile_web = () => {
	gulp.src([
			"src/web/watch.ts",
			"src/common/*.ts"
		], { base: "src" })
		.pipe(ts({
			...compiler_options,
			target: "ES5",
			outDir: ".temp"
		}))
		.pipe(gulp.dest(".temp"))

	const b = browserify(".temp/web/watch.js").bundle()

	return b.pipe(source("bundle.js"))
		.pipe(streamify(terser()))
		.pipe(gulp.dest("web"))
}

const build_html = () => {
	return gulp.src("src/web/*.pug")
		.pipe(pug())
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest("web"))
}

gulp.task("web", gulp.series(compile_web, build_html))
gulp.task("web-dev", () => {
	gulp.watch("src/web/*.pug", build_html)
	gulp.watch("src/web/*.ts", compile_web)
})

gulp.task("server", gulp.series(compile_server))
