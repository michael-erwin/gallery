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
        // Assign objects.
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
        // Bind events.
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
        // Trigger initial contents.
        this.getData();
    },
    render: function(){
        // Build result entries.
        var entries = this.data.items.entries;
        var html = "";

        // Thumb & list display.
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
                        //var vlink = site.base_url+'videos/view/fhd/'+video.uid;
                        var vlink = site.base_url+'media/videos/private/full_size/'+video.uid+'.mp4';
                        var selected = $.inArray(video.id,this.data.selected);
                        var item_class = (selected > -1)? "active" : "";
                        var checked = (selected > -1)? "checked" : "";
                        html +=
                        '<div class="media-entry thumb-box col-lg-2 col-md-3 col-sm-4 col-xs-6 '+item_class+'" data-id="'+video.id+'" data-category_id="'+video.category_id+'" data-title="'+video.title+'">'+
                            '<div class="thumb" >'+
                                '<a href="'+vlink+'" title="'+video.title+'" class="image-link media-item video-preview" style="background-image:url(\''+thumb+'\')">'+
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
                            //var vlink = site.base_url+'videos/view/fhd/'+video.uid;
                            var vlink = site.base_url+'media/videos/private/full_size/'+video.uid+'.mp4';
                            var selected = $.inArray(video.id,this.data.selected);
                            var item_class = (selected > -1)? "active" : "";
                            var checked = (selected > -1)? "checked" : "";
                            html +=
                                '<li class="media-entry list clearfix '+item_class+'" data-id="'+video.id+'" data-category_id="'+video.category_id+'" data-title="'+video.title+'">'+
                                    '<div class="check-box">'+
                                        '<label class="checkbox-ui" title="Bulk select"><input type="checkbox" '+checked+' value="'+video.id+'"><i class="glyphicon glyphicon-ok"></i></label>'+
                                    '</div>'+
                                    '<div class="image" style="background-image:url('+thumb+')">'+
                                        '<a href="'+vlink+'" title="'+video.title+'" class="video-preview">&nbsp;</a>'+
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
        // Display results.
        this.objects.content_box.html(html);
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
        // Update display buttons.
        this.objects.display_quick_buttons.removeClass('active');
        this.self.find('button[data-display="'+this.data.display+'"]').addClass('active');
        // Update bulk operation displays (toolbar item, quick buttons & display items).
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
        // Bind functions.
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
        //if(data.kw != this.data.keyword) {
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
        //}
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
