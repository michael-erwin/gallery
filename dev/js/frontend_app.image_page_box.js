// Image Details Page Box
var image_page_box = {
    objects: {
        main_box: $('.media-item-display .media-image'),
        main_image: $('.media-item-display .media-image img'),
        fs_button: $('.media-item-display .media-image .display-options span.fullscreen'),
        fs_x_button: $('#image_fullscreen .exit-btn'),
        fs_content: $('#image_fullscreen .display-content')
    },
    data: {
        fullscreen: false
    },
    init: function() {
        this.objects.main_box = $('.media-item-display .media-image');
        this.objects.main_image = $('.media-item-display .media-image img');
        this.objects.fs_button = $('.media-item-display .media-image .display-options span.fullscreen');
        this.objects.fs_x_button = $('#image_fullscreen .exit-btn');
        this.objects.fs_content = $('#image_fullscreen .display-content');

        this.objects.main_image.unbind('load').on('load',this.stateLoaded.bind(this));
        this.objects.fs_button.unbind('click').on('click', this.goFullScreen.bind(this));
        this.objects.fs_x_button.unbind('click').on('click', this.exitFullScreen.bind(this));
    },
    render: function() {
        if(this.data.fullscreen) {
            var image_url = this.objects.main_image.attr('src');
            var content = '<img src="'+image_url+'">';
            this.objects.fs_content.html(content);
            media_box.goFullScreen('image_fullscreen');
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
