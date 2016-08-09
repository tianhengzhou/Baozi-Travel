// Generated on 2016-03-21 using generator-angular 0.15.1
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var babel = require('gulp-babel');
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var _ = require('lodash');
var yeoman = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist'
};

var paths = {
  scripts: [yeoman.app + '/scripts/**/*.js'],
  styles: [yeoman.app + '/styles/**/*.scss'],
  templates: [yeoman.app + '/templates/**/*.html'],
  html: [yeoman.app + '/scripts/**/*.html'],
  mainStyle: [yeoman.app + '/styles/main.scss'],
  baseStyle: [yeoman.app + '/styles/*.scss'],
  test: ['test/spec/**/*.js'],
  testRequire: [
    yeoman.app + '/bower_components/angular/angular.js',
    yeoman.app + '/bower_components/angular-mocks/angular-mocks.js',
    yeoman.app + '/bower_components/angular-resource/angular-resource.js',
    yeoman.app + '/bower_components/angular-cookies/angular-cookies.js',
    yeoman.app + '/bower_components/angular-sanitize/angular-sanitize.js',
    yeoman.app + '/bower_components/angular-route/angular-route.js',
    'test/mock/**/*.js',
    'test/spec/**/*.js'
  ],
  karma: 'karma.conf.js',
  views: {
    main: yeoman.app + '/index.html',
    files: [yeoman.app + '/templates/**/*.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.sass, {
    outputStyle: 'expanded',
    precision: 10
  })
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, '.tmp/styles');

///////////
// Tasks //
///////////

gulp.task('styles', function () {
  return gulp.src(paths.mainStyle)
    .pipe(styles());
});
gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(gulp.dest('.tmp/scripts'))
});
gulp.task('scripts:html', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest('.tmp/scripts'))
});
gulp.task('scripts_dist:html', function () {
  return gulp.src(paths.html)
      .pipe(gulp.dest('dist/scripts'))
});
gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('start:client', ['start:server', 'styles', 'scripts'], function () {
  openURL('http://localhost:9000');
});

gulp.task('start:server', function() {
  $.connect.server({
    root: [yeoman.app, '.tmp'],
    livereload: true,
    // Change this to '0.0.0.0' to access the server from outside.
    port: 9000
  });
});

gulp.task('start:server:test', function() {
  $.connect.server({
    root: ['test', yeoman.app, '.tmp'],
    livereload: true,
    port: 9001
  });
});
// gulp.task('babel', function () {
//   var
// });
gulp.task('watch', function () {

  $.watch(paths.styles, function() {  //['inject:scss']
    gulp.src(paths.mainStyle)
      .pipe($.plumber())
      .pipe(styles())
      .pipe($.connect.reload());
  });

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.templates)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.views.main)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe($.connect.reload());

  $.watch(paths.test)
    .pipe($.plumber())
    .pipe(lintScripts());

  gulp.watch(['bower.json', paths.templates] , ['bower', 'inject']);
});

gulp.task('serve', function (cb) {
  runSequence('clean:tmp',
    'bower',
    'inject',
    'scripts:html',
    ['lint:scripts'],
    ['start:client'],
    'watch', cb);
});

gulp.task('serve:prod', function() {
  $.connect.server({
    root: [yeoman.dist],
    livereload: true,
    port: 9000
  });
});

gulp.task('test', ['start:server:test'], function () {
  var testToFiles = paths.testRequire.concat(paths.scripts, paths.test);
  return gulp.src(testToFiles)
    .pipe($.karma({
      configFile: paths.karma,
      action: 'watch'
    }));
});
gulp.task('inject', function (cb) {
  runSequence(['inject:js', 'inject:scss'], cb)
});
// inject bower components
gulp.task('bower', function () {
  return gulp.src(yeoman.app+'/index.html')
    .pipe(wiredep({
      directory: 'app/bower_components',
      ignorePath: '..'
    }))
  .pipe(gulp.dest(yeoman.app));
});
//inject javascript
gulp.task('inject:js', function(){
  return gulp.src(yeoman.app+'/index.html')
    .pipe($.inject(
      gulp.src(_.union(paths.scripts, ['!' + yeoman.app + '/**/*.{spec,mock}.js', '!' + yeoman.app + '/scripts/app.js']), {read: false})
        .pipe($.sort()),
      {
        starttag: '<!-- injector:js -->',
        endtag: '<!-- endinjector -->',
        transform: function(filepath) {
          var newPath = filepath
            .replace('/' + yeoman.app + '/scripts/', 'scripts/');
          return '<script src=\"' + newPath + '\"></script>'
        }
}))
.pipe(gulp.dest(yeoman.app));
});

// inject sass
gulp.task('inject:scss', function(){
  return gulp.src(paths.mainStyle)
    .pipe($.inject(
      gulp.src(_.union(paths.styles, ['!' + paths.baseStyle]), {read: false})
        .pipe($.sort()),
        {
          starttag: '// injector',
          endtag: '// endinjector',
          transform: function(filepath){
          var newPath = filepath
              .replace('/'+yeoman.app+'/styles/', '')
              .replace(yeoman.app + '/bower_omponents/', '../bower_components/')
      .replace('.scss', '');
return '@import \"'+ newPath + '\";';
}
}))
.pipe(gulp.dest(yeoman.app + '/styles'));
});
///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('client:build', ['html', 'styles', 'scripts', 'scripts:html', 'scripts_dist:html'], function () {
  var jsFilter = $.filter('**/*.js',  { restore: true });
  var cssFilter = $.filter('**/*.css',  { restore: true });
  var htmlFilter = $.filter(['**/*', '!**/index.html'],  { restore: true });
  return gulp.src(paths.views.main)
    .pipe($.useref({searchPath: [yeoman.app, '.tmp']}))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe(cssFilter.restore)
    .pipe(htmlFilter)
    .pipe($.rev())
    .pipe(htmlFilter.restore)
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('html', function () {
  return gulp.src(yeoman.app + '/views/**/*')
    .pipe(gulp.dest(yeoman.dist + '/views'));
});

gulp.task('images', function () {
  return gulp.src(yeoman.app + '/images/**/*')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images'));
});

gulp.task('copy:extras', function () {
  return gulp.src(yeoman.app + '/*/.*', { dot: true })
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('copy:fonts', function () {
  return gulp.src(yeoman.app + '/fonts/**/*')
    .pipe(gulp.dest(yeoman.dist + '/fonts'));
});

gulp.task('build', ['clean:dist'], function () {
  runSequence(['images', 'copy:extras', 'copy:fonts', 'client:build']);
});

gulp.task('default', ['build']);
