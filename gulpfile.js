var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');

gulp.task('browserify', function () {
  browserify(['./src/app.js'])
    .transform('babelify', {presets: ["es2015"]})
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*'], ['browserify']);
});

gulp.task('default', ['watch', 'browserify']);