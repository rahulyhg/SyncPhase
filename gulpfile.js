var gulp = require('gulp');
var compass = require('compass');

var watch = require('gulp-watch');

gulp.task('styles', function () {
	compass.compile();
});

gulp.task('scripts', function () {
	gulp.src('./resources/assets/scripts/**/*.js')
	.pipe(gulp.dest('./public/scripts/'));

	gulp.src('./server/types.js')
	.pipe(gulp.dest('./public/scripts/'));
});

gulp.task('watch', function () {
	gulp.start('styles');
	gulp.start('scripts');

	watch(['./resources/assets/scripts/**/*.js', './server/types.js'], function () {
		gulp.start('scripts');
	});

	watch('./resources/assets/styles/**/*.scss', function () {
		gulp.start('styles');
	});
});