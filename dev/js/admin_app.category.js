admin_app.category =
{
    self: $('div.content-wrapper'),
    config: {
        expanded_items: {}
    },
    objects: {
        'new_button': null,
        'table_body': null,
        'media_type_dropdown': null,
        'expand_icon': null
    },
    data: {
        media_list: [],
        media_type: 'photos'
    },
    init: function() {
        // Identify objects.
        this.objects.media_type_dropdown = this.self.find('[data-id="media_type"]');
        this.objects.new_button = this.self.find('[data-id="new_button"]');
        this.objects.table_body = this.self.find('#categories_table tbody');
        this.objects.expand_icon = this.self.find('#categories_table tbody i.active');
        // Bind events
        this.objects.media_type_dropdown.unbind().on('change',this.setMediaType.bind(this));
        this.objects.new_button.unbind().on('click',admin_app.category_editor.new.bind(admin_app.category_editor));
        // Get data.
        this.getData();
    },
    render: function() {
        // Arrange according to hierarchy.
        var mains = {};
        for(var i=0;i<this.data.media_list.length;i++) {
            if(Number(this.data.media_list[i]['parent_id']) === 0) {
                var main_id = 'm_'+this.data.media_list[i]['id'];
                if(typeof mains[main_id] === "undefined") mains[main_id] = {};
                mains[main_id].id = this.data.media_list[i]['id'];
                mains[main_id].level = this.data.media_list[i]['level'];
                mains[main_id].title = this.data.media_list[i]['title'];
                mains[main_id].icon = this.data.media_list[i]['icon'];
                mains[main_id].description = this.data.media_list[i]['description'];
                mains[main_id].parent_id = this.data.media_list[i]['parent_id'];
                mains[main_id].published = this.data.media_list[i]['published'];
                mains[main_id].core = this.data.media_list[i]['core'];
                mains[main_id].date_added = this.data.media_list[i]['date_added'];
                mains[main_id].date_modified = this.data.media_list[i]['date_modified'];
            }
            else{
                var main_id = 'm_'+this.data.media_list[i]['parent_id'];
                var subc_id = 's_'+this.data.media_list[i]['id'];
                if(typeof mains[main_id] === "undefined") mains[main_id] = {};
                if(typeof mains[main_id].subcats === "undefined") mains[main_id].subcats = {};
                mains[main_id].subcats[subc_id] = this.data.media_list[i];
            }
        }
        // Build HTML rows content of table.
        var table_html = "";
        for(var item in mains){
            var option_button = "";
            var expand_button = "";
            var expand_status = "";
            if(typeof this.config.expanded_items[item] !== "undefined"){
                if(this.config.expanded_items[item] === 1){
                    expand_status = 'expanded';
                }
            }
            if(mains[item]['core'] == "no") {
                option_button = '<button class="btn btn-primary btn-xs" data-id="edit_entry"><i class="fa fa-pencil"></i></button>'+
                                '\n<button class="btn btn-danger btn-xs" data-id="delete_entry"><i class="fa fa-trash"></i></button>';
            }
            if(mains[item]['id'] > 1) {
                if(typeof mains[item]['subcats'] === "object"){
                    expand_button = '<i class="fa active '+expand_status+'"></i>';
                }
                else{
                    expand_button = '<i class="fa disabled '+expand_status+'"></i>';
                }
            }
            table_html +=
            '<tr class="main-category" data-all=\''+JSON.stringify(mains[item])+'\'>'+
                '<td class="handle">'+expand_button+'</td>'+
                '<td>'+mains[item]['title']+'</td>'+
                '<td>'+mains[item]['description']+'</td>'+
                '<td>'+mains[item]['published']+'</td>'+
                '<td>'+
                    option_button+
                '</td>'+
            '</tr>';
            if(typeof mains[item]['subcats'] === "object") {
                for(var subcat in mains[item]['subcats']){
                    if(mains[item]['subcats'][subcat]['core'] == "no") {
                        option_button = '<button class="btn btn-primary btn-xs" data-id="edit_entry"><i class="fa fa-pencil"></i></button>'+
                                        '\n<button class="btn btn-danger btn-xs" data-id="delete_entry"><i class="fa fa-trash"></i></button>';
                    }
                    var my_parent_id = mains[item]['subcats'][subcat]['parent_id'];
                    var my_display = 'none';
                    if(typeof this.config.expanded_items[item] !== "undefined"){
                        if(this.config.expanded_items[item] === 1){
                            my_display = 'table-row';
                        }
                    }
                    table_html +=
                    '<tr class="sub-category parent-id-'+my_parent_id+'" style="display:'+my_display+'" data-all=\''+JSON.stringify(mains[item]['subcats'][subcat])+'\'>'+
                        '<td class="handle"></td>'+
                        '<td>'+mains[item]['subcats'][subcat]['title']+'</td>'+
                        '<td>'+mains[item]['subcats'][subcat]['description']+'</td>'+
                        '<td>'+mains[item]['subcats'][subcat]['published']+'</td>'+
                        '<td>'+
                            option_button+
                        '</td>'+
                    '</tr>';
                }
            }
        }
        this.objects.table_body.html(table_html);
        // Attach events.
        this.self.find('button[data-id="edit_entry"]').unbind().on('click',this.edit.bind(this));
        this.self.find('button[data-id="delete_entry"]').unbind().on('click',this.delete.bind(this));
        this.self.find('#categories_table tbody i.active').unbind().on('click',this.toggleSubcat.bind(this));
    },
    getData: function(data) {
        if(data) {
            this.data.media_list = data;
            this.render();
        }
        else{
            $.ajax({
                url: site.base_url+'admin/media/categories/json',
                method: 'get',
                data: 'list='+this.objects.media_type_dropdown.val(),
                context: this,
                error: function(jqXHR,textStatus,errorThrown){
                    toastr["error"]("Failed to load content.", "Error "+jqXHR.status);
                },
                success: function(response) {
                    this.data.media_list = response;
                    this.render();
                }
            });
        }
    },
    setMediaType: function(e) {
        this.data.media_type = this.objects.media_type_dropdown.val();
        admin_app.category_editor.data.item.type = this.data.media_type;
        this.getData();
    },
    toggleSubcat(e){
        var self = $(e.target);
        var item = self.parents('tr.main-category');
        var data = JSON.parse(item.attr('data-all'));
        var subs = this.self.find('tr.parent-id-'+data.id);
        var name = 'm_'+data.id;
        if(self.hasClass('expanded')){
            subs.css('display','none');
            self.removeClass('expanded');
            this.config.expanded_items[name] = 0;
        }
        else{
            subs.css('display','table-row');
            self.addClass('expanded');
            this.config.expanded_items[name] = 1;
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
                url: site.base_url+'categories/manage/delete',
                method: "post",
                data: 'id='+id+'&type='+this.objects.media_type_dropdown.val(),
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
