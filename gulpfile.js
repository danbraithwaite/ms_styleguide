'use strict';

var fs = require('fs');

var gulp = require('gulp');
var mocha = require('gulp-mocha-phantomjs');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var inject = require('gulp-inject');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var opn = require('opn');
var map = require('map-stream');

var connect = require('gulp-connect');

var watchify = require('watchify');
var browserify = require('browserify');
var gBrowserify = require('gulp-browserify');
var source = require('vinyl-source-stream');

var stylus = require('gulp-stylus');
var minify = require('gulp-minify-css');
var header = require('gulp-header');
var concat = require('gulp-concat');

var prompt = require('gulp-prompt');
var semver = require('semver');
var pkg = require('./package.json');

var stylusTasks = require('./gulptasks/stylus.js');
var protractor = require('gulp-protractor').protractor;
var webdriver_standalone = require("gulp-protractor").webdriver_standalone;


gulp.task('lint', function() {
	return gulp
		.src('./application/**/*.js')
		.pipe(jshint({ lookup: true }))
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'))
		.pipe(errorReporter());
});


gulp.task('connect', function(){
	var opts = {
		root: ['dist','application'],
		port: 8899,
		host: '0.0.0.0',
		livereload: true
	};
	connect.server(opts);
	opn('http://' + opts.host + ':' + opts.port + '/#/');
});

gulp.task('watchify', function(){
	watchify.args.debug = true;
		
	var bundler = watchify(browserify('./application/modules/app/magApp/magApp.js', watchify.args));

	// Optionally, you can apply transforms
	// and other configuration options on the
	// bundler just as you would with browserify
	//bundler.transform('brfs');

	//liveReload.listen();

	bundler.on('update', rebundle);

	function rebundle() {
		gutil.log('bundle updating...');
		stylusTasks.stylusIndex();
		buildStyles().pipe(gulp.dest('./dist'));
		return bundler.bundle()
		// log errors if they happen
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());
	}

	return rebundle();
});


function buildStyles () {
	return gulp.src('./src/styles/index.styl')
	.pipe(stylus({
	  include: './src/stylus',
	  sourcemap: {
		inline: true,
		sourceRoot: '.',
		basePath: './src'
	  }
	}))
	.pipe(concat('bundle.css'));
}


gulp.task('dev', ['connect', 'watchify']);
gulp.task('start', ['connect', 'watchify'], function(){
	require('./api/index.js');
})
gulp.task('styles', ['stylus-index'], buildStyles);

gulp.task('clean-build', function(){
	gulp.src('./build/**/*.*', {read: false})
	.pipe(clean());
});


gulp.task('version', function(){
	var pkg = require('./package.json');
	return gulp.src('./package.json')
	.pipe(prompt.prompt({
		type: 'list',
		name: 'semver',
		message: 'Select build change... \n current version : ' + pkg.version,
		choices: [
			getChoice('major'),
			getChoice('minor'),
			getChoice('patch'),
			
			{
				name: 'none  - ' + pkg.version,
				value: pkg.version
			}
		]
	}, function(res){
		console.log(res);
		if (res.semver !== pkg.version) {
			pkg.version = res.semver;
			fs.writeFile('./package.json', JSON.stringify(pkg, null, '  '));
		}
	}));

	function getChoice(verType){
		return {
			name: verType + ' - ' + semver.inc(pkg.version, verType),
			value: semver.inc(pkg.version, verType)
		};
	}
});

gulp.task('build', ['version','clean-build'], function(){
	
	var environment = process.env.ENV || 'production';

	var mag = {
		env: environment,
		version: pkg.version
	};

	buildStyles().pipe(gulp.dest('./build'));
	
	gulp
		.src('./application/assets/**/*')
		.pipe(gulp.dest('./build/assets'));
	
	gulp
		.src('./application/modules/app/magApp/magApp.js', {read: false})
		.pipe(gBrowserify())
		.pipe(concat('bundle.js'))
		.pipe(header('window.$mag = ' + JSON.stringify(mag) + '; \n'))
		.pipe(gulp.dest('./build'));
	
	gulp
		.src('./dist/index.html')
		.pipe(gulp.dest('./build'));

});