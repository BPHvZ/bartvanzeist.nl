var gulp = require("gulp");
var csso = require("gulp-csso");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var cp = require("child_process");
var imagemin = require("gulp-imagemin");
var browserSync = require("browser-sync");
// var critical = require('critical');
// const purgecss = require('gulp-purgecss')
var cleanCSS = require('gulp-clean-css');
const webp = require('gulp-webp');
const del = require("del");

var jekyllCommand = /^win/.test(process.platform) ? "jekyll.bat" : "jekyll";

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task("jekyll-build", function (done) {
  return cp
    .spawn(jekyllCommand, ["build"], { stdio: "inherit" })
    .on("close", done);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task(
  "jekyll-rebuild",
  gulp.series(["jekyll-build"], function (done) {
    browserSync.reload();
    done();
  })
);

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task(
  "browser-sync",
  gulp.series(["jekyll-build"], function (done) {
    browserSync({
      server: {
        baseDir: "_site",
      },
    });
    done();
  })
);

/*
 * Compile and minify sass
 */
gulp.task("sass", function () {
  return gulp
    .src("src/styles/**/*.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest("assets/css/"));
});

// gulp.task('purgecss', function() {
//   return gulp.src('assets/css/*.css')
//     .pipe(purgecss({
//       content: ['_site/**/*.html']
//     }))
//     .pipe(gulp.dest('assets/css/uncss/'))
// })

// Removing tabs and spaces in CSS
gulp.task('minify-css', function() {
  return gulp.src('assets/css/*.*')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('assets/css/'));
});

// gulp.task('critical', function () {
//   return critical.generate({
//     base: '_site/',
//     inline: true,
//     src: 'index.html',
//     target: '../assets/css/critical.css',
//     css: ['assets/css/*.css'],
//     dimensions: [{
//       width: 320,
//       height: 480
//     },{
//       width: 768,
//       height: 1024
//     },{
//       width: 1280,
//       height: 960
//     }]
//   });
// });

/*
 * Compile fonts
 */
gulp.task("fonts", function () {
  return gulp
    .src("src/fonts/**/*.{ttf,woff,woff2}")
    .pipe(plumber())
    .pipe(gulp.dest("assets/fonts/"));
});

/*
 * Minify images
 */
gulp.task("imagemin", function () {
  return gulp
    .src("src/img/**/*.{jpg,jpeg,png,gif,ico}")
    .pipe(plumber())
    .pipe(
      imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
    )
    .pipe(gulp.dest("src/imagemin/"));
});

gulp.task('webp', () =>
  gulp.src('src/imagemin/**/*.{jpg,jpeg,png}')
    .pipe(webp())
    .pipe(gulp.dest('src/imagemin/'))
    .pipe(gulp.src("src/imagemin/**/*.{webp,ico,gif}"))
    .pipe(gulp.dest('assets/img/'))
    .pipe(gulp.src("src/imagemin/**/*512x512.png"))
    .pipe(gulp.src("src/imagemin/**/bart.jpg"))
    .pipe(gulp.dest('assets/img/'))
);

gulp.task('clean', () =>
  del(["assets/img/**/bart.webp"])
);

/**
 * Compile and minify js
 */
gulp.task("js", function () {
  return gulp
    .src("src/js/**/*.js")
    .pipe(plumber())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("assets/js/"));
});

gulp.task("watch", function () {
  gulp.watch("src/styles/**/*.scss", gulp.series(['sass', 'minify-css', "jekyll-rebuild"]));
  gulp.watch("src/js/**/*.js", gulp.series(["js", "jekyll-rebuild"]));
  gulp.watch("src/fonts/**/*.{tff,woff,woff2}", gulp.series(["fonts"]));
  gulp.watch("src/img/**/*.{jpg,jpeg,png,gif,ico}", gulp.series(["imagemin", "webp", "clean", "jekyll-rebuild"]));
  gulp.watch(["*html", "_includes/*html", "_layouts/*.html"], gulp.series(["jekyll-rebuild"])
  );
});

gulp.task(
  "default",
  gulp.series(["js", "sass", "imagemin", "webp", "clean", "fonts", "browser-sync", "watch"])
);
