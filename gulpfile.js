var gulp = require('gulp');

//CSS
var gulp_concat_CSS		= require("gulp-concat-css");
var gulp_mifify_CSS		= require("gulp-minify-css");
var gulp_autoprefixer	= require("gulp-autoprefixer"); 

//JAVASCRIPT
var gulp_concat			= require('gulp-concat');
var gulp_babel			= require("gulp-babel");
var gulp_uglify			= require('gulp-uglify');

//HTML
var gulp_useref			= require("gulp-useref");

//OTHER
var gulp_rename			= require("gulp-rename");
var gulp_notify			= require("gulp-notify");
var gulp_livereload		= require("gulp-livereload");
var gulp_clean			= require("gulp-clean");


/**********************************************************
 * BUILD
 *********************************************************/

gulp.task("build", ['build_JS', 'build_CSS', 'build_HTML', 'build_IMG', 'build_SERVER'])

//BUILD CSS
gulp.task('build_CSS', function() {
	gulp.src('./html/css/*.css')
		.pipe(gulp_concat_CSS('game.css'))
		.pipe(gulp_autoprefixer('last 2 versions', '> 1%', 'ie 9'))
		.pipe(gulp_mifify_CSS())
		.pipe(gulp_rename("game.min.css"))
		.pipe(gulp.dest("./build/html/css/"))
		.pipe(gulp_notify("CSS was concated and minified!"));
});

//BUILD JS
gulp.task('build_JS', function() {
	gulp.src('./html/js/*.js')
		.pipe(gulp_concat("game.js"))
		.pipe(gulp_babel({
			presets: ['es2015'],
			minified: true,
			comments: false
		}))
		.pipe(gulp_rename("game.min.js"))
		.pipe(gulp.dest("./build/html/js/"))
		.pipe(gulp_notify("JS files was concated and minified!"));
});

//BUILD HTML
gulp.task('build_HTML', function() {
	gulp.src('./html/*.html')
		.pipe(gulp_useref({
			noAssets: true
		}))
		.pipe(gulp.dest("./build/html/"))
		.pipe(gulp_notify("HTML files was copied!"));
});

//BUILD IMGS
gulp.task('build_IMG', function() {
	gulp.src('./html/img/*.*')
		.pipe(gulp.dest("./build/html/img/"))
		.pipe(gulp_notify("Image was copied!"));
});

//CLEAN
gulp.task('clean', function () {
    return gulp.src('./build/', {force: true})
        .pipe(gulp_clean());
});

//BUILD SERVER
gulp.task("build_SERVER", function(){
	gulp.src(["./server.js","./package.json"])
		.pipe(gulp.dest("build/"));

	gulp.src('./modules/*.*')
		.pipe(gulp.dest("./build/modules/"));
});

/**********************************************************
 * LIVERELOAD
 *********************************************************/
gulp.task('livereload', function(){
	gulp_livereload();
});

//WATCHER
gulp.task('watch', function(){
	gulp_livereload.listen();
	gulp.watch('html/css/**/*.*', ['livereload']);
});

gulp.task('default', ['watch'])