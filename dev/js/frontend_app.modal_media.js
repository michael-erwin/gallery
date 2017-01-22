// Media Modal
var modal_media = {
    objects: {
        self: $('#modal_media_details'),
        content_body: $('#modal_media_details .media-item-display'),
        media_box: $('#modal_media_details .media-block .media'),
        info_box: $('#modal_media_details .info-block .info')
    },
    open: function(e){
        e.preventDefault();
        var thumb = $(e.target).parents('.thumb');
        var data = JSON.parse(thumb.attr('data-data'));
        var type = thumb.attr('data-media')+'s';
        var contents = this.buildTable(data,type);
        this.objects.self.modal('show');
        this.objects.content_body.addClass('loading');
        this.objects.media_box.removeClass('media-photo media-video');
        setTimeout(function(){
            this.objects.content_body.removeClass('loading');
            this.objects.info_box.html(contents);
            if(type == "photos") {
                var photo_link = site.base_url+'photos/preview/lg/'+(data.title).replace(' ','-')+'-'+data.uid;
                this.objects.media_box.removeClass('media-video').addClass('media-photo');
                photo_page_box.init.call(photo_page_box);
                photo_page_box.objects.main_photo.attr('src',photo_link);
            }
            else if(type == "videos") {
                //var video_link = site.base_url+'videos/preview/'+(data.title).replace(' ','-')+'-'+data.uid;
                var video_link = site.base_url+'media/videos/public/480p/'+data.uid+'.mp4';
                var video_poster = site.base_url+'media/videos/public/480/'+data.uid+'.jpg';
                this.objects.media_box.removeClass('media-photo').addClass('media-video');
                video_page_box.poster(video_poster);
                video_page_box.src(video_link);
                video_page_box.play();
            }
        }.bind(this),500);
        //console.log(contents);
    },
    buildTable: function(data,type) {
        var tags = (data.tags).split(' ');
        var tag_html = "";
        for(var i=0;i<tags.length;i++) {
            var tag_seo_link = site.base_url+'search/'+type+'?kw='+tags[i];
            tag_html += '<a class="label label-default" href="'+tag_seo_link+'">'+tags[i]+'</a>&nbsp;';
        }
        var table =
            '<table class="table table-bordered">'+
                '<thead>'+
                    '<tr><th colspan="2">Details</th></tr>'+
                '</thead>'+
                '<tbody>'+
                    '<tr><td>Title</td><td>'+data.title+'</td></tr>'+
                    '<tr><td>Description</td><td>'+data.description+'</td></tr>'+
                    '<tr><td>Dimension</td><td>'+data.width+'x'+data.height+'</td></tr>'+
                    '<tr><td>File size</td><td>'+formatSizeUnits(data.file_size)+'</td></tr>'+
                '</tbody>'+
            '</table>'+
            '<table class="table table-bordered">'+
                '<thead>'+
                    '<tr><th>Tags</th></tr>'+
                '</thead>'+
                '<tbody>'+
                    '<tr><td>'+
                        tag_html+
                    '</td></tr>'+
                '</tbody>'+
            '</table>';
        return table;
    }
};
