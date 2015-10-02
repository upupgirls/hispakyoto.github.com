var gulp = require('gulp');
var less = require('gulp-less')
var prettify = require('gulp-prettify');
var rename = require('gulp-rename');
var minify = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var ejs = require('gulp-ejs');
var sass = require("gulp-ruby-sass");
var plumber = require("gulp-plumber");
var imagemin = require("gulp-imagemin");
var autoprefixer = require("gulp-autoprefixer")
var browserSync = require('browser-sync');

// BrowserSync & Server
gulp.task("bs",function(){
  browserSync({
    server: {
      baseDir:'./dist/'
    }
  });
});

/**
 * Build
 */
gulp.task('build:html', function(){
  return gulp.src(["src/**/*.ejs",'!' + "src/**/_*.ejs"])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('build:css', function() {
  return gulp.src('src/less/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer("last 2 version", "ie 8", "ie 9"))
    .pipe(minify())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('build:js', function() {
  return gulp.src('src/js/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js'))
  .pipe(browserSync.reload({ stream: true }));
});

gulp.task('prettify', function() {
  return gulp.src('dist/*.html')
    .pipe(prettify({
      brace_style: 'collapse',
      indent_size: 2,
      indent_char: ' '
    }))
    .pipe(gulp.dest('./dist'));
});

/**
 * Bootstrap
 */
gulp.task('bootstrapLess', function() {
  return gulp.src('./vendor/less/bootstrap.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minify())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('bootstrapJs', function() {
  return gulp.src([
      'vendor/js/transition.js',
      'vendor/js/alert.js',
      'vendor/js/button.js',
      'vendor/js/collapse.js',
      'vendor/js/dropdown.js',
      'vendor/js/tooltip.js',
      'vendor/js/tab.js',
      'vendor/js/modal.js'
    ])
    .pipe(concat('bootstrap.tmp.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(shell([
      'cat includes/bs-license.txt dist/js/bootstrap.tmp.js > dist/js/bootstrap.min.js',
      'rm dist/js/bootstrap.tmp.js'
    ]));
});


/**
 * Imagemin
 */
gulp.task('imagemin', function(){
  return gulp.src('src/images/**')
    .pipe(imagemin({
      optimizationLevel: 3
    }))
    .pipe(gulp.dest('dist/images/'))
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.ejs'], ['build:html']);
  gulp.watch(['src/less/*.less'], ['build:css']);
  gulp.watch(['src/js/*.js'], ['build:js']);
  gulp.watch(['dist/*.html'], ['prettify']);
  gulp.watch(['vendor/less/**'], ['bootstrapLess']);
  gulp.watch(['src/images/**'], ['imagemin']);
});

gulp.task('default', ['build:html', 'build:css', 'build:js', 'prettify', 'bootstrapLess', 'bootstrapJs', 'imagemin', 'bs', 'watch']);
