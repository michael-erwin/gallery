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
        this.objects.media_item_box = $('#media_item_display');
        this.objects.loading = this.self.find('[data-id="loading"]');

        // Attach events
        this.objects.pagination_index.unbind().on('keypress',this.goPage.bind(this))
                                     .on('paste',function(){return false});
        this.objects.search_type_options.unbind().on('click',this.pickType.bind(this));
        this.objects.search_form.unbind().on('submit',this.getData.bind(this));
        this.objects.pagination_prev.unbind().on('click',this.prevPage.bind(this));
        this.objects.pagination_next.unbind().on('click',this.nextPage.bind(this));
        this.attachThumbActions();
    },
    getData: function(e) {
        if(e) {
            e.preventDefault();
            this.data.route = "search";
            var get_url = site.base_url+"search/"+this.data.type;
            this.data.keywords = this.objects.search_form.find('[name="kw"]').val();
            var data = {
                kw: this.data.keywords,
                p: 1,
                l: this.data.page.limit,
                m: 'json'
            };
        }
        else if(this.data.route == "search") {
            var get_url = site.base_url+"search/"+this.data.type;
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
                this.data.page_meta = response.page_meta;
                this.document.animate({scrollTop: "0px"},300,this.render.bind(this));
            }
        });
        //}).bind(this));
    },
    render: function(){
        var entries = this.data.items.entries;
        var html = "";
        document.title = this.data.page_meta.title;
        if(entries.length > 0){
            if(this.data.type == "images") {
                for(var image in entries) {
                    var image = entries[image];
                    var data = JSON.stringify(image);
                    var thumb = site.base_url+'media/images/public/256/'+image.uid+'.jpg';
                    var seo_link = image.title.split(' ');
                    seo_link = site.base_url+'images/item/'+seo_link.join('-')+'-'+image.uid;
                    html += '<div class="thumb-box col-md-3 col-sm-4 col-xs-6">'+
                                '<div class="thumb" data-data=\''+data.replace("'","")+'\' data-media="image">'+
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
                    var thumb = site.base_url+'media/videos/public/256/'+video.uid+'.jpg';
                    var seo_link = site.base_url+'videos/item/'+video.title.replace(' ','-')+'-'+video.uid;
                    html += '<div class="thumb-box col-md-3 col-sm-4 col-xs-6">'+
                                '<div class="thumb" data-data=\''+data.replace("'","")+'\' data-media="video">'+
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
        this.objects.media_item_box.html('');
        this.objects.thumbs_box.html(html);
        // Update url.
        var current_uri = "";
        if(this.data.route == "search") {
            current_uri = site.base_url+'search/'+this.data.type+'?kw='+this.data.keywords+'&p='+this.data.page.current;
        }
        else if(this.data.route == "categories") {
            current_uri = site.base_url+'categories/'+this.data.category_name+'-'+this.data.category_id+'/'+this.data.type+'/'+this.data.page.current;
        }
        history.replaceState(null, null, current_uri);
        // Bind events.
        this.attachThumbActions();
    },
    attachThumbActions: function() {
        /*this.objects.thumbs_box.find('a.image-preview').fullsizable({
            detach_id: 'thumbs_display',
            clickBehaviour: 'next'
        });*/
        //if(typeof videomodal !== "undefined") this.objects.thumbs_box.find('a.video-preview').unbind('click').click(videomodal.open);
        this.objects.thumbs_box.find('a').unbind('click').click(modal_media.open.bind(modal_media));
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
};
