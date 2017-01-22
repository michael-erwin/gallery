// Image Details Page Box
var photo_page_box = {
    objects: {
        main_box: $('.media-item-display .media-photo'),
        main_photo: $('.media-item-display .media-photo img'),
        fs_button: $('.media-item-display .media-photo .display-options span.fullscreen'),
        fs_x_button: $('#photo_fullscreen .exit-btn'),
        fs_content: $('#photo_fullscreen .display-content')
    },
    data: {
        fullscreen: false
    },
    init: function() {
        this.objects.main_box = $('.media-item-display .media-photo');
        this.objects.main_photo = $('.media-item-display .media-photo img');
        this.objects.fs_button = $('.media-item-display .media-photo .display-options span.fullscreen');
        this.objects.fs_x_button = $('#photo_fullscreen .exit-btn');
        this.objects.fs_content = $('#photo_fullscreen .display-content');

        this.objects.main_photo.unbind('load').on('load',this.stateLoaded.bind(this));
        this.objects.fs_button.unbind('click').on('click', this.goFullScreen.bind(this));
        this.objects.fs_x_button.unbind('click').on('click', this.exitFullScreen.bind(this));
    },
    render: function() {
        if(this.data.fullscreen) {
            var photo_url = this.objects.main_photo.attr('src');
            var content = '<img src="'+photo_url+'">';
            this.objects.fs_content.html(content);
            media_box.goFullScreen('photo_fullscreen');
        }
        else {
            this.objects.fs_content.html("");
            media_box.exitFullScreen();
        }
    },
    goFullScreen: function() {
        this.data.fullscreen = true;
        this.render();
    },
    exitFullScreen: function() {
        this.data.fullscreen = false;
        this.render();
    },
    stateLoaded: function() {
        this.objects.main_box.addClass('loaded');
    }
};
