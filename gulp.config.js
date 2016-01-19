/* jshint node:true */
module.exports = function() {
  'use strict';
  var config = {
    messages: {
      jsBuild: '<span style="color: white;">Building:</span> <span style="color: #2cb5da;">js</span>',
      sassBuild: '<span style="color: white;">Building:</span> <span style="color: #2cb5da;">sass</span>',
      jekyllBuild: '<span style="color: white;">Running:</span> <span style="color: #2cb5da;">jekyll build</span>',
    },
    sassPaths: [
      'bower_components/font-awesome/scss',
      'bower_components/foundation-sites/scss',
      'bower_components/motion-ui/src'
    ],
    directories: {
      site: '_site'
    },
    files: {
      fonts: {
        src: [
          'bower_components/font-awesome/fonts/**/*'
        ],
        output: {
          directory: 'fonts',
          siteDirectory: '_site/fonts'
        }
      },
      js: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/what-input/what-input.js',
          'bower_components/foundation-sites/dist/foundation.js',
          '_js/**/*.js'
        ],
        watched: ['_js/**/*.js'],
        output: {
          filename: 'app.js',
          minFilename: 'app.min.js',
          directory: 'js',
          siteDirectory: '_site/js'
        }
      },
      sass: {
        src: [
          '_sass/app.scss'
        ],
        watched: ['_sass/**/*.scss'],
        output: {
          filename: 'app.css',
          minFilename: 'app.min.css',
          directory: 'css',
          siteDirectory: '_site/css'
        }
      },
      html: {
        src: ['_site/**/*.html'],
        watched: ['index.html', '*(_layouts|_includes|_pages|_posts)/**/*.+(md|html)']
      }
    }
  };
  return config;
};
