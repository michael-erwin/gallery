var gulp = require('gulp');
var pref = require('gulp-autoprefixer');
var gcat = require('gulp-concat');
var bcss = require('gulp-cssbeautify');
var mcss = require('gulp-clean-css');
var mini = require('gulp-minify');
var name = require('gulp-rename');
var sass = require('gulp-sass');
var strp = require('gulp-strip-comments');
var ugli = require('gulp-uglify');
var pump = require('pump');

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

gulp.task('css',function(){
    /* Compile & minify backend css. */
    pump([
        gulp.src(['dev/scss/index-layout.scss','dev/scss/frontend-common.scss','dev/scss/backend.min.scss']),
        sass(),pref(),mcss(),
        gulp.dest('assets/css/')
    ]);
});

gulp.task('theme-js',function(){
    gulp.src('dev/cache/theme.js')
    .pipe(ugli())
    .pipe(gulp.dest('assets/js/'))
});

gulp.task('backend-js',function(){
    pump([
        gulp.src([
            'dev/js/backend.js',
            'dev/js/modals.js',
            'dev/js/video_modal.js',
            'dev/js/admin_page.content.js',
            'dev/js/admin_page.sidebar.js',
            'dev/js/admin_app.library.js',
            'dev/js/admin_app.photo_editor.js',
            'dev/js/admin_app.video_editor.js',
            'dev/js/admin_app.category.js',
            'dev/js/admin_app.category_editor.js',
            'dev/js/admin_app.category_selector.js',
            'dev/js/admin_app.file_widget.js',
            'dev/js/admin_app.uploader.js'
        ]),
        strp(),gcat('backend.js'),
        gulp.dest('assets/js/')
    ]);
});

gulp.task('frontend-js',function(){
    pump([
        gulp.src([
            'dev/js/frontend_app.utilities.js',
            'dev/js/frontend_app.favorites.js',
            'dev/js/frontend_app.results.js',
            'dev/js/frontend_app.media_box.js',
            'dev/js/frontend_app.modal_media.js',
            'dev/js/frontend_app.photo_page_box.js',
            'dev/js/frontend_app.video_page_box.js'
        ]),
        strp(),gcat('frontend-app.js'),
        gulp.dest('assets/js/')
    ]);
});

gulp.task('watch',function(){
    gulp.watch(
        ['dev/js/*','dev/scss/*.scss'],
        ['css','frontend-js','backend-js']
    );
});
gulp.task('default',['backend-css','frontend-js','backend-js']);
