'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var pref = require('gulp-autoprefixer');
var bcss = require('gulp-cssbeautify');
var mcss = require('gulp-clean-css');
var pump = require('pump');
var gcat = require('gulp-concat');

gulp.task('theme-css',function(){
    /* Combine & minify theme css. */
    pump([
        gulp.src([
            'dev/css/theme/admin.css',
            'dev/css/theme/admin-skin.css'
        ]),
        mcss(),gcat('theme.min.css'),
        gulp.dest('assets/css/')
    ]);
});

gulp.task('backend-css',function(){
    /* Compile & minify backend css. */
    pump([
        gulp.src('dev/scss/backend.min.scss'),
        sass(),pref(),mcss(),
        gulp.dest('assets/css/')
    ]);
});

gulp.task('default',['backend-css']);
