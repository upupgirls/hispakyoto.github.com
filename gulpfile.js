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
var browserSync = require('browser-sync');

gulp.task("bs",function(){
  browserSync({
    server: {
      baseDir:'./dist/'
    }
  });
});

gulp.task('ejs', function(){
  return gulp.src(["src/**/*.ejs",'!' + "src/**/_*.ejs"])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(gulp.dest("./dist/"))
    //ejsを編集するたびブラウザがリロードされる
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('less', function() {
  return gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});

// sassを使う場合はこっちをつかう
// gulp.task('sass', function() {
//   return gulp.src('src/sass/*.scss')
//     .pipe(sass())
//     .pipe(gulp.dest('./dist/css'))
//     .pipe(browserSync.reload({ stream: true }));
// });

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
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

//lessをcssに変換
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

//bootstrapからコピーしてきたjsを結合
gulp.task('bootstrapJs', function() {
  return gulp.src([
      'vendor/js/transition.js',
      'vendor/js/alert.js',
      'vendor/js/button.js',
      'vendor/js/collapse.js',
      'vendor/js/dropdown.js',
      'vendor/js/tooltip.js',
      'vendor/js/tab.js'
    ])
    .pipe(concat('bootstrap.tmp.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(shell([
      'cat includes/bs-license.txt dist/js/bootstrap.tmp.js > dist/js/bootstrap.min.js',
      'rm dist/js/bootstrap.tmp.js'
    ]));
});


gulp.task('watch', function() {
  gulp.watch(['src/**/*.ejs'], ['ejs']);
  gulp.watch(['src/less/*.less'], ['less']);
  // gulp.watch(['src/sass/*.scss'], ['sass']);
  gulp.watch(['src/js/*.js'], ['js']);
  gulp.watch(['dist/*.html'], ['prettify']);
  gulp.watch(['vendor/less/**'], ['bootstrapLess']);
});

gulp.task('default', ['ejs', 'less', /*'sass',*/ 'js', 'prettify', 'bootstrapLess', 'bootstrapJs', 'bs', 'watch']);
