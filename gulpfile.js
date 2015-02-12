'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
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

//var dist = false;

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
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./src'))
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
	.pipe(stylus({
		use: [
				autoprefixer(browsers),
				axis(),
				rupture(),
				jeet()
			]
	}))
	.pipe(rename('bundle.css'))
	.pipe(gulp.dest('./src'))
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
serve - your general purpose dev task
-----------------------------------------------------------------------------------------------------
*/

gulp.task('serve', ['browser-sync', 'js'], function () {
  gulp.watch(['./src/*.html'], reload);
  gulp.watch(['./src/styles/**/*.styl'], ['styles']);
  gulp.watch(['./src/images/**/*']);
});
