var videomodal = (function(){
    var objects = {}
    objects.modal = $('#modal_video');
    objects.container = objects.modal.find('[data-id="container"]');
    objects.title = objects.modal.find('.title');
    objects.player = videojs("modal_video_player", { "controls": true, "autoplay": true, "preload": "metadata" });
    objects.timer = null;
    objects.link_now = null;

    var data = {}
    data.title = null;

    function open(e){
        e.preventDefault();
        var clicked = e.target;
        if(clicked.nodeName != "A") {
            clicked = $(clicked).parents("a.video-preview");
        }
        else {
            clicked = $(clicked);
        }
        objects.modal.modal('show');
        objects.player.src(clicked.attr('href'));
        data.title = clicked.attr('title');
        setTitle(data.title);
    }
    function setTitle(text) {
        objects.title.text(text).css('opacity',1);
        if(objects.timer) clearTimeout(objects.timer);
        objects.timer = setTimeout(function(){
            objects.title.css('opacity',0);
        },3500);
    }

    // Initialize
    objects.modal.on('shown.bs.modal', objects.player.play.bind(objects.player));
    objects.modal.on('hidden.bs.modal', objects.player.pause.bind(objects.player));
    objects.container.on('mousemove',function(){setTitle(data.title)});

    // Public
    return {
        open
    }
}());
