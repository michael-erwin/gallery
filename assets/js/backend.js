
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var admin_page = {};
var admin_app = {};


 var modal = {
    "message" : function(message,fn_ok) {
        $('#modal_message').modal('show');
        $('#modal_message .modal-body').text(message);
        var ok_btn = $('#modal_message [data-btn="ok"]');
        if(fn_ok){
            ok_btn.unbind('click').click(function(){
                fn_ok();
                $('#modal_message').modal('hide');
            });
        }
        else{
            ok_btn.unbind('click').click(function(){
                $('#modal_message').modal('hide');
            });
        }
    },
    "confirm" : function(message,fn_yes,fn_no) {
        $('#modal_confirm').modal('show');
        $('#modal_confirm .modal-body').text(message);
        var yes_btn = $('#modal_confirm [data-btn="yes"]');
        if(fn_yes){
            yes_btn.unbind('click').click(function(){
                fn_yes();
                $('#modal_confirm').modal('hide');
            });
            if(fn_no) $('#modal_confirm').unbind('hide.bs.modal').on('hide.bs.modal', fn_no);
        }
        else{
            yes_btn.unbind('click').click(function(){
                $('#modal_confirm').modal('hide');
            });
            $('#modal_confirm').unbind('hide.bs.modal');
        }
    }
 }

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

    objects.modal.on('shown.bs.modal', objects.player.play.bind(objects.player));
    objects.modal.on('hidden.bs.modal', objects.player.pause.bind(objects.player));
    objects.container.on('mousemove',function(){setTitle(data.title)});

    return {
        open
    }
}());

admin_page.content =
{
    get: function(e, ob = null) {
        e.preventDefault();
        if(!ob) var ob = this;
        var url_clean = ob;
        var url_pieces = ob.pathname.split('/admin');
        var url_hash = url_pieces[url_pieces.length-1];
        $.ajax({
            method: "get",
            url: url_clean+'/json',
            error: function(jqXHR,textStatus,errorThrown){
                toastr["error"]("Failed to load content.", "Error "+jqXHR.status);
            },
            success: function(response){
                if(response.page_title){
                    history.pushState(null, null, ob.pathname);
                    admin_page.sidebar.selectMenu(response.sidebar_menus);
                    admin_page.content.setTitle({"text":response.page_title,"small":response.page_description});
                    admin_page.content.setBreadCrumb(response.breadcrumbs);
                    admin_page.content.setBody(response.content);
                    admin_page.content.setObjects(response.objects);
                    var script = ob.pathname+'/js';
                    try {
                        $.getScript(script);
                    }
                    catch(e){console.log("Unable to load script from "+script);}
                }
            }
        });
    },
    setTitle: function(title) {
        if(title) {
            $('.content-header h1').html(title.text+'<small>'+title.small+'</small>');
        }
    },
    setBreadCrumb: function(crumbs) {
        if(crumbs) {
            var breadcrumbs = '';
            for(var menu in crumbs) {
                if(crumbs[menu].link != "") {
                    breadcrumbs += '<li><a onclick="admin_page.content.get(event,this)" href="'+crumbs[menu].link+'">'+crumbs[menu].text+'</a></li>';
                }
                else {
                    breadcrumbs += '<li class="active">'+crumbs[menu].text+'</li>';
                }
            }
            $('.content-header .breadcrumb').html(breadcrumbs);
        }
    },
    setBody: function(content) {
        $('section.content').html(content);
    },
    setObjects: function(objects) {
        $('#objects_holder').html(objects);
    }
}

admin_page.sidebar =
{
    selected_menu: null,
    selectMenu: function(menus) {
        if(menus) {
            $('.sidebar-menu li').removeClass('active');
            for(var index in menus) {
                var menu = $('.sidebar-menu [data-menu="'+menus[index]+'"]');
                menu.addClass('active').find('.fa-angle-left').addClass('turned-down');
                if(menu.hasClass('treeview')) menu.addClass('tree-open');
            }
            this.selected_menu = menus;
        }
    }
}

admin_app.library =
{
    self: $('div.content-wrapper'),
    objects: {
        media_type_box: null,
        category_box: null,
        bulk_operation_box: null,
        search_form: null,
        search_box: null,
        display_quick_buttons: null,
        select_quick_buttons: null,
        content_box: null,
        pagination_box: null,
        pagination_index: null,
        pagination_total: null,
        pagination_prev: null,
        pagination_next: null,
        thumbs_box: null,
        active_search: null,
        search_clock: null,
    },
    data: {
        keyword: null,
        page: {current: 1,total: 0,limit: 24},
        items: {entries: [],total: 0},
        type: 'images',
        category: "",
        display: 'thumb',
        selected: []
    },
    init: function() {
        this.objects.media_type_box = this.self.find('[data-id="media_type"]');
        this.objects.category_box = this.self.find('[data-id="category"]');
        this.objects.bulk_operation_box = this.self.find('[data-id="bulk_operation_box"]');
        this.objects.search_form = this.self.find('[data-id="search_form"]');
        this.objects.search_box = this.self.find('[data-id="search_box"]');
        this.objects.display_quick_buttons = this.self.find('[data-id="quick_buttons"] button.display');
        this.objects.select_quick_buttons = this.self.find('[data-id="quick_buttons"] button.toggle-select');
        this.objects.pagination_prev = this.self.find('.m-pagination .prev');
        this.objects.pagination_index = this.self.find('.m-pagination .index');
        this.objects.pagination_next = this.self.find('.m-pagination .next');
        this.objects.pagination_total = this.self.find('.m-pagination .total');
        this.objects.content_box = this.self.find('[data-id="content"]');
        this.objects.media_type_box.unbind().on('change',this.pickType.bind(this));
        this.objects.category_box.unbind().on('change',this.pickCategory.bind(this));
        this.objects.bulk_operation_box.unbind().on('change',this.bulkAction.bind(this));
        this.objects.search_form.unbind().on('submit',this.doSearch.bind(this));
        this.objects.search_box.unbind().on('keydown',this.liveSearch.bind(this));
        this.objects.display_quick_buttons.unbind().on('click',this.switchDisplay.bind(this));
        this.objects.select_quick_buttons.unbind().on('click',this.selectAllMedia.bind(this));
        this.objects.pagination_prev.unbind().on('click',this.prevPage.bind(this));
        this.objects.pagination_index.unbind().on('keypress',this.goPage.bind(this));
        this.objects.pagination_next.unbind().on('click',this.nextPage.bind(this));
        this.getData();
    },
    render: function(){
        var entries = this.data.items.entries;
        var html = "";

        if(entries.length > 0){
            if(this.data.type == "images") {
                if(this.data.display == 'thumb') {
                    for(var i=0; i < entries.length; i++) {
                        var image = entries[i];
                        var thumb = site.base_url+'media/images/public/256/'+image.uid+'.jpg';
                        var selected = $.inArray(image.id,this.data.selected);
                        var item_class = (selected > -1)? "active" : "";
                        var checked = (selected > -1)? "checked" : "";
                        html +=
                        '<div class="media-entry thumb-box col-lg-2 '+item_class+' col-md-3 col-sm-4 col-xs-6" data-id="'+image.id+'" data-category_id="'+image.category_id+'" data-title="'+image.title+'">'+
                            '<div class="thumb" >'+
                                '<a href="'+site.base_url+'images/view/lg/'+image.uid+'" title="'+image.title+'" class="image-link media-item image-preview" style="background-image:url(\''+thumb+'\')">'+
                                '</a>'+
                                '<div class="controls">'+
                                    '<b title="Move to category" data-id="move_category"><i class="fa fa-lg fa-exchange"></i></b>'+
                                    '<b title="Edit" data-id="edit"><i class="fa fa-lg fa-pencil"></i></b>'+
                                    '<b title="Delete" data-id="delete"><i class="fa fa-lg fa-trash"></i></b>'+
                                '</div>'+
                            '</div>'+
                            '<div class="no-interact"></div>'+
                            '<label class="checkbox-ui" title="Bulk select"><input type="checkbox" '+checked+' value="'+image.id+'"><i class="glyphicon glyphicon-ok"></i></label>'+
                        '</div>';
                    }
                }
                else if(this.data.display == 'list') {
                    html += '<ul class="list-box">'
                    for(var i=0; i < entries.length; i++) {
                        var image = entries[i];
                        var thumb = site.base_url+'media/images/public/128/'+image.uid+'.jpg';
                        var selected = $.inArray(image.id,this.data.selected);
                        var item_class = (selected > -1)? "active" : "";
                        var checked = (selected > -1)? "checked" : "";
                        html +=
                            '<li class="media-entry list clearfix '+item_class+'" data-id="'+image.id+'" data-category_id="'+image.category_id+'" data-title="'+image.title+'">'+
                                '<div class="check-box">'+
                                    '<label class="checkbox-ui" title="Bulk select"><input type="checkbox" '+checked+' value="'+image.id+'"><i class="glyphicon glyphicon-ok"></i></label>'+
                                '</div>'+
                                '<div class="image" style="background-image:url('+thumb+')">'+
                                    '<a href="'+site.base_url+'images/view/lg/'+image.uid+'" class="image-preview">&nbsp;</a>'+
                                '</div>'+
                                '<div class="detail">'+
                                    '<div class="title"><a href="'+site.base_url+'images/view/lg/'+image.uid+'" class="image-preview">'+image.title+'</a></div>'+
                                    '<div class="description">'+image.description+'</div>'+
                                '</div>'+
                                '<div class="controls float-right">'+
                                    '<button title="Move to category" class="btn btn-primary btn-xs" data-id="move_category"><i class="fa fa-exchange"></i></button>'+
                                    '<button title="Edit" class="btn btn-primary btn-xs" data-id="edit"><i class="fa fa-pencil"></i></button>'+
                                    '<button title="Delete" class="btn btn-danger btn-xs" data-id="delete"><i class="fa fa-trash"></i></button>'+
                                '</div>'+
                                '<div class="no-interact"></div>'+
                            '</li>';
                    }
                    html += '</ul>';
                }
            }
            else if(this.data.type == "videos") {
                if(this.data.display == 'thumb') {
                    for(var i=0;i<entries.length;i++) {
                        var video = entries[i];
                        var thumb = site.base_url+'media/videos/public/256/'+video.uid+'.jpg';
                        var selected = $.inArray(video.id,this.data.selected);
                        var item_class = (selected > -1)? "active" : "";
                        var checked = (selected > -1)? "checked" : "";
                        html +=
                        '<div class="media-entry thumb-box col-lg-2 col-md-3 col-sm-4 col-xs-6 '+item_class+'" data-id="'+video.id+'" data-category_id="'+video.category_id+'" data-title="'+video.title+'">'+
                            '<div class="thumb" >'+
                                '<a href="'+site.base_url+'videos/view/fhd/'+video.uid+'" title="'+video.title+'" class="image-link media-item video-preview" style="background-image:url(\''+thumb+'\')">'+
                                '</a>'+
                                '<div class="controls">'+
                                    '<b title="Move to category" data-id="move_category"><i class="fa fa-lg fa-exchange"></i></b>'+
                                    '<b title="Edit" data-id="edit"><i class="fa fa-lg fa-pencil"></i></b>'+
                                    '<b title="Delete" data-id="delete"><i class="fa fa-lg fa-trash"></i></b>'+
                                '</div>'+
                            '</div>'+
                            '<div class="no-interact"></div>'+
                            '<label class="checkbox-ui" title="Bulk select"><input type="checkbox" '+checked+' value="'+video.id+'"><i class="glyphicon glyphicon-ok"></i></label>'+
                        '</div>';
                    }
                }
                else if(this.data.display == 'list') {
                    html += '<ul class="list-box">'
                        for(var i=0;i<entries.length;i++) {
                            var video = entries[i];
                            var thumb = site.base_url+'media/videos/public/128/'+video.uid+'.jpg';
                            var selected = $.inArray(video.id,this.data.selected);
                            var item_class = (selected > -1)? "active" : "";
                            var checked = (selected > -1)? "checked" : "";
                            html +=
                                '<li class="media-entry list clearfix '+item_class+'" data-id="'+video.id+'" data-category_id="'+video.category_id+'" data-title="'+video.title+'">'+
                                    '<div class="check-box">'+
                                        '<label class="checkbox-ui" title="Bulk select"><input type="checkbox" '+checked+' value="'+video.id+'"><i class="glyphicon glyphicon-ok"></i></label>'+
                                    '</div>'+
                                    '<div class="image" style="background-image:url('+thumb+')">'+
                                        '<a href="'+site.base_url+'videos/view/fhd/'+video.uid+'" title="'+video.title+'" class="video-preview">&nbsp;</a>'+
                                    '</div>'+
                                    '<div class="detail">'+
                                        '<div class="title"><a href="'+site.base_url+'videos/view/fhd/'+video.uid+'" title="'+video.title+'" class="video-preview">'+video.title+'</a></div>'+
                                        '<div class="description">'+video.description+'</div>'+
                                    '</div>'+
                                    '<div class="controls float-right">'+
                                        '<button title="Move to category" class="btn btn-primary btn-xs" data-id="move_category"><i class="fa fa-exchange"></i></button>'+
                                        '<button title="Edit" class="btn btn-primary btn-xs" data-id="edit"><i class="fa fa-pencil"></i></button>'+
                                        '<button title="Delete" class="btn btn-danger btn-xs" data-id="delete"><i class="fa fa-trash"></i></button>'+
                                    '</div>'+
                                    '<div class="no-interact"></div>'+
                                '</li>';
                        }
                    html += '</ul>';
                }
            }
        }
        else {
            html = '<div class="col-xs-12"><div class="alert alert-warning">No results found.</div></div>';
        }
        this.objects.content_box.html(html);
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
        this.objects.display_quick_buttons.removeClass('active');
        this.self.find('button[data-display="'+this.data.display+'"]').addClass('active');
        if(this.data.selected.length > 0){
            if(!this.objects.bulk_operation_box.hasClass('active')) this.objects.bulk_operation_box.val('default');
            this.objects.bulk_operation_box.addClass('active');
            this.objects.content_box.addClass('bulk_select_mode');
        }
        else{
            this.objects.select_quick_buttons.removeClass('active');
            this.objects.bulk_operation_box.removeClass('active');
            this.objects.content_box.removeClass('bulk_select_mode');
        }
        this.objects.content_box.find('.controls [data-id="move_category"]').unbind().on('click',this.moveToCategory.bind(this));
        this.objects.content_box.find('.checkbox-ui [type="checkbox"]').unbind().on('click',this.selectMedia.bind(this));
        this.objects.content_box.find('.controls [data-id="edit"]').unbind().on('click',this.editMedia.bind(this));
        this.objects.content_box.find('.controls [data-id="delete"]').unbind().on('click',this.deleteMedia.bind(this));
        this.objects.content_box.find('a.image-preview').fullsizable({detach_id: 'main_header',clickBehaviour: 'next'});
        this.objects.content_box.find('a.video-preview').unbind('click').click(videomodal.open);
    },
    bulkAction: function(e){
        var $this = this;
        var action = e.target.value;
        if(action == "chage_category"){
            var endpoint = site.base_url+this.data.type+'/update';
            var data = {
                id: this.data.selected,
                category_id: null
            }
            admin_app.category_selector.open(endpoint, data);
        }
        else if(action == "delete"){
            var item_count = this.data.selected.length;
            var deleteItems = function(){
                $.ajax({
                    "method": "post",
                    "context": $this,
                    "url": site.base_url+$this.data.type+'/delete',
                    "data": {id: $this.data.selected},
                    "error" : function(jqXHR,textStatus,errorThrown){
                        toastr["error"]("Failed to delete \""+item_count+"\" items(s).", "Error "+jqXHR.status);
                    },
                    "success": function(response){
                        if(response.status == "ok"){
                            toastr["success"]("Deleted \""+item_count+"\" item(s).");
                            this.getData();
                        }
                        else{
                            toastr["error"]("Failed to delete "+item_count+" "+this.data.type+".", "Error 500");
                        }
                    }
                });
            }
            var cancelDelete = function(){this.objects.bulk_operation_box.val('default')}
            modal.confirm("Do you want to delete "+item_count+" "+this.data.type+"?",deleteItems,cancelDelete.bind(this));
        }
    },
    doSearch: function(e){
        e.preventDefault();
        this.data.page.current = 1;
        this.getData();
    },
    liveSearch: function(e){
        if(e.keyCode != 13) {
            this.data.page.current = 1;
            if(this.search_clock) clearTimeout(this.search_clock);
            this.search_clock = setTimeout(this.getData.bind(this),600);
        }
    },
    getData: function(e){
        if(e) e.preventDefault();
        var data = {
            kw: this.objects.search_box.val(),
            c: this.objects.category_box.val(),
            p: this.data.page.current,
            l: this.data.page.limit,
            m: 'json'
        };
            if(this.objects.active_search) this.objects.active_search.abort();
            this.objects.active_search = $.ajax({
                type: "get",
                url: site.base_url+"/search/"+this.data.type,
                context: this,
                data: data,
                dataType: "json",
                success: function(response) {
                    this.data.keyword = data.kw;
                    this.data.page = response.page;
                    this.data.items = response.items;
                    this.data.selected = [];
                    this.render();
                }
            });
    },
    pickType: function(e){
        var type = e.target.value;
        this.data.type = type;
        this.getData();
    },
    pickCategory: function(e){
        var category_id = e.target.value;
        this.data.page.current = 1;
        this.data.category = category_id;
        this.getData();
    },
    switchDisplay: function(e){
        var display_type = (e.target.nodeName == 'BUTTON')? $(e.target).attr('data-display') : $(e.target).parent('button').attr('data-display');
        if(this.data.display != display_type) {
            this.data.display = display_type;
            this.render();
        }
    },
    prevPage: function(){
        if(this.data.page.current > 1) {
            this.data.page.current -= 1;
            this.getData();
        }
    },
    goPage: function(e){
        if(e.type == 'keypress')
        {
            if(e.keyCode < 48 || e.keyCode > 57){
                if(e.keyCode == 13){
                    var to_page = $(e.target).val();
                    var input_keyword = this.objects.search_box.val();
                    if(input_keyword == this.data.keyword){
                        if(to_page > this.data.page.total){
                            this.data.page.current = this.data.page.total;
                        }
                        else{
                            this.data.page.current = to_page;
                        }
                        this.getData();
                    }
                    else {
                        this.data.page.current = to_page;
                        this.getData();
                    }
                }
                else{
                    return false;
                }
            }
        }
    },
    nextPage: function(){
        if(this.data.page.current < this.data.page.total) {
            this.data.page.current += 1;
            this.getData();
        }
    },
    moveToCategory: function(e){
        var parent = $(e.target).parents(".media-entry");
        var endpoint = site.base_url+this.objects.media_type_box.val()+'/update';
        var data = {
            id: parent.attr('data-id'),
            category_id: parent.attr('data-category_id')
        }
        admin_app.category_selector.open(endpoint, data);
    },
    selectMedia: function(e){
        var item = $(e.target).parents(".media-entry");;
        var checkbox = $(e.target);
        var id = checkbox.val();
        var index = $.inArray(id,this.data.selected);;
        if(checkbox.is(":checked")){
            item.addClass('active');
            if(index == -1){
                this.data.selected.push(id);
            }
        }
        else{
            item.removeClass('active');
            if(index > -1){
                this.data.selected.remove(id);
            }
        }
        if(this.data.selected.length > 0){
            if(!this.objects.bulk_operation_box.hasClass('active')) this.objects.bulk_operation_box.val('default');
            this.objects.bulk_operation_box.addClass('active');
            this.objects.content_box.addClass('bulk_select_mode');
        }
        else{
            this.objects.bulk_operation_box.removeClass('active');
            this.objects.content_box.removeClass('bulk_select_mode');
        }
    },
    selectAllMedia: function(e){
        var self = (e.target.nodeName == "I")? $(e.target).parent("button") : $(e.target);
        var current_items = this.data.items.entries;
        if(self.hasClass("active")){
            self.removeClass("active");
            this.data.selected = [];
            this.render();
        }
        else{
            self.addClass("active");
            this.data.selected = [];
            for(var i=0;i<current_items.length;i++ ){
                this.data.selected.push(current_items[i].id);
            }
            this.render();
        }
    },
    editMedia: function(e){
        var parent = $(e.target).parents(".media-entry");
        var id = parent.attr('data-id');
        if(this.data.type == "images") {
            admin_app.image_editor.open(id,this.getData.bind(this));
        }
        else if(this.data.type == "videos") {
            admin_app.video_editor.open(id,this.getData.bind(this));
        }
    },
    deleteMedia: function(e) {
        var parent = $(e.target).parents(".media-entry");
        var id = parent.attr('data-id');
        var item_name = parent.attr('data-title');
        var $this = this;
        var delete_item = function(){
            $.ajax({
                "method": "post",
                "context": $this,
                "url": site.base_url+$this.data.type+'/delete',
                "data": "id="+id,
                "error" : function(jqXHR,textStatus,errorThrown){
                    toastr["error"]("Failed to delete \""+item_name+"\".", "Error "+jqXHR.status);
                },
                "success": function(response){
                    if(response.status == "ok"){
                        toastr["success"]("Deleted \""+item_name+"\".");
                        this.getData();
                    }
                    else{
                        toastr["error"]("Failed to delete \""+item_name+"\".", "Error 500");
                    }
                }
            });
        }
        modal.confirm("Do you want to delete a file?",delete_item);
    }
}

admin_app.image_editor =
{
    self: "#modal_image_editor",
    objects: {
        img_box: null,
        meta_date_added: null,
        meta_date_modified: null,
        meta_file_size: null,
        meta_dimension: null,
        title_box: null,
        description_box: null,
        tag_box: null,
        tag_box_input: null,
        save_btn: null,
    },
    caller: null,
    data: {
        id: null,
        uid: null,
        category_id: null,
        title: null,
        description: null,
        tags: null,
        height: null,
        width: null,
        file_size: null,
        share_id: null,
        date_added: null,
        date_modified: null
    },
    open: function(id,caller) {
        this.self.modal('show');
        this.getData(id);
        if(caller){
            this.caller = caller;
        }
    },
    init: function() {
        this.self = $(this.self);
        this.objects.img_box = this.self.find('.modal-media-box');
        this.objects.img_box.find('img[data-id="image"]').unbind().on('load',this.imgLoaded.bind(this));
        this.objects.meta_date_added = this.self.find('[data-id="date_added"]');
        this.objects.meta_date_modified = this.self.find('[data-id="date_modified"]');
        this.objects.meta_file_size = this.self.find('[data-id="file_size"]');
        this.objects.meta_dimension = this.self.find('[data-id="dimension"]');
        this.objects.title_box = this.self.find('[name="title"]');
        this.objects.description_box = this.self.find('[name="description"]');
        this.objects.tag_box = this.self.find('ul.input-tags');
        this.objects.tag_box.html("");
        this.objects.tag_box_input = $('<li class="input-text" contenteditable="true"></li>').appendTo(this.objects.tag_box);
        this.objects.tag_box_input.unbind('keypress').on('keypress',this.keyinTag.bind(this));
        this.objects.tag_box_input.unbind('keydown').on('keydown',this.backspTag.bind(this));
        this.objects.tag_box_input.unbind('paste').on('paste',function(){return false});
        this.objects.tag_box.unbind('click').on('click',(function(){this.objects.tag_box_input.focus()}).bind(this));
        this.objects.save_btn = this.self.find('[data-id="save_btn"]');
        this.objects.save_btn.unbind('click').on('click',this.save.bind(this));
        this.self.on('hidden.bs.modal', (function(){this.objects.img_box.addClass("loading")}).bind(this));
        this.self.modal({backdrop: 'static'}).modal('hide');
    },
    render: function() {
        this.objects.img_box.addClass("loading");
        this.objects.img_box.find('img[data-id="image"]').attr('src',site.base_url+'images/view/lg/'+this.data.uid);
        this.enableState();
        this.objects.meta_date_added.text(this.data.date_added);
        this.objects.meta_date_modified.text(this.data.date_modified);
        this.objects.meta_file_size.text(this.data.file_size);
        this.objects.meta_dimension.text(this.data.width+'x'+this.data.height);
        this.objects.title_box.val(this.data.title);
        this.objects.description_box.val(this.data.description);
        this.objects.tag_box.find('li.input-tag').remove();
        var tags = $.trim(this.data.tags);
        tags = (tags.length > 0)? tags.split(' ') : [];
        this.makeTags(tags);
    },
    save: function() {
        var title = this.objects.title_box;
        var description = this.objects.description_box;
        var tags_li = this.objects.tag_box.find('li.input-tag span.name');
        var tags = [];

        tags_li.each(function(){
            tags.push($(this).text());
        });

        if($.trim(title.val()) != "") {
            title.removeClass("error");
            this.data.title = $.trim(title.val());
            this.data.description = $.trim(description.val());
            if(tags.length > 0) {
                this.data.tags = tags.join(' ');
            }
            else {
                this.data.tags = "";
            }
            this.pushChange();
        }
        else {
            title.addClass("error");
        }
    },
    pushChange: function() {
        this.disableState();
        var data = {
            id: this.data.id,
            title: this.data.title,
            description: this.data.description,
            tags: this.data.tags
        }
        $.ajax({
            context: this,
            url: site.base_url+"images/update",
            method: "post",
            data: data,
            error: function(jqXHR,textStatus,errorThrown){
                toastr["error"]("Failed to load content.", "Error "+jqXHR.status);
            },
            success: function(response) {
                if(response.status == "ok") {
                    if(this.caller) {
                        if(typeof this.caller == 'function') {
                            this.caller();
                        }
                        else {
                            this.caller.setName(this.data.title); 
                        }
                    }
                    toastr["success"](response.message);
                    this.enableState();
                    this.close();
                }
                else {
                    toastr["error"](response.message, "Error");
                    this.enableState();
                    this.close();
                }
            }
        });
    },
    close: function() {
        this.self.modal('hide');
    },
    disableState: function() {
        var input = this.objects.tag_box_input;
        this.self.find('input').prop('disabled', true);
        this.self.find('textarea').prop('disabled', true);
        this.objects.tag_box.addClass('disabled');
        this.objects.tag_box_input.prop('contenteditable',false);
        if(input.text().length == 0) input.html('&nbsp;');
        this.self.find('button').prop('disabled', true);
    },
    enableState: function() {
        this.self.find('input').prop('disabled', false);
        this.self.find('textarea').prop('disabled', false);
        this.objects.tag_box.removeClass('disabled');
        this.objects.tag_box_input.prop('contenteditable',true);
        this.objects.tag_box_input.text("");
        this.self.find('button').prop('disabled', false);
    },
    getData: function(id) {
        var $this = this;
        var setData = function(response) {
            if(response.status == "ok") {
                this.data = response.data;
                this.render();
            }
            else {
                toastr["error"](response.message, "Error ");
            }
        }
        $.ajax({
            context: $this,
            url: site.base_url+'images/info/'+id,
            error: function(jqXHR,textStatus,errorThrown){
                toastr["error"]("Failed to load content.", "Error "+jqXHR.status);
            },
            success: setData.bind(this)
        });
    },
    imgLoaded: function(e) {
        $(e.target).parent(".modal-media-box").removeClass("loading");
    },
    makeTags: function(list) {
        for(var i=0; i<list.length; i++) {
            $(this.formatTag(list[i])).insertBefore(this.objects.tag_box_input);
        }
        this.objects.tag_box.delegate("li > span.del","click",this.removeTag);
    },
    formatTag: function(name) {
        return '<li class="input-tag"><span class="name">'+name+'</span><span class="del">x</span></li>';
    },
    keyinTag: function(e) {
        var self = e.target;
        var input = e.which;

        if(input>=48 && input<=57) { 
            return true;
        }
        else if(input>=65 && input<=90) { 
            return true;
        }
        else if(input>=97 && input<=122) { 
            return true;
        }
        else if(input==45) { 
            return true;
        }
        else if(input == 13 || input == 32) { 
            e.preventDefault();
            this.addTag(event);
        }
        else{
            return false;
        }
    },
    backspTag: function(e) {
        this.objects.tag_box.find('li.error').removeClass('error');
        if(e.which == 8) {
            var input = $(e.target).text();
            if($.trim(input) == "") {
                var last_tag = $(this.objects.tag_box).find('li.input-tag').last();
                last_tag.remove();
            }
        }
    },
    addTag: function(e) {
        var input = $.trim($(e.target).text());
        var errors = 0;
        if(input.length == 0) {
            errors++;
        }
        else {
            this.objects.tag_box.find('li.input-tag span.name').each(function(){
                var self = $(this);
                if(self.text() == input) {
                    self.parent('li').addClass('error');
                    errors++;
                }
            });
        }
        if(errors == 0) {
            var tag = this.formatTag(input);
            $(tag).insertBefore(this.objects.tag_box_input);
            $(e.target).text("");
        }
        return false;
    },
    removeTag: function(e) {
        $(e.target).parent("li").remove();
    }
}

admin_app.video_editor =
{
    self: "#modal_video_editor",
    objects: {
        vid_box: null,
        vid_player: null,
        meta_date_added: null,
        meta_date_modified: null,
        meta_file_size: null,
        meta_dimension: null,
        meta_duration: null,
        title_box: null,
        description_box: null,
        tag_box: null,
        tag_box_input: null,
        save_btn: null,
    },
    caller: null,
    data: {
        id: null,
        uid: null,
        category_id: null,
        title: null,
        description: null,
        tags: null,
        width: null,
        height: null,
        duration: null,
        file_size: null,
        share_id: null,
        date_added: null,
        date_modified: null
    },
    open: function(id,caller) {
        this.self.modal('show');
        this.getData(id);
        if(caller){
            this.caller = caller;
        }
    },
    init: function() {
        this.self = $(this.self);
        this.objects.vid_box = this.self.find('.modal-image-box');
        this.objects.vid_player = videojs("video_edit_player", { "controls": true, "autoplay": false, "preload": "auto" });
        this.objects.meta_date_added = this.self.find('[data-id="date_added"]');
        this.objects.meta_date_modified = this.self.find('[data-id="date_modified"]');
        this.objects.meta_file_size = this.self.find('[data-id="file_size"]');
        this.objects.meta_dimension = this.self.find('[data-id="dimension"]');
        this.objects.meta_duration = this.self.find('[data-id="duration"]');
        this.objects.title_box = this.self.find('[name="title"]');
        this.objects.description_box = this.self.find('[name="description"]');
        this.objects.tag_box = this.self.find('ul.input-tags');
        this.objects.tag_box.html("");
        this.objects.tag_box_input = $('<li class="input-text" contenteditable="true"></li>').appendTo(this.objects.tag_box);
        this.objects.tag_box_input.unbind('keypress').on('keypress',this.keyinTag.bind(this));
        this.objects.tag_box_input.unbind('keydown').on('keydown',this.backspTag.bind(this));
        this.objects.tag_box_input.unbind('paste').on('paste',function(){return false});
        this.objects.tag_box.unbind('click').on('click',(function(){this.objects.tag_box_input.focus()}).bind(this));
        this.objects.save_btn = this.self.find('[data-id="save_btn"]');
        this.objects.save_btn.unbind('click').on('click',this.save.bind(this));
        this.self.on('hidden.bs.modal', (function(){this.objects.vid_player.pause()}).bind(this));
        this.self.modal({backdrop: 'static'}).modal('hide');
    },
    render: function() {
        this.objects.vid_player.poster(site.base_url+'media/videos/public/480/'+this.data.uid+'.jpg');
        this.objects.vid_player.src(site.base_url+'media/videos/public/480p/'+this.data.uid+'.mp4');
        this.enableState();
        this.objects.meta_date_added.text(this.data.date_added);
        this.objects.meta_date_modified.text(this.data.date_modified);
        this.objects.meta_file_size.text(this.data.file_size);
        this.objects.meta_dimension.text(this.data.width+'x'+this.data.height);
        this.objects.meta_duration.text(this.data.duration);
        this.objects.title_box.val(this.data.title);
        this.objects.description_box.val(this.data.description);
        this.objects.tag_box.find('li.input-tag').remove();
        var tags = $.trim(this.data.tags);
        tags = (tags.length > 0)? tags.split(' ') : [];
        this.makeTags(tags);
    },
    save: function() {
        var title = this.objects.title_box;
        var description = this.objects.description_box;
        var tags_li = this.objects.tag_box.find('li.input-tag span.name');
        var tags = [];

        tags_li.each(function(){
            tags.push($(this).text());
        });

        if($.trim(title.val()) != "") {
            title.removeClass("error");
            this.data.title = $.trim(title.val());
            this.data.description = $.trim(description.val());
            if(tags.length > 0) {
                this.data.tags = tags.join(' ');
            }
            else {
                this.data.tags = "";
            }
            this.pushChange();
        }
        else {
            title.addClass("error");
        }
    },
    pushChange: function() {
        this.disableState();
        var data = {
            id: this.data.id,
            title: this.data.title,
            description: this.data.description,
            tags: this.data.tags
        }
        $.ajax({
            context: this,
            url: site.base_url+"videos/update",
            method: "post",
            data: data,
            error: function(jqXHR,textStatus,errorThrown){
                toastr["error"]("Failed to load content.", "Error "+jqXHR.status);
            },
            success: function(response) {
                if(response.status == "ok") {
                    if(this.caller) {
                        if(typeof this.caller == 'function') {
                            this.caller();
                        }
                        else {
                            this.caller.setName(this.data.title); 
                        }
                    }
                    toastr["success"](response.message);
                    this.enableState();
                    this.close();
                }
                else {
                    toastr["error"](response.message, "Error");
                    this.enableState();
                    this.close();
                }
            }
        });
    },
    close: function() {
        this.self.modal('hide');
    },
    disableState: function() {
        var input = this.objects.tag_box_input;
        this.self.find('input').prop('disabled', true);
        this.self.find('textarea').prop('disabled', true);
        this.objects.tag_box.addClass('disabled');
        this.objects.tag_box_input.prop('contenteditable',false);
        if(input.text().length == 0) input.html('&nbsp;');
        this.self.find('button').prop('disabled', true);
    },
    enableState: function() {
        this.self.find('input').prop('disabled', false);
        this.self.find('textarea').prop('disabled', false);
        this.objects.tag_box.removeClass('disabled');
        this.objects.tag_box_input.prop('contenteditable',true);
        this.objects.tag_box_input.text("");
        this.self.find('button').prop('disabled', false);
    },
    getData: function(id) {
        var $this = this;
        var setData = function(response) {
            if(response.status == "ok") {
                this.data = response.data;
                this.render();
            }
            else {
                toastr["error"](response.message, "Error ");
            }
        }
        $.ajax({
            context: $this,
            url: site.base_url+'videos/info/'+id,
            error: function(jqXHR,textStatus,errorThrown){
                toastr["error"]("Failed to load content.", "Error "+jqXHR.status);
            },
            success: setData.bind(this)
        });
    },
    makeTags: function(list) {
        for(var i=0; i<list.length; i++) {
            $(this.formatTag(list[i])).insertBefore(this.objects.tag_box_input);
        }
        this.objects.tag_box.delegate("li > span.del","click",this.removeTag);
    },
    formatTag: function(name) {
        return '<li class="input-tag"><span class="name">'+name+'</span><span class="del">x</span></li>';
    },
    keyinTag: function(e) {
        var self = e.target;
        var input = e.which;

        if(input>=48 && input<=57) { 
            return true;
        }
        else if(input>=65 && input<=90) { 
            return true;
        }
        else if(input>=97 && input<=122) { 
            return true;
        }
        else if(input==45) { 
            return true;
        }
        else if(input == 13 || input == 32) { 
            e.preventDefault();
            this.addTag(event);
        }
        else{
            return false;
        }
    },
    backspTag: function(e) {
        this.objects.tag_box.find('li.error').removeClass('error');
        if(e.which == 8) {
            var input = $(e.target).text();
            if($.trim(input) == "") {
                var last_tag = $(this.objects.tag_box).find('li.input-tag').last();
                last_tag.remove();
            }
        }
    },
    addTag: function(e) {
        var input = $.trim($(e.target).text());
        var errors = 0;
        if(input.length == 0) {
            errors++;
        }
        else {
            this.objects.tag_box.find('li.input-tag span.name').each(function(){
                var self = $(this);
                if(self.text() == input) {
                    self.parent('li').addClass('error');
                    errors++;
                }
            });
        }
        if(errors == 0) {
            var tag = this.formatTag(input);
            $(tag).insertBefore(this.objects.tag_box_input);
            $(e.target).text("");
        }
        return false;
    },
    removeTag: function(e) {
        $(e.target).parent("li").remove();
    }
}

admin_app.category =
{
    self: $('div.content-wrapper'),
    objects: {
        'new_button': null,
        'table_body': null,
    },
    data: {},
    init: function() {
        this.objects.new_button = this.self.find('[data-id="new_button"]');
        this.objects.table_body = this.self.find('tbody[data-id="list"]');
        this.objects.new_button.unbind().on('click',admin_app.category_editor.new.bind(admin_app.category_editor));
        this.getData();
    },
    render: function() {
        var html = "";
        for(var i=0;i<this.data.length;i++) {
            var delete_button = "";
            if(this.data[i]['core'] == "no") {
                delete_button = '\n<button class="btn btn-danger btn-xs" data-id="delete_entry"><i class="fa fa-trash"></i></button>';
            }
            html +=
            '<tr data-all=\''+JSON.stringify(this.data[i])+'\'>'+
                '<td>'+this.data[i]['title']+'</td>'+
                '<td>'+this.data[i]['description']+'</td>'+
                '<td>'+this.data[i]['published']+'</td>'+
                '<td>'+
                    '<button class="btn btn-primary btn-xs" data-id="edit_entry"><i class="fa fa-pencil"></i></button>'+
                    delete_button+
                '</td>'+
            '</tr>'
        }
        this.objects.table_body.html(html);
        this.self.find('button[data-id="edit_entry"]').unbind().on('click',this.edit.bind(this));
        this.self.find('button[data-id="delete_entry"]').unbind().on('click',this.delete.bind(this));
    },
    getData: function(data) {
        if(data) {
            this.data = data;
            this.render();
        }
        else{
            $.ajax({
                url: site.base_url+'categories/get_all',
                method: 'get',
                context: this,
                error: function(jqXHR,textStatus,errorThrown){
                    toastr["error"]("Failed to load content.", "Error "+jqXHR.status);
                },
                success: function(response) {
                    if(response.status == "ok") {
                        this.data = response.data;
                        this.render();
                    }
                    else {
                        toastr["error"]("Internal server error.", "Error 500");
                    }
                }
            });
        }
    },
    edit: function(e) {
        var parent = $(e.target).parents('tr');
        var data = JSON.parse(parent.attr('data-all'));
        admin_app.category_editor.edit.call(admin_app.category_editor,data);
    },
    delete: function(e) {
        var parent = $(e.target).parents('tr');
        var data = JSON.parse(parent.attr('data-all'));
        var id = data.id;
        var doDelete = function() {
            $.ajax({
                url: site.base_url+'categories/delete',
                method: "post",
                data: 'id='+id,
                context: this,
                error: function(jqXHR,textStatus,errorThrown){
                    toastr["error"]("Failed to reach content.", "Error "+jqXHR.status);
                },
                success: function(response) {
                    if(response.status == "ok") {
                        this.getData(response.data);
                        toastr["success"](response.message);
                    }
                    else {
                        toastr["error"](response.message, "Error");
                    }
                }
            });
        }
        modal.confirm('Associated media under category "'+data.title+'" will be moved to uncategorized. Do you want to continue?',doDelete.bind(this));
    }
}

admin_app.category_editor =
{
    self: '#modal_category_editor',
    objects: {
        'modal_title': null,
        'editor_form': null,
        'item': {
            'id': null,
            'title': null,
            'icon': null,
            'description': null,
            'publish_yes': null,
            'publish_no': null
        },
        save_button: null,
        cancel_button: null
    },
    data: {
        editor_title: 'Category (New)',
        editor_visible: false,
        item: {
            id: "",
            title: "",
            description: "",
            publish: "yes"
        },
        disabled: {
            'id': false,
            'title': false,
            'description': false,
            'publish_yes': false,
            'publish_no': false
        },
        task: 'add'
    },
    init: function() {
        this.self = $(this.self);
        this.objects.modal_title = this.self.find('h4.modal-title');
        this.objects.editor_form = this.self.find('form[data-id="editor_form"]');
        this.objects.item.id = this.self.find('[name="id"]');
        this.objects.item.title = this.self.find('[name="title"]');
        this.objects.item.description = this.self.find('[name="description"]');
        this.objects.item.icon = this.self.find('[name="icon"]');
        this.objects.item.publish_yes = this.self.find('input[value="yes"]');
        this.objects.item.publish_no = this.self.find('input[value="no"]');
        this.objects.item.save_button = this.self.find('button[type="submit"]');
        this.objects.item.cancel_button = this.self.find('button[type="button"]');
        this.self.unbind('hidden.bs.modal').on('hidden.bs.modal', (function(){
            this.data.editor_visible = false;
        }).bind(this));
        this.objects.editor_form.unbind().on('submit',this.save.bind(this));
        this.self.modal({backdrop: 'static'}).modal('hide');
        this.data.disabled = {
            'id': false,
            'title': false,
            'description': false,
            'publish_yes': false,
            'publish_no': false
        }
    },
    render: function() {
        this.self.find('.error').removeClass('error');
        this.objects.modal_title.text(this.data.editor_title);
        this.objects.item.id.val(this.data.item.id);
        this.objects.item.title.val(this.data.item.title);
        this.objects.item.description.val(this.data.item.description);
        this.objects.item.icon.val(this.data.item.icon);
        if(this.data.item.publish == "yes") {
            this.objects.item.publish_no.prop('checked',false);
            this.objects.item.publish_yes.prop('checked',true);
        }
        else if(this.data.item.publish == "no") {
            this.objects.item.publish_yes.prop('checked',false);
            this.objects.item.publish_no.prop('checked',true);
        }
        if(this.data.editor_visible) {
            this.self.modal('show');
        }
        else {
            this.self.modal('hide');
        }
        for(var item in this.data.disabled) {
            if(this.data.disabled[item]) {
                this.objects.item[item].prop('disabled',true);
            }
            else {
                this.objects.item[item].prop('disabled',false);
            }
        }
    },
    new: function() {
        this.data.task = "add";
        this.data.item = {
            id: "",
            title: "",
            description: "",
            icon: "",
            publish: "yes"
        }
        this.data.disabled['id'] = false;
        this.data.disabled['title'] = false;
        this.data.disabled['description'] = false;
        this.data.disabled['publish_yes'] = false;
        this.data.disabled['publish_no'] = false;
        this.data.editor_title = "Category (New)";
        this.data.editor_visible = true;
        this.render();
    },
    edit: function(data) {
        this.data.task = "update";
        this.data.item = {
            id: data.id,
            title: data.title,
            description: data.description,
            icon: data.icon,
            publish: data.published
        }
        if(data.core == "yes") {
            this.data.disabled['title'] = true;
            this.data.disabled['description'] = true;
        }
        else {
            this.data.disabled['title'] = false;
            this.data.disabled['description'] = false;
        }
        this.data.disabled['publish_yes'] = false;
        this.data.disabled['publish_no'] = false;
        this.data.editor_title = "Category (Edit)";
        this.data.editor_visible = true;
        this.render();
    },
    save: function(e) {
        e.preventDefault();
        this.data.item.id = this.objects.item.id.val();
        this.data.item.title = this.objects.item.title.val();
        this.data.item.description = this.objects.item.description.val();
        this.data.item.icon = this.objects.item.icon.val();
        this.data.item.publish = this.self.find('[name="publish"]:checked').val();
        if($.trim(this.data.item.title).length == 0) {
            this.objects.item.title.addClass('error');
        }
        else {
            this.objects.item.title.removeClass('error');
            this.disableState();
            var data = {
                id: this.data.item.id,
                title: this.data.item.title,
                description: this.data.item.description,
                icon: this.data.item.icon,
                publish: this.data.item.publish
            }
            $.ajax({
                url: site.base_url+'categories/'+this.data.task,
                method: "post",
                data: data,
                context: this,
                error: function(jqXHR,textStatus,errorThrown){
                    toastr["error"]("Failed to load content.", "Error "+jqXHR.status);
                },
                success: function(response) {
                    if(response.status == "ok") {
                        this.data.editor_visible = false;
                        this.render();
                        admin_app.category.getData.call(admin_app.category,response.data);
                    }
                    else {
                        toastr["error"](response.message, "Error");
                    }
                }
            });
        }
        return false;
    },
    disableState: function() {
        this.data.disabled = {
            'id': true,
            'title': true,
            'description': true,
            'publish_yes': true,
            'publish_no': true
        }
        this.render();
    },
    enableState: function() {
        this.data.disabled = {
            'id': false,
            'title': false,
            'description': false,
            'publish_yes': false,
            'publish_no': false
        }
        this.render();
    }
}

admin_app.category_selector =
{
    self: '#modal_category_selector',
    objects: {
        selection_form: null,
        selection_count: null,
        selection_box: null,
        save_button: null,
        cancel_button: null
    },
    data: {
        item: {
            id: null,
            category_id: null
        },
        categories: null,
        selector_visible: false,
        endpoint: null,
        passed_fn: null
    },
    init: function(){
        this.self = $(this.self);
        this.objects.selection_form = this.self.find('[data-id="selector_form"]');
        this.objects.selection_count = this.self.find('[data-id="item_count"]')
        this.objects.selection_box = this.self.find('[data-id="category_box"]');
        this.objects.save_button = this.self.find('[data-id="save_button"]');
        this.objects.cancel_button = this.self.find('[data-id="cancel_button"]');
        this.self.modal({backdrop: 'static'}).modal('hide');
        this.self.unbind('hidden.bs.modal').on('hide.bs.modal', (function(){
            this.data.selector_visible = false;
            $('select[data-id="bulk_operation_box"]').val('default');
        }).bind(this));
        this.objects.selection_form.unbind().on('submit', this.save.bind(this));
    },
    render: function(){
        if(this.data.categories){
            var categories = this.data.categories;
            var cat_markup = "";
            for(var i=0;i<categories.length;i++) {
                if(this.data.item.category_id == categories[i].id) {
                    cat_markup += '<option value="'+categories[i].id+'" selected="true">'+categories[i].title+'</option>';
                }
                else {
                    cat_markup += '<option value="'+categories[i].id+'">'+categories[i].title+'</option>';
                }
            }
            this.objects.selection_box.html(cat_markup);
        }
        if(this.data.selector_visible){
            this.self.modal('show');
        }
        else {
            this.self.modal('hide');
        }
        if(Array.isArray(this.data.item.id)){
            this.objects.selection_box.val(1);
            this.objects.selection_count.text(this.data.item.id.length);
        }
        else{
            this.objects.selection_count.text('1');
        }
    },
    open: function(endpoint,data,fn){
        this.data.endpoint = endpoint;
        this.data.item.id = data.id;
        this.data.item.category_id = data.category_id;
        this.enableState();
        this.data.selector_visible = true;
        this.render();
        if(fn) this.data.passed_fn = fn;
    },
    save: function(e){
        e.preventDefault();
        if(this.objects.selection_box.val() != this.data.item.category_id) {
            if(this.passed_fn) {
                this.passed_fn();
            }
            else {
                this.disableState();
                var data = {
                    id: this.data.item.id,
                    category_id: this.objects.selection_box.val()
                }
                $.ajax({
                    method: "post",
                    url: this.data.endpoint,
                    context: this,
                    data: data,
                    error : function(jqXHR,textStatus,errorThrown){
                        toastr["error"]("Failed to load.", "Error "+jqXHR.status);
                        this.data.selector_visible = false;
                        this.render();
                    },
                    success: function(response){
                        this.enableState();
                        if(response.status == "ok"){
                            this.data.selector_visible = false;
                            this.render();
                            toastr["success"](response.debug_info.affected_rows+' media entry moved.');
                            admin_app.library.getData();
                        }
                        else{
                            this.data.selector_visible = false;
                            this.render();
                            toastr["error"](response.message, "Error 500");
                        }
                    }
                });
            }
        }
        else {
            this.data.selector_visible = false;
            this.render();
        }
        return false;
    },
    disableState: function(){
        this.objects.selection_box.prop('disabled', true);
        this.objects.save_button.prop('disabled', true);
        this.objects.cancel_button.prop('disabled', true);
    },
    enableState: function(){
        this.objects.selection_box.prop('disabled', false);
        this.objects.save_button.prop('disabled', false);
        this.objects.cancel_button.prop('disabled', false);
    }
}

admin_app.file_widget = function(file,caller_app)
{
    this.file = file;
    this.rendered = false;
    this.progress = 0;
    this.complete = false;
    this.removed = false;
    this.container = $('<div class="media-item uploading clearfix"></div>');
    this.item = $('<div class="item"></div>').appendTo(this.container);
    this.item_pinkynail = $('<div class="pinkynail"><i class="fa fa-lg"></i></div>').appendTo(this.item);
    this.item_name = $('<span>'+file.name+'</span>').appendTo(this.item);
    this.control = $('<div class="control"></div>').appendTo(this.container);
    this.control_progress_bar = $('<div class="ul-progress-bar"></div>').appendTo(this.control);
    this.control_progress_level = $('<div class="progress" data-control="progress"></div>').appendTo(this.control_progress_bar);
    this.control_abort = $('<a class="btn btn-warning" data-control="abort">Abort</a>').appendTo(this.control);
    this.control_edit = $('<a class="btn btn-primary" data-control="edit">Edit</a>').appendTo(this.control);
    this.control_delete = $('<a class="btn btn-danger" data-control="delete">Delete</a>').appendTo(this.control);
    this.setProgress = function(amount) {
        this.progress = amount;
        this.control_progress_level.width(amount+'%');
    }
    this.setAsComplete = function(uid) {
        var type = (caller_app.data.media_type=="photos")? "images" : caller_app.data.media_type;
        this.container.removeClass("uploading converting active").addClass("completed");
        this.item_pinkynail.css('background-image','url('+site.base_url+'media/'+type+'/public/128/'+uid+'.jpg');
        this.progress = 100;
        this.control_progress_level.width('100%');
        this.complete = true;
    }
    this.setAsConverting = function() {
        this.container.removeClass("uploading completed").addClass("converting");
    }
    this.setAsActive = function() {
        this.container.addClass("active");
    }
    this.onEdit = function(fn) {
        this.control_edit.unbind('click').on('click',fn);
    }
    this.onDelete = function(fn) {
        this.control_delete.unbind('click').on('click',fn);
    }
    this.control_abort.unbind().on('click',function(e){
        if(caller_app.xhr) caller_app.xhr.abort();
        this.removed = true;
        caller_app.render();
    }.bind(this));
};

admin_app.uploader =
{
    objects: {
        xhr: {},
        drop_box: null,
        drop_zone: null,
        file_list_box: null,
        category_box: null,
        file_input: null,
        media_type_box: null,
        files: []
    },
    data: {
        media_type: "photos",
        media_category: 1,
        allowed_photos: ['image/jpeg','image/pjpeg','image/png','image/bmp','image/x-windows-bmp','image/gif'],
        allowed_videos: ['video/mp4','video/mpeg','video/mpeg','video/quicktime','video/x-matroska','video/x-flv','video/x-msvideo','video/x-ms-wmv'],
    },
    init: function() {

        this.objects.files = [];

        this.objects.drop_box = $("#file_drop_box"),
        this.objects.drop_zone = this.objects.drop_box.find('.zone');
        this.objects.file_list_box = $('#file_list_box');
        this.objects.category_box = $('#content_toolbar_form [name="category"]');
        this.objects.file_input = $("#file_input");
        this.objects.media_type_box = $('#content_toolbar_form [name="type"]');

        this.objects.media_type_box.unbind('change').on('change',this.setMedia.bind(this));
        this.objects.category_box.unbind('change').on('change',this.setMedia.bind(this));

        this.objects.drop_zone.on('dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.objects.drop_box.addClass("drag-over");
        }.bind(this));
        this.objects.drop_zone.on('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
        }.bind(this));
        this.objects.drop_zone.on('drop', function (e) {
            this.objects.drop_box.removeClass("drag-over");
            e.preventDefault();
            var files = e.originalEvent.dataTransfer.files;
            this.handleInput(files);
        }.bind(this));
        this.objects.drop_zone.on('dragleave', function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.objects.drop_box.removeClass("drag-over");
        }.bind(this));
        this.objects.drop_zone.on('click', function(e) {
            this.objects.file_input.trigger('click');
        }.bind(this));
        this.objects.file_input.on('change', function(e) {
            var files = e.target.files;
            this.handleInput(files);
        }.bind(this));

        $(document).unbind('dragenter').on('dragenter', function (e){
            e.stopPropagation();
            e.preventDefault();
        });
        $(document).unbind('dragover').on('dragover', function (e){
          e.stopPropagation();
          e.preventDefault();
        });
        $(document).unbind('drop').on('drop', function (e){
            e.stopPropagation();
            e.preventDefault();
        });
        this.render();
    },
    render: function() {
        var remove_indexes = [];
        for(var i=0; i<this.objects.files.length; i++) {
            var file = this.objects.files[i];
            if(!file.rendered) {
                this.objects.file_list_box.append(file.container);
            }
            if(file.removed) {
                file.container.remove();
                remove_indexes.push(i);
            }
        }
        for(var n=remove_indexes.length-1; n>=0; n--) {
            this.objects.files.splice(remove_indexes[n],1);
        }
        this.objects.media_type_box.val(this.data.media_type);
    },
    setMedia: function() {
        this.data.media_type = this.objects.media_type_box.val();
        this.data.media_category = this.objects.category_box.val();
    },
    getNextUpload() {
        var files = this.objects.files;
        for (var i=0; i<files.length; i++) {
            if(files[i].progress > 0 && !files[i].complete) { 
                return false;
            }
            else if(files[i].progress == 0) {
                files[i].setAsActive();
                return files[i];
            }
        }
    },
    upload: function(file_widget) {

        this.objects.media_type_box.prop("disabled", true);
        this.objects.category_box.prop("disabled", true);

        var media_type = this.data.media_type;
        var item_name = file_widget.file.name;

        admin_app.uploader.objects.xhr = new XMLHttpRequest();
        var xhr = this.objects.xhr;

        var form_data = new FormData();
        form_data.append('file', file_widget.file);
        form_data.append('category_id', this.data.media_category);

        xhr.error = function(e) {
            toastr["warning"]("Failed to upload "+item_name+"?");
        }
        xhr.upload.onprogress = function(e) {
            if(e.lengthComputable) {
                var percent = Math.ceil((e.loaded/e.total) * 100);
                file_widget.setProgress(percent);
            }
        }
        xhr.onload = function(e) {
            try {
                var response = JSON.parse(xhr.responseText);
                var id = response.data.id;
                var uid = response.data.uid;
                if(response.status == "ok") {
                    if(media_type == "photos") {

                        file_widget.onEdit(function(){admin_app.image_editor.open(id)});
                        file_widget.onDelete(function(){
                            var delete_item = function() {
                                $.ajax({
                                    "method": "post",
                                    "url": site.base_url+'images/delete',
                                    "data": "id="+id,
                                    "error" : function(jqXHR,textStatus,errorThrown){
                                        toastr["error"]("Failed to delete \""+item_name+"\".", "Error "+jqXHR.status);
                                    },
                                    "success": function(response){
                                        if(response.status == "ok"){
                                            file_widget.removed = true;
                                            admin_app.uploader.render();
                                            toastr["success"]("Deleted \""+item_name+"\".");
                                        }
                                        else{
                                            toastr["error"]("Failed to delete \""+item_name+"\".", "Error 500");
                                        }
                                    }
                                });
                            }
                            modal.confirm("Delete the file named \""+item_name+"\"?", delete_item);
                        });

                        file_widget.setAsComplete(uid);

                        this.objects.media_type_box.prop("disabled", false);
                        this.objects.category_box.prop("disabled", false);

                        this.uploadNext();
                    }
                    else if(media_type == "videos") {
                        file_widget.setAsConverting();
                        function trackConversion(uid) {
                            $.ajax({
                                context: this,
                                url: site.base_url+'videos/progress/'+uid,
                                data: null,
                                success: function(response) {
                                    if(response.status == "ok") {
                                        if(!response.data.complete) {
                                            file_widget.setProgress(response.data.progress);
                                            setTimeout(function(){trackConversion.call(this,uid)}.bind(this),2000);
                                        }
                                        else {
                                            $.ajax({
                                                context: this,
                                                url: site.base_url+'videos/complete/'+id,
                                                success: function() {
                                                    file_widget.setAsComplete(uid);
                                                    file_widget.onEdit(function(){admin_app.video_editor.open(id)});
                                                    file_widget.onDelete(function(){
                                                        var delete_item = function() {
                                                            $.ajax({
                                                                context: this,
                                                                "method": "post",
                                                                "url": site.base_url+'videos/delete',
                                                                "data": "id="+id,
                                                                "error" : function(jqXHR,textStatus,errorThrown){
                                                                    toastr["error"]("Failed to delete \""+item_name+"\".", "Error "+jqXHR.status);
                                                                },
                                                                "success": function(response){
                                                                    if(response.status == "ok"){
                                                                        file_widget.removed = true;
                                                                        admin_app.uploader.render();
                                                                        toastr["success"]("Deleted \""+item_name+"\".");
                                                                    }
                                                                    else{
                                                                        toastr["error"]("Failed to delete \""+item_name+"\".", "Error 500");
                                                                    }
                                                                }
                                                            });
                                                        }
                                                        modal.confirm("Delete the file named \""+item_name+"\"?", delete_item);
                                                    });
                                                    this.objects.media_type_box.prop("disabled", false);
                                                    this.objects.category_box.prop("disabled", false);
                                                    this.uploadNext();
                                                }
                                            })
                                        }
                                    }
                                }
                            });
                        }
                        trackConversion.call(this,uid);
                    }
                }
            }
            catch(e) {
                toastr["warning"]("Failed to upload "+item_name+".");
            }
        }.bind(this);

        xhr.open('POST', site.base_url+'upload/'+media_type, true);
        xhr.send(form_data);
    },
    uploadNext() {
        var next_upload = admin_app.uploader.getNextUpload();
        if(next_upload) { 
            admin_app.uploader.upload(next_upload);
        }
    },
    handleInput(files_list) {
        var type = this.data.media_type;
        var allowed_types = null;
        var total_count = files_list.length+this.objects.files.length;

        if(type === "photos") allowed_types = this.data.allowed_photos;
        if(type === "videos") allowed_types = this.data.allowed_videos;

        for(var i = 0; i < files_list.length; i++) {
            var in_array = $.inArray(files_list[i].type, allowed_types);
            if(in_array !== -1) {
                var new_entry = new admin_app.file_widget(files_list[i],this);
                this.objects.files.push(new_entry);
            }
            else{
                toastr["error"](files_list[i].name,"Not Allowed Type");
            }
        }

        this.render();
        this.uploadNext();
    }
}
