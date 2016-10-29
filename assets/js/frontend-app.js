// Results App
var results = {
    document: $('body'),
    self: $('#results_app'),
    data: {
        type: 'images',
        keywords: '',
        category_name: '',
        category_id: '',
        crumbs: {'Home': ""},
        route: 'search',
        page: {
            current: 1,
            total: 0,
            limit: 20
        },
        items: {
            entries: [],
            total: 0
        }
    },
    objects: {
        breadcrumbs: null,
        search_form: null,
        search_type_display: null,
        search_type_options: null,
        pagination: null,
        pagination_index: null,
        pagination_total: null,
        pagination_prev: null,
        pagination_next: null,
        thumbs_box: null,
        category_thumbs_box: null,
        loading: null
    },
    init: function(){
        // Cache DOM objects.
        String.prototype.UCFirst = function() {
            // Capitalize first letter of a string.
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
        this.self = $('#results_app');
        this.objects.breadcrumbs = this.self.find('[data-id="breadcrumbs"]');
        this.objects.search_form = this.self.find('[data-id="search_form"]');
        this.objects.search_type_display = this.self.find('[data-id="search_box_display"]');
        this.objects.search_type_options = this.self.find('[data-id="search_box_option"]');
        this.objects.pagination = this.self.find('.m-pagination');
        this.objects.pagination_index = this.self.find('.m-pagination .index');
        this.objects.pagination_total = this.self.find('.m-pagination .total');
        this.objects.pagination_prev = this.self.find('.m-pagination button.prev');
        this.objects.pagination_next = this.self.find('.m-pagination button.next');
        this.objects.thumbs_box = this.self.find('[data-id="thumbs"]');
        this.objects.category_thumbs_box = $('#category_thumbs_display');
        this.objects.loading = this.self.find('[data-id="loading"]');

        // Attach events
        this.objects.pagination_index.unbind().on('keypress',this.goPage.bind(this))
                                     .on('paste',function(){return false});
        this.objects.search_type_options.unbind().on('click',this.pickType.bind(this));
        this.objects.search_form.unbind().on('submit',this.getData.bind(this));
        this.objects.pagination_prev.unbind().on('click',this.prevPage.bind(this));
        this.objects.pagination_next.unbind().on('click',this.nextPage.bind(this));
        this.objects.thumbs_box.find('a.image-preview').fullsizable({
            detach_id: 'thumbs_display',
            clickBehaviour: 'next'
        });
        if(typeof videomodal !== "undefined") this.objects.thumbs_box.find('a.video-preview').unbind('click').click(videomodal.open);
        this.objects.thumbs_box.find('[data-id="favorites"]').unbind('click').click(favorites.add.bind(favorites));
        this.objects.thumbs_box.find('[data-id="download"]').unbind('click').click(this.download.bind(this));
    },
    getData: function(e) {
        if(e) {
            e.preventDefault();
            this.data.route = "search";
            var get_url = "/search/"+this.data.type;
            this.data.keywords = this.objects.search_form.find('[name="kw"]').val();
            var data = {
                kw: this.data.keywords,
                p: 1,
                l: this.data.page.limit,
                m: 'json'
            };
        }
        else if(this.data.route == "search") {
            var get_url = "/search/"+this.data.type;
            this.data.keywords = this.objects.search_form.find('[name="kw"]').val();
            var data = {
                kw: this.data.keywords,
                p: this.data.page.current,
                l: this.data.page.limit,
                m: 'json'
            };
        }
        else if(this.data.route == "categories") {
            var get_url = "/categories/"+this.data.category_name+'-'+this.data.category_id+'/'+this.data.type+'/'+this.data.page.current;
            var data = {
                l: this.data.page.limit,
                m: 'json'
            };
        }
        //this.document.animate({scrollTop: "0px"},300,(function(){ 
        $.ajax({
            type: "get",
            url: get_url,
            context: this,
            data: data,
            dataType: "json",
            success: function(response) {
                this.data.crumbs = response.crumbs;
                this.data.page = response.page;
                this.data.items = response.items;
                this.document.animate({scrollTop: "0px"},300,this.render.bind(this));
            }
        });
        //}).bind(this));
    },
    render: function(){
        var entries = this.data.items.entries;
        var html = "";
        if(entries.length > 0){
            if(this.data.type == "images") {
                for(var image in entries) {
                    var image = entries[image];
                    var data = JSON.stringify(image);
                    var thumb = '//'+location.host+'/media/images/public/256/'+image.uid+'.jpg';
                    var seo_link = image.title.split(' ');
                    seo_link = '//'+location.host+'/images/preview/lg/'+seo_link.join('-')+'-'+image.uid;
                    html += '<div class="thumb-box col-md-3 col-sm-4 col-xs-6">'+
                                '<div class="thumb" data-data=\''+data+'\' data-media="image">'+
                                    '<a title="'+image.title+'" class="image-link image-preview" href="'+seo_link+'" style="background-image:url(\''+thumb+'\')">'+
                                        '<img src="'+thumb+'" />'+
                                    '</a>'+
                                    '<div class="title">'+
                                        '<span>'+image.title+'</span>'+
                                    '</div>'+
                                    '<div class="options">'+
                                        '<b title="Download" data-id="download"><i class="fa fa-lg fa-download"></i></b>'+
                                        '<b title="Add to favorites" data-id="favorites"><i class="fa fa-lg fa-star"></i></b>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
                }
            }
            else if(this.data.type == "videos") {
                for(var video in entries) {
                    var video = entries[video];
                    var data = JSON.stringify(video);
                    var thumb = '//'+location.host+'/media/videos/public/256/'+video.uid+'.jpg';
                    var seo_link = video.title.split(' ');
                    seo_link = '//'+location.host+'/videos/preview/'+seo_link.join('-')+'-'+video.uid;
                    html += '<div class="thumb-box col-md-3 col-sm-4 col-xs-6">'+
                                '<div class="thumb" data-data=\''+data+'\' data-media="video">'+
                                    '<a title="'+video.title+'" class="image-link video-preview" href="'+seo_link+'" style="background-image:url(\''+thumb+'\')">'+
                                        '<img src="'+thumb+'" />'+
                                    '</a>'+
                                    '<div class="title">'+
                                        '<span>'+video.title+'</span>'+
                                    '</div>'+
                                    '<div class="options">'+
                                        '<b title="Download" data-id="download"><i class="fa fa-lg fa-download"></i></b>'+
                                        '<b title="Add to favorites" data-id="favorites"><i class="fa fa-lg fa-star"></i></b>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
                }
            }
        }
        else {
            html = '<div class="alert alert-warning">No results.</div>';
        }
        // Update breadcrumbs.
        var breadcrumbs = "";
        for(var crumb in this.data.crumbs){
            if(this.data.crumbs[crumb] != "") {
                breadcrumbs += '\n<li><a href="'+this.data.crumbs[crumb]+'">'+crumb+'</a></li>';
            }
            else {
                breadcrumbs += '\n<li><a class="active">'+crumb+'</a></li>';
            }
        }
        this.objects.breadcrumbs.html('<ol class="breadcrumb">'+breadcrumbs+'</ol>');
        // Update pagination.
        this.objects.pagination_total.text(this.data.page.total);
        if(this.data.page.current < this.data.page.total) {
            this.objects.pagination_next.prop('disabled', false);
        }
        else {
            this.objects.pagination_next.prop('disabled', true);
        }
        if(this.data.page.current > 1) {
            this.objects.pagination_prev.prop('disabled', false);
        }
        else {
            this.objects.pagination_prev.prop('disabled', true);
        }
        if(this.data.page.total == 0) {
            this.objects.pagination_index.prop('disabled', true);
        }
        else {
            this.objects.pagination_index.prop('disabled', false);
        }
        this.objects.pagination_index.val(this.data.page.current);
        // Update results.
        this.objects.category_thumbs_box.html('');
        this.objects.thumbs_box.html(html);
        // Update url.
        var current_uri = "";
        if(this.data.route == "search") {
            current_uri = '/search/'+this.data.type+'?kw='+this.data.keywords+'&p='+this.data.page.current;
        }
        else if(this.data.route == "categories") {
            current_uri = '/categories/'+this.data.category_name+'-'+this.data.category_id+'/'+this.data.type+'/'+this.data.page.current;
        }
        history.replaceState(null, null, current_uri);
        // Bind events.
        this.objects.thumbs_box.find('a.image-preview').fullsizable({
            detach_id: 'thumbs_display',
            clickBehaviour: 'next'
        });
        this.objects.thumbs_box.find('a.video-preview').unbind('click').click(videomodal.open);
        this.objects.thumbs_box.find('[data-id="favorites"]').unbind('click').click(favorites.add.bind(favorites));
        this.objects.thumbs_box.find('[data-id="download"]').unbind('click').click(this.download.bind(this));
    },
    pickType: function(e){
        var self = $(e.target);
        var parent = self.parent('li');
        var type = parent.attr('data-value');
        this.objects.search_type_options.removeClass("selected");
        parent.addClass("selected");
        this.objects.search_type_display.text(type.UCFirst());
        this.data.type = type;
        this.objects.search_form.find('[name="type"]').val(type);
        self.parents('div.search-types').blur();
    },
    prevPage: function(){
        if(this.data.page.current > 1) {
            this.data.page.current -= 1;
            this.getData();
        }
    },
    goPage: function(e){
        if(e.keyCode < 48 || e.keyCode > 57){
            if(e.keyCode == 13){
                this.data.page.current = $(e.target).val();
                this.getData();
            }
            else{
                return false;
            }
        }
        else{
            console.log(e.target.value);
        }
    },
    nextPage: function(){
        if(this.data.page.current < this.data.page.total) {
            this.data.page.current += 1;
            this.getData();
        }
    },
    scrollToTop(){
        this.document.animate({scrollTop: "0px"},300,function(){
            //$('#thumbs_display .ajax-loader').css('display','block');
            //$('body').addClass('loading');
        });
    },
    download: function(e) {
        var thumb = $(e.target).parents(".thumb");
        var type = thumb.attr("data-media");
        if(type == "image") {
            var data = JSON.parse(thumb.attr("data-data"));
            window.open('//'+location.host+'/images/download/'+data.uid,'_blank');
        }
        if(type == "video") {
            var data = JSON.parse(thumb.attr("data-data"));
            window.open('//'+location.host+'/videos/download/'+data.uid,'_blank');
        }
    }
}
var favorites = {
    self: null,
    objects: {
        action_box: null,
        photos: null,
        videos: null,
        badge_photos: null,
        badge_videos: null,
        modal: null,
        modal_body: null
    },
    data: {
        photos: [],
        videos: []
    },
    init: function() {
        this.objects.action_box = $('#actions');
        this.self = $('#menu_favorites');
        this.objects.photos = this.self.find('[data-id="photos"]');
        this.objects.videos = this.self.find('[data-id="videos"]');
        this.objects.badge_photos = this.self.find('[data-id="fav_badge_photos"]');
        this.objects.badge_videos = this.self.find('[data-id="fav_badge_videos"]');
        this.objects.modal = $('#modal_favorites');
        this.objects.modal_title = $('#modal_favorites h4.modal-title');
        this.objects.modal_body = $('#modal_favorites [data-id="contents"]');

        var stored_data = this.getCookie('favorites');
        if(stored_data) {
            stored_data = JSON.parse(stored_data);
            this.data = stored_data;
        }
        this.render.call(this);
    },
    render() {
        // Item count display.
        if(this.data.photos.length > 0) {
            this.objects.badge_photos.text(this.data.photos.length).css('display','inline');
        }
        else {
            this.objects.badge_photos.text(this.data.photos.length).css('display','none');
        }
        if(this.data.videos.length > 0) {
            this.objects.badge_videos.text(this.data.videos.length).css('display','inline');
        }
        else {
            this.objects.badge_videos.text(this.data.videos.length).css('display','none');
        }
        // Update cookie value.
        this.setCookie();
        // Event bindings.
        this.objects.photos.unbind('click').on('click',this.fetch.bind(this));
        this.objects.videos.unbind('click').on('click',this.fetch.bind(this));
    },
    add: function(e) {
        var parent_thumb = $(e.target).parents('.thumb');
        var parent_data = JSON.parse(parent_thumb.attr('data-data'));
        var media_type = parent_thumb.attr('data-media');
        if(media_type == "image") {
            var existed = $.inArray(parent_data.id,this.data.photos);
            if(existed === -1) {
                this.data.photos.push(parent_data.id);
                toastr["success"]("Item \""+parent_data.title+"\" added to favorites.");
                this.setCookie();
                this.render();
            }
            else {
                toastr["info"]("Item \""+parent_data.title+"\" already exist.");
            }
        }
        if(media_type == "video") {
            var existed = $.inArray(parent_data.id,this.data.videos);
            if(existed === -1) {
                this.data.videos.push(parent_data.id);
                toastr["success"]("Item \""+parent_data.title+"\" added to favorites.");
                this.setCookie();
                this.render();
            }
            else {
                toastr["info"]("Item \""+parent_data.title+"\" already exist.");
            }
        }
    },
    remove: function(e) {
        var parent_item = $(e.target).parents('.item');
        var id = parent_item.attr('data-id');
        var type = parent_item.attr('data-type');
        if(type == "photo") {
            var index = $.inArray(id,this.data.photos);
            this.data.photos.splice(index,1);
            this.render();
            parent_item.remove();
            if(this.data.photos.length == 0) {
                this.objects.modal.modal('hide');
            }
        }
        else if(type == "video") {
            var index = $.inArray(id,this.data.videos);
            this.data.videos.splice(index,1);
            this.render();
            parent_item.remove();
            if(this.data.videos.length == 0) {
                this.objects.modal.modal('hide');
            }
        }
    },
    getCookie: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
    setCookie: function() {
        var d = new Date();
        d.setDate(d.getDate()+14);
        var expires = "; expires="+ d.toUTCString();
        var path = "; path=/";
        document.cookie = "favorites="+JSON.stringify(this.data)+expires+path;
    },
    fetch: function(e) {
        var media_type = $(e.target).attr('data-id');
        if(media_type == "photos") {
            if(this.data.photos.length > 0) {
                var loading = '<div class="favorites-loading"><img src="/assets/img/hourglass.gif" /></div>';
                this.objects.modal_title.text('My Favorites (Images)');
                this.objects.modal_body.html(loading);
                this.objects.modal.modal('show');
                $.ajax({
                    type: "get",
                    context: this,
                    url: "/images/info?id="+this.data.photos.join(','),
                    context: this,
                    success: function(response) {
                        var data = response.data;
                        var thumbs = "";
                        if(!data.length) {
                            var seo_link = data.title.split(' ');
                            thumbs +=
                            '<div class="item col-xs-6 col-sm-4 col-md-3" data-type="photo" data-id="'+data.id+'">'+
                                '<a class="favorites-img-preview" title="'+data.title+'" href="/images/preview/lg/'+seo_link.join('-')+'-'+data.uid+'" target="_blank" style="background-image:url(/media/images/public/128/'+data.uid+'.jpg)"></a>'+
                                '<div class="controls">'+
                                    '<a class="remove-button" title="Remove"><span class="glyphicon glyphicon-remove"></span></a>'+
                                '</div>'+
                            '</div>';
                        }
                        else if(data.length > 0) {
                            for(var x=0; x<data.length; x++) {
                                var seo_link = data[x].title.split(' ');
                                thumbs +=
                                '<div class="item col-xs-6 col-sm-4 col-md-3" data-type="photo" data-id="'+data[x].id+'">'+
                                    '<a class="favorites-img-preview" title="'+data[x].title+'" href="/images/preview/lg/'+seo_link.join('-')+'-'+data[x].uid+'" target="_blank" style="background-image:url(/media/images/public/128/'+data[x].uid+'.jpg)"></a>'+
                                    '<div class="controls">'+
                                        '<a class="remove-button" title="Remove"><span class="glyphicon glyphicon-remove"></span></a>'+
                                    '</div>'+
                                '</div>';
                            }
                        }
                            
                        this.objects.modal_body.html(thumbs);
                        this.objects.modal_body.find("a.remove-button").unbind("click").click(this.remove.bind(this));
                        this.objects.modal.modal('show');
                    }
                });
            }
        }
        else if(media_type == "videos") {
            if(this.data.videos.length > 0) {
                var loading = '<div class="favorites-loading"><img src="/assets/img/hourglass.gif" /></div>';
                this.objects.modal_title.text('My Favorites (Videos)');
                this.objects.modal_body.html(loading);
                this.objects.modal.modal('show');
                $.ajax({
                    type: "get",
                    url: "/videos/info?id="+this.data.videos.join(','),
                    context: this,
                    success: function(response) {
                        var data = response.data;
                        var thumbs = "";
                        if(!data.length) {
                            var seo_link = data.title.split(' ');
                            thumbs +=
                            '<div class="item col-xs-6 col-sm-4 col-md-3" data-type="video" data-id="'+data.id+'">'+
                                '<a class="favorites-img-preview" title="'+data.title+'" href="/videos/preview/'+seo_link.join('-')+'-'+data.uid+'" target="_blank" style="background-image:url(/media/videos/public/128/'+data.uid+'.jpg)"></a>'+
                                '<div class="controls">'+
                                    '<a class="remove-button" title="Remove"><span class="glyphicon glyphicon-remove"></span></a>'+
                                '</div>'+
                            '</div>';
                        }
                        else if(data.length > 0) {
                            for(var x=0; x<data.length; x++) {
                                var seo_link = data[x].title.split(' ');
                                thumbs +=
                                '<div class="item col-xs-6 col-sm-4 col-md-3" data-type="video" data-id="'+data[x].id+'">'+
                                    '<a class="favorites-img-preview" title="'+data[x].title+'" href="/videos/preview/'+seo_link.join('-')+'-'+data[x].uid+'" target="_blank" style="background-image:url(/media/videos/public/128/'+data[x].uid+'.jpg)"></a>'+
                                    '<div class="controls">'+
                                        '<a class="remove-button" title="Remove"><span class="glyphicon glyphicon-remove"></span></a>'+
                                    '</div>'+
                                '</div>';
                            }
                        }
                            
                        this.objects.modal_body.html(thumbs);
                        this.objects.modal_body.find("a.remove-button").unbind("click").click(this.remove.bind(this));
                        this.objects.modal.modal('show');
                    }
                });
            }
        }
    }
}