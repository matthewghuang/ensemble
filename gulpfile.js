const gulp = require("gulp")
const ts = require("gulp-typescript")
const htmlmin = require("gulp-htmlmin")
const terser = require("gulp-terser")
const pug = require("gulp-pug")

const compiler_options = {
	target: "ES6",
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
		.pipe(ts(compiler_options))
		.pipe(gulp.dest("out"))

}

const compile_web = () => {
	return gulp.src([
			"src/web/*.ts",
			"src/common/*.ts"
		], { base: "src" })
		.pipe(ts({
			...compiler_options,
			module: "system",
			moduleResolution: "node"
		}))
		.pipe(terser())
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
