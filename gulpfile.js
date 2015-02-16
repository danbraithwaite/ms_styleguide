'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var jeet = require('jeet');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer-stylus');
var axis = require('axis'); // library for Stylus
var rupture = require('rupture'); // Break points
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var fileInclude = require('gulp-file-include');
var sprite = require('css-sprite').stream;

/*
-----------------------------------------------------------------------------------------------------
HTML
Using gulp-file-iclude so we can fragment the HTML files
https://www.npmjs.com/package/gulp-file-include
-----------------------------------------------------------------------------------------------------
*/

gulp.task('html', function(){
	gulp.src('./src/html/**/*.html')
	.pipe(watch('./src/html/**/*.html'))
	.pipe(plumber())
	.pipe(fileInclude({
		prefix: '@@',
		basePath: '@file'
	}))
	.pipe(gulp.dest('./build'))
	.pipe(reload({stream:true}));
});

/*
-----------------------------------------------------------------------------------------------------
Fast browserify builds with watchify
https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
-----------------------------------------------------------------------------------------------------
*/

var b = browserify('./src/js/index.js', watchify.args);
var bundler = watchify(b);

gulp.task('js', bundle);
bundler.on('update', bundle);

function bundle(){
	return bundler.bundle()
	.on('error', gutil.log.bind(gutil, 'Browserify Error'))
	.pipe(source('bundle.js'))
	.pipe(watch('./src/js/**/*'))
	.pipe(plumber())
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./build'))
	.pipe(reload({stream:true}));
}

/* 
-----------------------------------------------------------------------------------------------------
Stylus
-----------------------------------------------------------------------------------------------------
*/

var browsers = { browsers: ['last 2 version'] };

gulp.task('styles', function(){

	gulp.src('./src/styles/index.styl')
	.pipe(watch('./src/styles/**/*.styl'))
	.pipe(plumber())
	.pipe(stylus({
		use: [
				autoprefixer(browsers),
				axis(),
				rupture(),
				jeet()
			]
	}))
	.pipe(rename('bundle.css'))
	.pipe(gulp.dest('./build'))
	.pipe(reload({stream:true}));
});

/* 
-----------------------------------------------------------------------------------------------------
Fonts
-----------------------------------------------------------------------------------------------------
*/

gulp.task('fonts', function(){
	gulp.src('./src/fonts/**/*')
	.pipe(watch('./src/fonts/**/*'))
	.pipe(plumber())
	.pipe(gulp.dest('./build/fonts'))
	.pipe(reload({stream:true}));
});

/*
-----------------------------------------------------------------------------------------------------
Images
-----------------------------------------------------------------------------------------------------
*/
gulp.task('images', function () {
	gulp.src('src/images/**/*')
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('./build/images'))
	.pipe(reload({stream:true}));
});

/*
-----------------------------------------------------------------------------------------------------
Icons
-----------------------------------------------------------------------------------------------------
*/

gulp.task('icons', function () {
	return gulp.src('./src/icons/*.png')
		.pipe(watch('./src/icons/*.png'))
		.pipe(plumber())
		.pipe(sprite({
			base64: true,
			style: 'icons.styl',
			processor: 'stylus',
			retina: true,
			margin: 10
	}))
	.pipe(gulp.dest('./src/styles'))
	.pipe(reload({stream:true}));
});


/*
-----------------------------------------------------------------------------------------------------
broswser-sync
-----------------------------------------------------------------------------------------------------
*/

gulp.task('browser-sync', function() {
    browserSync({
        proxy: 'ms-styleguide.dev'
    });
});

/*
-----------------------------------------------------------------------------------------------------
default - your general purpose dev task. Run once, sit back, and relax!
-----------------------------------------------------------------------------------------------------
*/

gulp.task('default', ['browser-sync', 'js', 'html', 'icons', 'styles', 'images', 'fonts']);
