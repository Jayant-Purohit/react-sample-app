"use strict";
var gulp  = require('gulp');
var connect = require('gulp-connect'); //// runs a local server
var open = require('gulp-open'); // Open url in browser
var browserify = require('browserify'); // bundle js 
var reactify = require('reactify');// transform react jsx to js
var source = require('vinyl-source-stream'); // use convestional text streams with gulp
var concat = require('gulp-concat'); // concat files
var lint = require('gulp-eslint')

var config = {
	port: 8005,// random port
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html', // globs to match html file
		js: './src/**/*.js', // globs to match html file
		css:[
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
		], 
		dist: './dist',
		mainJs: './src/main.js',
	}
}
/// task 1 : start local dev server
gulp.task('connect' , function(){
	connect.server({
		// configure server
		root:['dist'], 
		port: config.port,
		base: config.devBaseUrl,
		livereload: true //anytime file change file reload
	});
});
// task 2 open the dependency : task connect
gulp.task('open',['connect'], function(){
	gulp.src('dist/index.html')
		.pipe(open({uri : config.devBaseUrl + ':'+ config.port+ '/' }))
});
/// html
gulp.task('html', function(){
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});
//// js task
gulp.task('js', function(){
	browserify(config.paths.mainJs) //using browserify
		.transform(reactify) //browserify's transform
		.bundle() // put it on one file
		.on('error' , console.error.bind(console)) // to handle error msg
		.pipe(source('bundle.js')) // what the bundle will name
		.pipe(gulp.dest(config.paths.dist + '/scripts')) // destination fo bundle
		.pipe(connect.reload());


});
// css task
gulp.task('css', function(){
	gulp.src(config.paths.css) 
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'))
		.pipe(connect.reload());
});


// watch 
gulp.task('watch', function(){
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js','lint']);
});

gulp.task('lint', function(){
	return gulp.src(config.paths.js)
				.pipe(lint({config: 'eslint.config.json'}))
				.pipe(lint.format());
	
});
// default task  
gulp.task('default' , ['html','js','css','lint','open','watch'])