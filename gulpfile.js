var gulp = require('gulp');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var del = require('del');
var typescript = require('gulp-typescript');
var tsProject = typescript.createProject('tsconfig.json', { removeComments: false });
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var wiredep = require('wiredep').stream;
var gutil = require('gulp-util');
var minifyHtml = require('gulp-htmlmin');
var angularTemplatecache = require('gulp-angular-templatecache');
var pathExists = require('path-exists');
var concat = require('gulp-concat');
const config = require('./config');

// for vetting code
var print = require('gulp-print');
var jscs = require('gulp-jscs');
var jsStylish = require('jshint-stylish');
var jshint = require('gulp-jshint');



var port = process.env.PORT || 3000;

var APP_PATH = config.APP_PATH;
var DIST_PATH = config.DIST_PATH;
var WIREDEB_FINISHED = false;



/**
 * 
 * @delete
 * 
 */

gulp.task('clean', function (done) {
  del(['./public/dist/'], done);
});


/**
 * 
 * @styles
 * outputting all sass files from bower using "wiredep" and including app sass files via main.scss
 * global configurable file for overiting bootstrap
 */

gulp.task('styles', function () {

  // move svg image for preloader only
  gulp.src(APP_PATH + '/scss/*.svg')
    .pipe(gulp.dest(DIST_PATH + '/styles'));

  // move font-awesome to dist  manually
  var fontAwesomePath = './public/bower_components/font-awesome/';

  pathExists(fontAwesomePath).then((exists) => {
    gulp.src(fontAwesomePath + '/fonts/*.*')
      .pipe(gulp.dest(DIST_PATH + '/styles/fonts'));
    gutil.log('fontAwesomePath exists', gutil.colors.magenta(fontAwesomePath));
  });

  var injectAppFiles = gulp.src([APP_PATH + '/scss/layout.scss'], { read: false });
  var injectGlobalFiles = gulp.src(APP_PATH + '/scss/global.vars.scss', { read: false });

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  var wireupConf = {
    'ignorePath': '../public/',
    exclude: ['sass-bem', 'bootstrap-sass'],//, 'bootstrap'
    directory: './public/bower_components',
  };


  return gulp.src(APP_PATH + '/scss/main.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest(DIST_PATH + '/styles'));

});

/**
 * 
 * @typescript
 * 
 */

gulp.task('typescript', function () {

  var tsSources = [
    APP_PATH + '/scripts/**/*.ts'];

  return gulp.src(tsSources)
    .pipe(tsProject())
    .pipe(rename({ dirname: '' }))// remove dir structure copy
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DIST_PATH + '/js'))
})


/**
 * 
 * @angular-templates
 * 
 */

gulp.task('angular-templates-typescript', ['typescript'], function () {

  var templateCache = {
    file: 'templates.js',
    options: {
      module: 'app.core',
      root: 'dist/js',
      standAlone: false
    }
  }

  return gulp.src(APP_PATH + '/scripts/**/*.html')

    .pipe(rename({ dirname: '' }))
    .pipe(minifyHtml({ collapseWhitespace: true }))
    .pipe(angularTemplatecache(
      templateCache.file,
      templateCache.options
    ))
    .pipe(gulp.dest(DIST_PATH + '/js'))
    .on('finish', function () {

      /**
       * once finished with TS to js, run VET for js code checking
       */

      gulp.start('vet-js', function () { });
    });
});


/**
 * 
 * vet the code and create coverage report
 * @return {Stream}
 */

gulp.task('vet-js', function () {
  gutil.log('Analyzing source with TSLint, JSHint and JSCS');

  return gulp
    .src([DIST_PATH + "/js/*.js", "!" + DIST_PATH + "/js/templates.js"])
    .pipe(print())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true }))
    // .pipe( jshint.reporter('fail'))
    .pipe(jscs());
});

/**
 * 
 * @ts-to-js
 * execute vet once all else complete
 */

gulp.task('ts-to-js-watch', ['angular-templates-typescript'], function (done) {
  browserSync.reload();
  done();
});

/**
 * 
 * @style-change
 * 
 */

gulp.task('style-change', ['styles'], function (done) {

  browserSync.reload();
  done();
});

gulp.task('wiredep-index-watch', ['wiredep-index'], function (done) {
  browserSync.reload();
  done();
  console.log('reloading wiredep-index-watch')
});


/**
 * 
 * @watch
 * 
 */

gulp.task('watch', function () {
  gulp.watch(APP_PATH + "/scripts/**/*.ts", ['ts-to-js-watch']);
  gulp.watch(APP_PATH + "/scss/*.scss", ['style-change']);
  gulp.watch(APP_PATH + "/scripts/**/*.html", ['ts-to-js-watch']);
  gulp.watch('./src' + "/*.html", ['wiredep-index-watch']);
});


/**
 * 
 * @wiredep-index
 * 
 */

gulp.task('wiredep-index', function (cb) {


  var fileVer = Math.random() * (10 - 5) + 5;
  var injectJSFiles = gulp.src([
    DIST_PATH + '/js/*.js',
    '!' + DIST_PATH + '/js/app.js',
    '!' + DIST_PATH + '/js/app.core.js'
  ]);

  var injectCSSFiles = gulp.src([DIST_PATH + '/styles/main.css']);
  var injectCSSOptions = {
    starttag: '<!-- inject:css -->',
    endtag: '<!-- endinject -->',
    addRootSlash: false,
    ignorePath: ['src', 'public'],
    //add file caching
    transform: function (filepath, file, i, length) {
      return "<link rel='stylesheet' href='" + filepath + '?=' + fileVer + "'/>"
    }
  };

  var injectJSOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'public'],
    //add file caching
    transform: function (filepath, file, i, length) {
      return "<script src='" + filepath + '?=' + fileVer + "'></script>"
    }
  };


  var wireupConf = {
    'ignorePath': '../public/',
    exclude: ['sass-bem', 'bootstrap-sass'],
    directory: './public/bower_components'
  }

  return gulp.src('src/index.html')
    .pipe(wiredep(wireupConf))
    .pipe(inject(gulp.src(DIST_PATH + '/js/app.js', { read: false }),
      {
        starttag: '<!-- inject:app:{{ext}} -->',
        addRootSlash: false,
        ignorePath: ['src', 'public'],
        //add file caching
        transform: function (filepath, file, i, length) {
          return "<script src='" + filepath + '?=' + fileVer + "'></script>"
        }
      }))

    .pipe(inject(gulp.src(DIST_PATH + '/js/app.core.js', { read: false }),
      {
        starttag: '<!-- inject:appcore:{{ext}} -->',
        addRootSlash: false,
        ignorePath: ['src', 'public'],
        //add file caching
        transform: function (filepath, file, i, length) {
          return "<script src='" + filepath + '?=' + fileVer + "'></script>"
        }
      }))

    .pipe(inject(injectCSSFiles, injectCSSOptions))
    .pipe(inject(injectJSFiles, injectJSOptions))
    .pipe(gulp.dest('./public')).on('finish', function () {
      WIREDEB_FINISHED = true;
    });

})


/**
 * 
 * @wiredep
 * 
 */

gulp.task('wiredep', ['styles', 'angular-templates-typescript'], function (done) {

  gulp.start('wiredep-index', function () {
    gutil.log('-------------------------');
    gutil.log(gutil.colors.magenta('wiredep-index loaded'));
    gutil.log('-------------------------');

  });
  done();

});


/** 
 * 
 * @all
 * 
 */

gulp.task('all', ['clean'], function (done) {

  gulp.start('wiredep', function () {
    gutil.log('-------------------------');
    gutil.log('Ready!', 'local:', gutil.colors.magenta('http:localhost:' + port));
    gutil.log('-------------------------');
  })

  done();
});


/** 
 * 
 * @default
 * 
 * 
 * due to wiredep and compass have to complete long tasks we wait until "WIREDEB_FINISHED" is true then 
 * we cleartimer and execute browserSync
 */

gulp.task('default', ['all', 'watch'], function () {


  var myVar = setInterval(function () { myTimer() }, 200);
  function myTimer() {
    if (WIREDEB_FINISHED == true) {
      bSync();
      myStopFunction();
      gutil.log(gutil.colors.magenta('browserSync executed '));
    }
  }

  function myStopFunction() {
    clearInterval(myVar);
  }

  function bSync() {
    browserSync.init({
      server: {
        port: port,
        open: true,
        baseDir: './public',
        middleware: function (req, res, next) {
          next();
        },
      }
    })
  }

});