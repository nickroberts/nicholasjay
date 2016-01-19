/* jshint node:true */
var config = require('./gulp.config')();
var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));
var ftp = require('vinyl-ftp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var cp = require('child_process');

gulp.task('fonts', function() {
  return gulp.src(config.files.fonts.src)
    .pipe(gulp.dest(config.files.fonts.output.directory));
});

gulp.task('js', function(done) {
  if (browserSync.instance.active) {
    browserSync.notify(config.messages.jsBuild);
  }
  gulp.src(config.files.js.src)
    .pipe($.sourcemaps.init())
    .pipe($.concat(config.files.js.output.filename))
    .pipe(gulp.dest(config.files.js.output.directory))
    .pipe($.uglify())
    .pipe($.rename(config.files.js.output.minFilename))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.files.js.output.directory))
    .pipe(gulp.dest(config.files.js.output.siteDirectory))
    .on('end', function() {
      if (browserSync.instance.active) {
        browserSync.reload();
      }
      done();
    });
});

gulp.task('sass', function() {
  if (browserSync.instance.active) {
    browserSync.notify(config.messages.sassBuild);
  }
  return gulp.src(config.files.sass.src)
    .pipe($.sass({
      includePaths: config.sassPaths
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe($.rename(config.files.sass.output.filename))
    .pipe(gulp.dest(config.files.sass.output.directory))
    .pipe($.sourcemaps.init())
    // .pipe($.cssnano())
    .pipe($.rename(config.files.sass.output.minFilename))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.files.sass.output.directory))
    .pipe(gulp.dest(config.files.sass.output.siteDirectory))
    .pipe(browserSync.stream());
});

gulp.task('rebuild', build);

gulp.task('build', ['sass', 'js', 'fonts'], build);

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: config.directories.site
    }
  });
});

gulp.task('deploy:prod', function() {
  if (argv.hostname && argv.user && argv.password && argv.directory) {
    var conn = ftp.create({
      host: argv.hostname,
      user: argv.user,
      password: argv.password,
  		log: $.util.log
    });

    return gulp.src(['_site/**/*'])
      .pipe(conn.newer(argv.directory))
      .pipe(conn.dest(argv.directory));
  } else {
    return $.util.log('Required variables are not set.');
  }
});

gulp.task('default', ['serve'], function() {
  gulp.watch(config.files.sass.watched, ['sass']);
  gulp.watch(config.files.js.watched, ['js']);
  gulp.watch(config.files.html.watched, ['rebuild']);
});

function build(done) {
  if (browserSync.instance.active) {
    browserSync.notify(config.messages.jekyllBuild);
  }
  var buildOptions = ['build'];
  if (argv.config) {
    buildOptions.push('--config');
    buildOptions.push('_config.yml,_config.' + argv.config + '.yml');
  }
  cp.spawn('jekyll', buildOptions, {
      stdio: 'inherit',
    })
    .on('close', function() {
      if (browserSync.instance.active) {
        browserSync.reload();
      }
      gulp.src(config.files.html.src)
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(config.directories.site))
        .on('end', function() {
          done();
        });
    });
}
