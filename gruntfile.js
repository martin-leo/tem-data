module.exports = function(grunt) {
  grunt.initConfig({

    sass: {
      dev: {
        options: {
          style: 'expanded',
        },
        files: {
          'site/styles.css': 'src/scss/styles.scss',
        },
      }
    },

    copy: {
      js: {
        files: [
          {expand: true, cwd: 'src/js', src: ['**'], dest: 'site'},
        ],
      },
      html: {
        files: [
          {expand: true, cwd: 'src', src: ['index.html','data.json'], dest: 'site'},
        ],
      },
    },

    watch: {
      options: {
        spawn: false,
        livereload: true,
      },
      files: {
        files: ['src/**/*'],
        tasks: ['copy:js', 'copy:html', 'sass:dev'],
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // registerTask
  grunt.registerTask('default', ['copy:js', 'copy:html', 'sass:dev', 'watch']);
  grunt.registerTask('gen', ['copy:js', 'copy:html', 'sass:dev']);
};
