var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var replace = require('gulp-replace');
var prompt = require('gulp-prompt');
var rename = require("gulp-rename");

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('pre-build', function(){
  gulp.src('config.tpl')
    .pipe(prompt.prompt([{
        type: 'input',
        name: 'NOMBRE_EMPRESA',
        message: 'NOMBRE_EMPRESA?',
        validate: function(value){
          if(!value){
              return "Ingrese un valor";
          }
          return true;
        }
    }, {
        type: 'input',
        name: 'IONIC_ID',
        message: 'IONIC_ID?',
        validate: function(value){
          if(!value){
              return "Ingrese un valor";
          }
          return true;
        }
    }, {
        type: 'input',
        name: 'URL',
        message: 'URL?',
        validate: function(value){
          if(!value){
              return "Ingrese un valor";
          }
          return true;
        }
    }, {
        type: 'input',
        name: 'TENANT_ID',
        message: 'TENANT_ID?',
        validate: function(value){
          if(!value){
              return "Ingrese un valor";
          }
          return true;
        }
    }, {
        type: 'checkbox',
        name: 'FACEBOOK',
        message: 'FACEBOOK?',
        choices: ['si', 'no']
    }, {
        type: 'input',
        name: 'PUSHER_KEY',
        message: 'PUSHER_KEY?',
        validate: function(value){
          if(!value){
              return "Ingrese un valor";
          }
          return true;
        }
    }, {
        type: 'input',
        name: 'STRIPE_KEY',
        message: 'STRIPE_KEY?',
        validate: function(value){
          if(!value){
              return "Ingrese un valor";
          }
          return true;
        }
    }], function(res){
      res.FACEBOOK = res.FACEBOOK == 'si' ? true : false;

      gulp.src('config.tpl', { base : './' })
        .pipe(replace('%NOMBRE_EMPRESA%', res.NOMBRE_EMPRESA))
        .pipe(replace('%IONIC_ID%', res.IONIC_ID))
        .pipe(replace('%URL%', res.URL))
        .pipe(replace('%TENANT_ID%', res.TENANT_ID))
        .pipe(replace('%FACEBOOK%', res.FACEBOOK))
        .pipe(replace('%PUSHER_KEY%', res.PUSHER_KEY))
        .pipe(replace('%STRIPE_KEY%', res.STRIPE_KEY))
        .pipe(rename('config.js'))
        .pipe(gulp.dest('./www/js/'));
        
    }));
  
});