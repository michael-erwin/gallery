// Video Details Page Box
var video_page_box = (function(){
    if(document.querySelector('#video_item_object')){
        var player = videojs("video_item_object",{"controls": true, "autoplay": false});
        $('#modal_media_details').on('hidden.bs.modal',player.pause.bind(player));
        return player;
    }
}());
