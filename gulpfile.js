const gulp = require("gulp")
const ts = require("gulp-typescript")
const htmlmin = require("gulp-htmlmin")
const terser = require("gulp-terser")
const pug = require("gulp-pug")
const exec = require("child_process").exec

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

const run_snowpack = (cb) => {
	return exec("yarn snowpack build")
}

const minify_js = () => {
	return gulp.src([ "build/**/*.js" ])
		.pipe(terser())
		.pipe(gulp.dest("build"))
}

const process_html = () => {
	return gulp.src("build/*.pug")
		.pipe(pug())
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest("build"))
}

gulp.task("snowpack", gulp.series(run_snowpack, minify_js, process_html))
gulp.task("server", gulp.series(compile_server))
