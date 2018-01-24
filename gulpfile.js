///////////////// MODULES ////////////////////

const gulp          = require('gulp'),
      browserify    = require('browserify'),
      envify        = require('envify/custom'),
      babelify      = require('babelify'),
      browserSync   = require('browser-sync').create(),
      open          = require('gulp-open'),
      source        = require('vinyl-source-stream'),
      buffer        = require('vinyl-buffer'),
      argv          = require('yargs').argv,
      sass          = require('gulp-sass'),
      autoprefixer  = require('gulp-autoprefixer'),
      ngTemplates   = require('gulp-ng-templates'),
      concat        = require('gulp-concat'),
      clean         = require('gulp-clean'),
      runSequence   = require('run-sequence'),
      zip           = require('gulp-zip'),
      uglify        = require('gulp-uglify'),
      gutil         = require('gulp-util'),
      ngAnnotate    = require('gulp-ng-annotate'),
      bulkify       = require('bulkify'),
      es            = require('event-stream'),
      rename        = require('gulp-rename'),
      replace       = require('gulp-replace'),
      s3            = require('s3');

const config = require('./config');
const awsCreds = require('./private/aws-creds');

///////////////// CONSTANTS //////////////////

const DIST = './dist';
const SRC = './src';

// environments are 'development' and 'production'
const ENV = argv.env || process.env.NODE_ENV || 'development',
      REMOTE_API = ENV === 'production' || !!argv.remoteApi;

///////////////// BUNDLER ////////////////////

gulp.task('bundle', function() {
  return browserify(`${SRC}/js/require.js`)
    .transform(bulkify)
    .transform(babelify, { presets: ['es2015'] })
    .transform(envify({
      NODE_ENV: ENV,
      REMOTE_API
    }))
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
  return gulp.src(`${SRC}/scss/index.scss`)
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
  return gulp.src(`${SRC}/js/app/partials/**/*.html`)
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
  return gulp.src(`${SRC}/index.html`)
    .pipe(gulp.dest(DIST))
    .pipe(browserSync.stream());
});

gulp.task('copy:assets', function() {
  return gulp.src(`${SRC}/assets/**`)
    .pipe(gulp.dest(DIST));
});

gulp.task('copy:d3', function() {
  return gulp.src([
    `${SRC}/js/vendor/d3.js`,
    `${SRC}/js/vendor/d3.geom.js`,
    `${SRC}/js/vendor/d3.layout.js`
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

///////////////////// CACHE BUST //////////////////////////
// adds timestamps to the ends of the filenames and
// changes the filenames in the index.html file.
// all changes occur after the files are already in dist.

gulp.task('cacheBust', function() {

  // add the stamp right before the final period
  function stampedFileName(filename, stamp) {
    return filename.replace(/(\.[^.]*?)$/, `-${stamp}$1`);
  }

  const STAMP = Date.now();

  const FILES_TO_STAMP = [
    { dir: 'js',  name: 'bundle.js'    },
    { dir: 'js',  name: 'templates.js' },
    { dir: 'css', name: 'index.css'    }
  ];

  gutil.log("TIMESTAMP:", STAMP);

  // generate the stamped filenames
  FILES_TO_STAMP.forEach(file => {
    file.stampedName = stampedFileName(file.name, STAMP);
  });

  // rename each file
  let renameStreams = FILES_TO_STAMP.map(file => {
    return gulp.src(`${DIST}/${file.dir}/${file.name}`)
      .pipe(clean())
      .pipe(rename(file.stampedName))
      .pipe(gulp.dest(`${DIST}/${file.dir}`))
  });

  // replace each occurrence of the filenames in index.html
  let replaceStream = gulp.src(`${DIST}/index.html`);
  FILES_TO_STAMP.forEach(file => {
    replaceStream = replaceStream.pipe(
      replace(`${file.dir}/${file.name}`, `${file.dir}/${file.stampedName}`)
    );
  });
  replaceStream.pipe(gulp.dest(DIST));

  return es.merge(renameStreams.concat(replaceStream));
});

///////////////////// UPLOAD TO S3 ////////////////////////

gulp.task('upload', function(cb) {

  let client = s3.createClient({
    s3Options: awsCreds
  });

  let uploader = client.uploadDir({
    localDir: DIST,
    deleteRemoved: true,
    s3Params: {
      Bucket: config.s3.bucket
    },
    getS3Params: function(localFile, stat, callback) {
      let s3Params = stat.path === 'index.html' ?
                     { CacheControl: 'max-age=0' } :
                     { CacheControl: 'max-age=604800' }
      callback(null, s3Params);
    }
  });

  uploader.on('error', function(err) {
    console.error("unable to sync:", err.stack);
    process.exit(1);
  });

  let lastProgress = 0, curProgress;
  uploader.on('progress', function() {
    curProgress = 100 * uploader.progressAmount / uploader.progressTotal;
    if (curProgress - lastProgress > 3) {
      gutil.log("upload progress: " + Math.round(curProgress) + "%");
      lastProgress = curProgress;
    }
  });

  uploader.on('end', function() {
    gutil.log("done uploading");
    cb();
  });
});

////////////////// DEV TASKS //////////////////

gulp.task('watch:js', function() {
  gulp.watch([`${SRC}/js/**/*.js`], ['bundle']);
});

gulp.task('watch:sass', function() {
  gulp.watch([`${SRC}/scss/**/*.scss`], ['sass']);
});

gulp.task('watch:partials', function() {
  gulp.watch([`${SRC}/js/app/partials/**/*.html`], ['templates']);
});

gulp.task('watch:index', function() {
  gulp.watch([`${SRC}/index.html`], ['copy:index']);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    port: 3000,
    server: DIST,
    https: config.paths.SSL,
    ui: {
      port: 8090,
      weinre: {
        port: 3200
      }
    },
    browser: argv.firefox ? 'firefox' : 'google chrome'
  });
});

/////////// BUILD, DEPLOY, DEFAULT ////////////

gulp.task('build', function(cb) {
  console.log("BUILD ENVIRONMENT:", ENV);
  runSequence('clean:dist', 'bundle', 'sass', 'templates', 'copy:assets', 'copy:index', 'copy:d3', cb);
});

gulp.task('deploy', function(cb) {
  runSequence('build', 'cacheBust', 'upload', cb);
});

gulp.task('default', function(cb) {
  runSequence('build', ['watch:js', 'watch:sass', 'watch:partials', 'watch:index'], 'browser-sync', cb);
});



