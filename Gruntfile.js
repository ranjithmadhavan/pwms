module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		nodemon : {
			dev : {
				script : 'bin/www',
				options : {
					nodeArgs : ['--debug'],
					ignore : ['public/**'],
					ext : "js,ejs"
				}
			}
		}

	});

	grunt.registerTask('default',['nodemon'])
}