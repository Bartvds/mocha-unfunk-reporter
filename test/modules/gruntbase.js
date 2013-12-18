function base(grunt) {

	var path = require('path');

	grunt.loadTasks('../../../node_modules/grunt-contrib-clean/tasks');
	grunt.loadTasks('../../../node_modules/grunt-ts/tasks');
	grunt.loadTasks('../../../node_modules/grunt-mocha-test/tasks');
	grunt.loadTasks('../../../node_modules/grunt-mocha/tasks');
	grunt.loadTasks('../../../node_modules/grunt-shell/tasks');
	grunt.loadTasks('../../../tasks');

	grunt.registerTask('build', ['clean', 'typescript']);

	return {
		config: function (conf) {
			return grunt.util._.extend({
				clean: ['./tmp/**/*'],
				ts: {
					all: {
						options: {
							target: 'es5',
							sourcemap: true
						},
						src: ['src/**/*.ts'],
						out: 'tmp/_tmp.test.js'
					}
				},
				mocha_unfunk: {
					plain: {
						options: {
							style: 'plain'
						}
					},
					dev: {
						options: {
							style: 'dev'
						}
					},
					ansi: {
						options: {
							style: 'ansi'
						}
					}
				}
			}, conf);
		}
	}
}

module.exports = {
	base: base
};
