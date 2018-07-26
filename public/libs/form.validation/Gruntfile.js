module.exports = function(grunt) {
    grunt.initConfig({
        // ~~~~~~~~~
        // Variables
        // ~~~~~~~~~

        pkg: grunt.file.readJSON('package.json'),

        dirs: {
            src: 'src',
            dist: 'dist',
            test: 'test',
            vendor: 'vendor'
        },

        // The host that servers the demo and test directories
        host: 'http://fv.dev',

        banner: [
            '/*!',
            ' * FormValidation (<%= pkg.homepage %>)',
            ' * <%= pkg.description %>',
            ' *',
            ' * @version     v<%= pkg.version %>, built on <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>',
            ' * @author      <%= pkg.author.url %>',
            ' * @copyright   (c) 2013 - 2015 Nguyen Huu Phuoc',
            ' * @license     <%= pkg.homepage %>/license/',
            ' */\n'
        ].join('\n'),

        // ~~~~
        // Tasks
        // ~~~~

        copy: {
            main: {
                files: [
                    { cwd: '<%= dirs.src %>/css', src: '**', dest: '<%= dirs.dist %>/css', expand: true, flatten: true, filter: 'isFile' },
                    { cwd: '<%= dirs.src %>/js/language', src: '**', dest: '<%= dirs.dist %>/js/language', expand: true, flatten: true, filter: 'isFile' },
                    { cwd: '<%= dirs.src %>/js/framework', src: '**', dest: '<%= dirs.dist %>/js/framework', expand: true, flatten: true, filter: 'isFile' }
                ]
            }
        },

        cssmin: {
            minify: { expand: true, cwd: '<%= dirs.src %>/css/', src: ['*.css'], dest: '<%= dirs.dist %>/css/', ext: '.min.css' },
            add_banner: {
                options: {
                    stripBanners: true,
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= dirs.dist %>/css/formValidation.min.css': ['<%= dirs.src %>/css/formValidation.css']
                }
            }
        },

        concat: {
            base: {
                options: {
                    separator: ';',
                    stripBanners: true,
                    banner: '<%= banner %>'
                },
                src: ['<%= dirs.src %>/js/base.js', '<%= dirs.src %>/js/helper.js', '<%= dirs.src %>/js/validator/*.js'],
                dest: '<%= dirs.dist %>/js/formValidation.js'
            },
            bootstrap: {
                options: {
                    separator: ';',
                    stripBanners: true,
                    banner: '<%= banner %>'
                },
                src: ['<%= dirs.src %>/js/framework/bootstrap.js'],
                dest: '<%= dirs.dist %>/js/framework/bootstrap.js'
            },
            foundation: {
                options: {
                    separator: ';',
                    stripBanners: true,
                    banner: '<%= banner %>'
                },
                src: ['<%= dirs.src %>/js/framework/foundation.js'],
                dest: '<%= dirs.dist %>/js/framework/foundation.js'
            },
            pure: {
                options: {
                    separator: ';',
                    stripBanners: true,
                    banner: '<%= banner %>'
                },
                src: ['<%= dirs.src %>/js/framework/pure.js'],
                dest: '<%= dirs.dist %>/js/framework/pure.js'
            },
            semantic: {
                options: {
                    separator: ';',
                    stripBanners: true,
                    banner: '<%= banner %>'
                },
                src: ['<%= dirs.src %>/js/framework/semantic.js'],
                dest: '<%= dirs.dist %>/js/framework/semantic.js'
            },
            uikit: {
                options: {
                    separator: ';',
                    stripBanners: true,
                    banner: '<%= banner %>'
                },
                src: ['<%= dirs.src %>/js/framework/uikit.js'],
                dest: '<%= dirs.dist %>/js/framework/uikit.js'
            },
            test: {
                src: ['<%= dirs.test %>/spec/*.js', '<%= dirs.test %>/spec/validator/*.js'],
                dest: '<%= dirs.test %>/spec.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            base: {
                src: ['<%= dirs.dist %>/js/formValidation.js'],
                dest: '<%= dirs.dist %>/js/formValidation.min.js'
            },
            bootstrap: {
                src: ['<%= dirs.dist %>/js/framework/bootstrap.js'],
                dest: '<%= dirs.dist %>/js/framework/bootstrap.min.js'
            },
            foundation: {
                src: ['<%= dirs.dist %>/js/framework/foundation.js'],
                dest: '<%= dirs.dist %>/js/framework/foundation.min.js'
            },
            pure: {
                src: ['<%= dirs.dist %>/js/framework/pure.js'],
                dest: '<%= dirs.dist %>/js/framework/pure.min.js'
            },
            semantic: {
                src: ['<%= dirs.dist %>/js/framework/semantic.js'],
                dest: '<%= dirs.dist %>/js/framework/semantic.min.js'
            },
            uikit: {
                src: ['<%= dirs.dist %>/js/framework/uikit.js'],
                dest: '<%= dirs.dist %>/js/framework/uikit.min.js'
            }
        },

        jasmine: {
            src: '<%= dirs.dist %>/js/**/*.js',
            options: {
                specs: '<%= dirs.test %>/spec/**/*.js',
                host: '<%= host %>',
                vendor: [
                    '<%= dirs.vendor %>/jquery/jquery.min.js',
                    '<%= dirs.vendor %>/bootstrap/js/bootstrap.min.js'
                ],
                helpers: '<%= dirs.test %>/helper.js'
            }
        },

        jshint: {
            all: [
                '<%= dirs.src %>/js/**/*.js'
            ],
            options: {
                browser: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                es3: true,
                expr: true,
                laxbreak: true,   // Allow line breaking before && or ||
                loopfunc: true,
                newcap: true,
                noarg: true,
                onevar: true,
                sub: true,
                undef: true,
                white: true,
                globals: {
                    jQuery: false,
                    FormValidation: false
                }
            }
        },

        watch: {
            source: {
                files: ['<%= dirs.src %>/css/**', '<%= dirs.src %>/js/**'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            },
            test: {
                files: ['<%= dirs.test %>/spec/**'],
                tasks: ['concat:test']
            }
        }
    });

    grunt.registerTask('default', 'build');
    grunt.registerTask('build',   ['copy', 'cssmin', 'concat', 'uglify']);
    grunt.registerTask('test',    ['jshint', 'jasmine']);

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
