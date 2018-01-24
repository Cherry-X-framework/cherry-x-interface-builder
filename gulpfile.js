'use strict';

let gulp         = require( 'gulp' ),
	rename       = require( 'gulp-rename' ),
	notify       = require( 'gulp-notify' ),
	autoprefixer = require( 'gulp-autoprefixer' ),
	sass         = require( 'gulp-sass' ),
	minify       = require( 'gulp-minify' ),
	uglify       = require( 'gulp-uglify' );

// scss
gulp.task( 'scss', () => {
	return gulp.src( './assets/scss/cx-interface-builder.scss' )
		.pipe( sass( { outputStyle: 'compressed' } ))
		.pipe( autoprefixer( {
				browsers: ['last 10 versions'],
				cascade: false
		} ) )
		.pipe( rename('cx-interface-builder.css'))
		.pipe( gulp.dest('./assets/css/'))
		.pipe( notify('Compile Sass Done!'));
});

// js
gulp.task( 'js-minify', () => {
	return gulp.src( './assets/js/cx-interface-builder.js' )
		.pipe( uglify() )
		.pipe( rename({ extname: '.min.js' }) )
		.pipe( gulp.dest( './assets/js/') )
		.pipe( notify('js Minify Done!') );
});

//watch
gulp.task( 'watch', () => {
	gulp.watch( './assets/scss/**', ['scss'] );
	gulp.watch( './assets/js/*.js', ['js-minify'] );
} );
