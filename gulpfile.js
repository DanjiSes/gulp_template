const { src, dest, series, parallel, watch } = require('gulp');
const rename = require('gulp-rename');
const nunjucks = require('gulp-nunjucks');
const less = require('gulp-less');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();

function html() {
  return src('./src/html/*.njk')
         .pipe(nunjucks.compile())
         .pipe(rename({
           extname: '.html'
         }))
         .pipe(dest('./build'))
         .on('end', browserSync.reload);
}

function styles() {
  return src('./src/static/styles/style.less')
         .pipe(less())
         .pipe(dest('./build/css'))
         .pipe(browserSync.stream());
}

function images() {
  return src('./src/static/img/**/*')
         .pipe(dest('./build/img'));
}

function fonts() {
  return src('./src/static/fonts/**/*')
         .pipe(dest('./build/fonts'));
}

function cleanBuild() {
  return src('./build', {read: false}).pipe(clean())
}

function serve(cb) {
  browserSync.init({
    server: "./build",
    notify: false,
    scrollProportionally: false,
  });
}

function watchFiles() {
  // html
  watch('./src/html/**/*.njk', series(html));
  // styles
  watch('./src/static/styles/**/*', series(styles));
  // images
  watch('./src/static/img/**/*', series(images));
  // fonts
  watch('./src/static/fonts/**/*', series(fonts));
}

exports.html = html
exports.styles = styles
exports.images = images
exports.fonts = fonts
exports.cleanBuild = cleanBuild
exports.serve = serve
exports.watchFiles = watchFiles

exports.default = series(cleanBuild, parallel(html, styles, images, fonts), parallel(watchFiles, serve));