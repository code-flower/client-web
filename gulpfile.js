///////////////// MODULES ////////////////////

const gulp = require('gulp');
const browserify = require('browserify');
const envify = require('envify/custom');
const babelify = require('babelify');
const browserSync = require('browser-sync').create();
const open = require('gulp-open');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const argv = require('yargs').argv;
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const ngTemplates = require('gulp-ng-templates');
const concat = require('gulp-concat');
const removeCode = require('gulp-remove-code');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const zip = require('gulp-zip');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const ngAnnotate = require('gulp-ng-annotate');
const bulkify = require('bulkify');

const config = require('./config');

///////////////// CONSTANTS //////////////////

// the directory where the front-end files are served
const DIST = './dist';

// dev or prod
const ENV = argv.env || process.env.NODE_ENV || 'development';

///////////////// BUNDLER ////////////////////

gulp.task('bundle', function() {
  return browserify('./src/js/require.js')
    .transform(bulkify)
    .transform(babelify, { presets: ['es2015'] })
    .transform(envify({ NODE_ENV: ENV }))
    .on('error', console.log)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(ngAnnotate())
    .pipe(ENV === 'production' ? uglify() : gutil.noop())
    .pipe(gulp.dest(`${DIST}/js/`))
    .pipe(browserSync.stream());
});

////////////////// SASS //////////////////////

gulp.task('sass', function() {
  return gulp.src('./src/scss/index.scss')
    .pipe(sass({
      outputStyle: ENV === 'production' ? 'compressed' : 'nested'
    })
    .on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(`${DIST}/css/`))
    .pipe(browserSync.stream());
});

////////////////// TEMPLATES /////////////////
 
gulp.task('templates', function() {
  return gulp.src('./src/js/app/partials/**/*.html')
    .pipe(ngTemplates({
      filename: 'templates.js',
      module: 'CodeFlower',
      path: function(path, base) {
        return config.paths.partials + path.replace(base, '');
      },
      standalone: false
    }))
    .pipe(gulp.dest(`${DIST}/js/`))
    .pipe(browserSync.stream());
});

///////////////// COPY TASKS /////////////////

gulp.task('copy:index', function() {
  return gulp.src('./src/index.html')
    .pipe(removeCode({ 
      removeScript: ENV === 'production'
    }))
    .pipe(gulp.dest(DIST))
    .pipe(browserSync.stream());
});

gulp.task('copy:assets', function() {
  return gulp.src('./src/assets/**')
    .pipe(gulp.dest(DIST));  
});

gulp.task('copy:d3', function() {
  return gulp.src([
    './src/js/vendor/d3.js',
    './src/js/vendor/d3.geom.js',
    './src/js/vendor/d3.layout.js'
  ])
    .pipe(concat('d3.bundle.js'))
    .pipe(ENV === 'production' ? uglify() : gutil.noop())
    .pipe(gulp.dest(`${DIST}/js/`));
});

/////////////////// CLEAN /////////////////////

gulp.task('clean:dist', function() {
  return gulp.src(DIST, { read: false })
    .pipe(clean());
});

////////////////// DEV TASKS //////////////////

gulp.task('watch:js', function() {
  gulp.watch(['./src/js/**/*.js'], ['bundle']);
});

gulp.task('watch:sass', function() {
  gulp.watch(['./src/scss/**/*.scss'], ['sass']);
});

gulp.task('watch:partials', function() {
  gulp.watch(['./src/js/app/partials/**/*.html'], ['templates']);
});

gulp.task('watch:index', function() {
  gulp.watch(['./src/index.html'], ['copy:index']);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    port: 3000,
    server: DIST,
    ui: {
      port: 8090,
      weinre: {
        port: 3200
      }
    }
  });
});

///////////// BUILD AND DEFAULT //////////////

gulp.task('build', function(cb) {
  console.log("BUILD ENVIRONMENT:", ENV);
  runSequence('clean:dist', 'bundle', 'sass', 'templates', 'copy:assets', 'copy:index', 'copy:d3', cb);
});

gulp.task('default', function(cb) {
  runSequence('build', ['watch:js', 'watch:sass', 'watch:partials', 'watch:index'], 'browser-sync', cb);
});


