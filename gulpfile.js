const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlminify = require("gulp-htmlmin");
const jsminify = require("gulp-uglify-es").default;
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const imagemin = require("gulp-imagemin");
const sync = require("browser-sync").create();

//HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlminify({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
}

exports.html = html;

//Scripts

const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(jsminify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

//Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/img/**/*.{jpg,png,svg}",
    "source/*.json",
  ],
    {
      base: "source",
    })
    .pipe(gulp.dest("build"));
}

exports.copy = copy;

//Clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

//Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
};

exports.images = images;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.sass")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("build/css"))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}


exports.styles = styles;

//Sprite

const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(svgstore())
    .pipe(rename("main-sprite.svg"))
    .pipe(gulp.dest("build/img/icons"))
}

exports.sprite = sprite;

//Webp

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.sass", gulp.series(styles));
  gulp.watch("source/sass/*.sass", gulp.series(styles));
  gulp.watch("source/js/main-script.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html));
}

//Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    copy,
    images,
    createWebp
  )
)

exports.build = build;

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    copy,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
