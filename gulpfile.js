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
var ghPages = require("gulp-gh-pages");
var browserSync = require('browser-sync');

gulp.task("bs",function(){
  browserSync({
    server: {
      baseDir:'./dist/'
    }
  });
});

gulp.task('ejs', function(){
  return gulp.src(["ejs/**/*.ejs",'!' + "ejs/**/_*.ejs"])
    .pipe(ejs())
    .pipe(gulp.dest("./dist/"))
    //ejsを編集するたびブラウザがリロードされる
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

//lessをcssに変換
gulp.task('less', function() {
  return gulp.src('less/bootstrap.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minify())
    .pipe(gulp.dest('./dist/css'));
});

//bootstrapからコピーしてきたjsを結合
gulp.task('scripts', function() {
  return gulp.src([
      'js/transition.js',
      'js/alert.js',
      'js/button.js',
      'js/collapse.js',
      'js/dropdown.js',
      'js/tooltip.js',
      'js/tab.js'
    ])
    .pipe(concat('bootstrap.tmp.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(shell([
      'cat includes/bs-license.txt dist/js/bootstrap.tmp.js > dist/js/bootstrap.min.js',
      'rm dist/js/bootstrap.tmp.js'
    ]));
});

gulp.task('deploy', function() {
  return gulp.src('./dist/*')
    .pipe(ghPages());
});

gulp.task('watch', function() {
  gulp.watch(['ejs/*.ejs'], ['ejs']);
  gulp.watch(['dist/*.html'], ['prettify']);
  gulp.watch(['less/**'], ['less']);
});

gulp.task('default', ['ejs', 'prettify', 'less', 'scripts', 'bs','watch']);
