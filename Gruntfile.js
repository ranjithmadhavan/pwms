module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);


	var watchFiles = {
		clientViews: ['public/js/**/views/**/*.html'],
		clientJS: ['public/js/**/*.js', 'public/modules/**/*.js'],
		clientCSS: ['public/css/**/*.css']
	};

	grunt.initConfig({
		pkg : grunt.file.readJSON("package.json"),
		watch : {
			clientViews : {
				files : watchFiles.clientViews,
				options : {
					livereload : true
				}
			},
			clientJS : {
				files: watchFiles.clientJS,
				options : {
					livereload :true
				}
			},
			clientCSS : {
				files : watchFiles.clientCSS,
				options : {
					livereload:true
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
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

	grunt.registerTask('default',['concurrent:debug']);
}