const path = require('path');
const webserver = require('gulp-webserver');
const gulp = require('gulp');
const less = require('gulp-less');
const minifycss = require('gulp-minify-css');
const bundle = require('gulp-bundle-assets');


const concat = require('gulp-concat');


//  CONFIG PATHS
const config = {
    pages: './pages',
    assets: './assets',
    build: './dist'
};


gulp.task('bundle-css', () => gulp.src([
    'assets/plugins/pace/pace-theme-flash.min.css',
    'assets/plugins/bootstrap/css/bootstrap.min.css',
    'assets/plugins/jquery-scrollbar/jquery.scrollbar.css',
    'assets/plugins/select2/css/select2.min.css',
    'assets/plugins/switchery/css/switchery.min.css',
    'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.min.css',
    'pages/css/pages-icons.min.css'
])
    .pipe(concat('style.bundle.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('./pages/css')));


gulp.task('bundle-js', () => gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest('./temp')));


// TASKS
gulp.task('less' +
    '', () => {
    gulp.src(path.join(config.pages, '/less/pages.less'))
        .pipe(less({
            paths: [path.join(config.pages, '/less/')]
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(path.join(config.pages, '/css/')));

    gulp.src(path.join(config.pages, '/less/pages.rtl.less'))
        .pipe(less({
            paths: [path.join(config.pages, '/less/')]
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(path.join(config.pages, '/css/')));
});

gulp.task('watch', () => {
    gulp.watch(path.join(config.pages, '/less/**/*.less'), () => {
        gulp.run('bundle-css');
    });
});

// Server
gulp.task('server', ['bundle-css'], () => {
    gulp.src('./')
        .pipe(webserver({
            fallback: 'index.html',
            // livereload: true,
            // directoryListing: true,
            open: true
        }));
});


gulp.task('default', ['bundle-css'], () => {
    gulp.src('./')
        .pipe(webserver({
            fallback: 'index.html',
            // livereload: true,
            // directoryListing: true,
            open: true
        }));
});

