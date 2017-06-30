"use strict"

var gulp = require('gulp');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
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
var pathExists = require('path-exists');
var concat = require('gulp-concat');
var glob = require('glob');
var config = require('./config');
var ngAnnotate = require('gulp-ng-annotate');

// for vetting code
var print = require('gulp-print');
var jscs = require('gulp-jscs');
var jsStylish = require('jshint-stylish');
var jshint = require('gulp-jshint');


var port = process.env.PORT || config.SERVER_PORT;

var APP_PATH = config.APP_PATH;
var DIST_PATH = config.DIST_PATH;
var WIREDEB_FINISHED = false;
var INITIAL_LOAD = false;


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
 * @reload browserSync
 * 
 */
function reloadBrowserSync() {
  if (INITIAL_LOAD === true)
    browserSync.reload();
    console.log('reloading browser?')
}

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
    .pipe(gulp.dest(DIST_PATH + '/styles'))
    .on('finish', function () {
      reloadBrowserSync();
    });
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
    .pipe(ngAnnotate())
    .pipe(rename({ dirname: '' }))// remove dir structure copy
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))  
    .pipe(gulp.dest(DIST_PATH + '/js'))
    .on('finish', function () {
      reloadBrowserSync();
    });
})


gulp.task('move-html-templates', function () {

  var htmlfiles = APP_PATH + '/scripts/**/*.html';
  glob(htmlfiles, {}, function (er, files) {
    gulp.src(files)
      .pipe(gulp.dest(DIST_PATH + '/js'))
      .on('finish', () => {
        reloadBrowserSync();
      })
  })
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





gulp.task('watch', function () {
  gulp.watch(APP_PATH + "/scripts/**/*.ts", ['typescript']);
  gulp.watch(APP_PATH + "/scss/*.scss", ['styles']);
  gulp.watch(APP_PATH + "/scripts/**/*.html", ['move-html-templates']);
  gulp.watch('./src' + "/index.html", ['wiredep-index']);
});


/**
 * 
 * @wiredep-index
 * 
 */

gulp.task('wiredep-index', function (cb) {

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
    ignorePath: ['src', 'public']
  };

  var injectJSOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'public']
  };


  var wireupConf = {
    'ignorePath': '../public/',
    exclude: ['sass-bem', 'bootstrap-sass', 'angular-bootstrap'],
    directory: './public/bower_components'
  }

  return gulp.src('src/index.html')
    .pipe(wiredep(wireupConf))
    .pipe(inject(gulp.src(DIST_PATH + '/js/app.js', { read: false }),
      {
        starttag: '<!-- inject:app:{{ext}} -->',
        addRootSlash: false,
        ignorePath: ['src', 'public']
      }))

    .pipe(inject(gulp.src(DIST_PATH + '/js/app.core.js', { read: false }),
      {
        starttag: '<!-- inject:appcore:{{ext}} -->',
        addRootSlash: false,
        ignorePath: ['src', 'public']
      }))
    .pipe(inject(injectCSSFiles, injectCSSOptions))
    .pipe(inject(injectJSFiles, injectJSOptions))
    .pipe(gulp.dest('./public')).on('finish', function () {
      WIREDEB_FINISHED = true;
      reloadBrowserSync();
    });
})


/**
 * 
 * @wiredep
 * 
 */

gulp.task('wiredep', ['styles', 'move-html-templates', 'typescript',], function (done) {

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
    // gutil.log('Ready!', 'local:', gutil.colors.magenta('http:localhost:' + port));
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

  var browserTimer;

  function stopInterval() {
    clearInterval(browserTimer);
  }

  var browserSyncOptions = {
    proxy: 'localhost:' + port + '/app',
    port: port,
    browser: ["chrome"],//, "firefox"],
    // files: ["public/**/*.*","public/*.*","public/"],
    ghostMode: { // these are the defaults t,f,t,t
      clicks: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 0 //1000
  };


  function startbrowserSync() {
    if (WIREDEB_FINISHED === true) {

      if (!browserSync.active) {
        browserSync.init(null, browserSyncOptions);
      } else {
        setTimeout(function () {
          browserSync.reload();
          browserSync.notify('reloading browserSync now ...');
        }, 2300);
      }

      stopInterval();
      gutil.log(gutil.colors.magenta('browserSync executed after WIREDEB'));
    }
  }


  var nodeNoneOptions = {
    script: config.SERVER_FILE,
    delayTime: 1,
    env: {
      'PORT': port,
      //   'NODE_ENV': isDev ? 'dev' : 'build'
    },
    watch: [config.SERVER_PATH, './gulpfile.js']
  };

  return nodemon(nodeNoneOptions)
    .on('restart', function (ev) {
      gutil.log('*** nodemon restarted');
      setTimeout(function () {
        browserSync.notify('reloading browserSync now ...');
        browserSync.reload();
      }, 1300);
    })
    .on('start', function () {
      INITIAL_LOAD = true;

      gutil.log('*** nodemon and browserSync started');

      /**
       * start checking is all has files have rendered then execute
       */

      browserTimer = setInterval(function () { startbrowserSync(); }, 200);

    })
    .on('crash', function () {
      gutil.log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', function () {
      gutil.log('*** nodemon exited cleanly');
    });
});
