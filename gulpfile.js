let gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    pug = require("gulp-pug"),
    sass = require("gulp-sass"),
    mincss = require("gulp-clean-css"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    favicons = require("gulp-favicons"),
    replace = require("gulp-replace"),
    newer = require("gulp-newer"),
    plumber = require("gulp-plumber"),
    debug = require("gulp-debug"),
    watch = require("gulp-watch"),
    clean = require("gulp-clean"),
    ftp = require('vinyl-ftp');

let $images = ["./src/img/**/*.{jpg,jpeg,png,gif}", "!./src/img/favicons/*.{jpg,jpeg,png,gif}"],
    $pug = ["./src/views/**/*.pug", "!./src/views/blocks/*.pug"],
    $pug_watch = "./src/views/**/*.pug",
    $scripts = ["./src/js/*.js"],
    $libs = ["./src/libs/**/*.js"],
    $styles = ["./src/styles/*.scss", "!./src/styles/components/*.scss"],
    $styles_watch = ["./src/styles/*.scss", "./src/styles/components/*.scss"],
    $favicons = "./src/img/favicons/*.{jpg,jpeg,png,gif}",
    $other = ["./src/**/*", "!./src/img/**/*.{jpg,jpeg,png,gif}", "!./src/js/*.js", "!./src/styles/*.scss", "!./src/styles/components","!./src/styles/components/**/*", "!./src/views", "!./src/views/**/*"];

gulp.task("pug", function() {
  return gulp.src($pug)
    .pipe(debug({title: 'pug'}))
    .pipe(pug({pretty:true}))
    .pipe(gulp.dest("./dest/"))
    .on("end", browsersync.reload);
});

gulp.task("libs", function () {
  return gulp.src($libs)
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dest/js/"))
    .pipe(debug({"title": "libs"}))
    .on("end", browsersync.reload);
});

gulp.task("scripts", function () {
  return gulp.src($scripts)
    .pipe(babel({presets: ["@babel/preset-env"]}))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("./dest/js/"))
    .pipe(debug({"title": "scripts"}))
    .on("end", browsersync.reload);
});

gulp.task("styles", function() {
    return gulp.src($styles)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(mincss())
      .pipe(rename({suffix: ".min"}))
      .pipe(replace("../../dest/", "../"))
      .pipe(plumber.stop())
      .pipe(sourcemaps.write("./maps/"))
      .pipe(gulp.dest("./dest/styles/"))
      .pipe(debug({"title": "styles"}))
      .on("end", browsersync.reload);
});

gulp.task("images", function () {
  return gulp.src($images)
    .pipe(newer("./dest/img/"))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest("./dest/img/"))
    .pipe(debug({
      "title": "images"
    }))
    .on("end", browsersync.reload);
});

gulp.task("favicons", function () {
  return gulp.src($favicons)
    .pipe(favicons({
      icons: {
        appleIcon: true,
        favicons: true,
        online: false,
        appleStartup: false,
        android: false,
        firefox: false,
        yandex: false,
        windows: false,
        coast: false
      }
    }))
    .pipe(gulp.dest("./dest/img/favicons/"))
    .pipe(debug({
      "title": "favicons"
    }));
});

gulp.task("other", function () {
  return gulp.src($other)
    .pipe(gulp.dest("./dest/"))
    .on("end", browsersync.reload);
});

gulp.task("clean", function () {
  return gulp.src("./dest/*", {
      read: false
    })
    .pipe(clean())
    .pipe(debug({
      "title": "clean"
    }));
});

gulp.task("serve", function () {
  return new Promise((res, rej) => {
    browsersync.init({
      server: "./dest/",
      tunnel: false,
      port: 9000
    });
    res();
  });
});

gulp.task("watch", function () {
  return new Promise((res, rej) => {
    watch($pug_watch, gulp.series("pug"));
    watch($styles_watch, gulp.series("styles"));
    watch($scripts, gulp.series("scripts"));
    watch($libs, gulp.series("libs"));
    watch($images, gulp.series("images"));
    watch($favicons, gulp.series("favicons"));
    watch($other, gulp.series("other"));
    res();
  });
});

// dest
gulp.task("default", gulp.series("clean",
  gulp.parallel("pug", "scripts", "libs", "styles", "images", "favicons", "other"),
  gulp.parallel("watch", "serve")
));

gulp.task('transfer', function () {
  return gulp.src(['./dest/**/*'], {buffer:false} )
    .pipe(ftp.create({
      host: '',
      user: '',
      password: '',
      parallel: 10
    })
    .dest('/home/r/remeslo36/remeslo36.ru/public_html/assets/components/project/dest'));
});