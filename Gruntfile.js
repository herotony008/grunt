//wrapper包含整个Grunt配置信息
module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);
	//初始化configuration对象

	grunt.initConfig({ 
		//从package.json文件读入项目配置信息
		pkg:grunt.file.readJSON('package.json'),
		meta: {
			name:'app',
	        basePath: 'app',
	        sassPath: 'app/_source/sass',
	        cssPath: 'app/css',
	        jsPath:'app/js',
	        imagesPath:'app/images',
	        imgPath:'app/img'
	    },
	    dist: {
	        basePath: 'dist',
	        sassPath: 'dist/_source/sass',
	        cssPath: 'dist/css',
	        jsPath:'dist/js',
	        imagesPath:'dist/images',
	        imgPath:'dist/img'
	    },
	    copy: {
		  dist: {
		    files: [
		    	{
			      	expand: true,
                	dot: true,
			      	cwd: '<%= meta.basePath %>/', 
			      	src: [ '*.htm','*.html','**/*.js'],
			      	dest: '<%= dist.basePath %>/'
		    	}
		    ]
		  }
		},
		clean: {
		  build: {
		    src: ["<%= dist.basePath %>"]
		  }
		},
	    concat: {
            options: {
                //文件内容的分隔符
                separator: ';'
            },
            dist: {
                src: ['<%= meta.jsPath %>/index.js','<%= meta.jsPath %>/index2.js','<%= meta.jsPath %>/index3.js'],
                dest: '<%= dist.jsPath %>/index.js'
            }
        },        
        uglify: {
            options: {
                banner: '/*! <%= meta.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'//添加banner
            },
            dist: {//合并压缩
            	options: {
                    mangle: false, //不混淆变量名
                    preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer:'\n/*! <%= meta.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
                },
                files: {
                    '<%= dist.jsPath %>/index.min.js': ['<%= meta.jsPath %>/index.js','<%= meta.jsPath %>/index2.js','<%= meta.jsPath %>/index3.js']
                }
            }
        },
        compass: {               
		    meta: {
			    options: {          
		        sassDir: '<%= meta.sassPath %>/',
		        cssDir: '<%= meta.cssPath %>/',
		        relativeAssets:true,
		        noLineComments: true,
		        outputStyle:'compact',
		        sourcemap: false
		      }
		    }
		},
		sass :{
			meta: {
				options: {
					noCache: true,
					sourcemap:'none',
					style: 'expanded'
				},
				files: [{
			        expand: true,
			        cwd: '<%= meta.sassPath %>/',
			        src: ['*.scss'],
			        dest: '<%= meta.cssPath %>/',
			        ext: '.css'
			    }]
			}
		},
		autoprefixer : {
			options: {
		        browsers: ['> 0.5%', 'last 2 versions', 'Firefox < 20'],
		        map: false
		    },
           	build: {
			    expand: true,
			    cwd: '<%= meta.cssPath %>',
			    src: [ '**/*.css' ],
			    dest: '<%= meta.cssPath %>'
			}
        },
		csscomb :{
			meta :{
				expand: true,
	            cwd: '<%= meta.cssPath %>/',
	            src: ['*.css', '!*.comb.css'],
	            dest: '<%= meta.cssPath %>/',
	            ext: '.css'
			}
		},
		cssmin :{
			options :{
				advanced:false,
				compatibility : '*' //默认ie9+  //ie7，ie8
			},
		  	dist: {
			    files: [{
			      expand: true,
			      cwd: '<%= meta.cssPath %>/',
			      src: ['*.css', '!*.min.css'],
			      dest: '<%= dist.cssPath %>/',
			      ext: '.css'
			    }]
		    }
		},
		imagemin :{
			dist: {
				options: {
			        optimizationLevel: 3
			    },
			    files: [{
			        expand: true,
			        cwd: '<%= meta.imagesPath %>/',            
			        src: ['*.{png,jpg,gif}'],
			        dest: '<%= dist.imagesPath %>/'
			    },{
			      	expand: true,
			        cwd: '<%= meta.imgPath %>/',
			        src: ['**/*.{png,jpg,gif}'],
			        dest: '<%= dist.imgPath %>/'
			    }]
		    }
		},
		watch: {
		    options: {
		      livereload: true,
		    },
		    css: {
		      files: ['<%= meta.sassPath %>/*.scss'],
		      tasks: ['compass'],
		    },
		}
	});

	/*grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');*/

	grunt.registerTask('default','开发模式',['clean','copy','uglify','compass','autoprefixer','watch']);

	grunt.registerTask('clear',['clean']);

	grunt.registerTask('build','生产模式',['clean','copy','uglify','compass','autoprefixer','csscomb','cssmin','imagemin']);

};