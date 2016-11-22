admin_app.category =
{
    self: $('div.content-wrapper'),
    objects: {
        'new_button': null,
        'table_body': null,
    },
    data: {},
    init: function() {
        // Identify objects.
        this.objects.new_button = this.self.find('[data-id="new_button"]');
        this.objects.table_body = this.self.find('tbody[data-id="list"]');
        // Bind events
        this.objects.new_button.unbind().on('click',admin_app.category_editor.new.bind(admin_app.category_editor));
        // Get data.
        this.getData();
    },
    render: function() {
        // Build contents.
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
        // Attach events.
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
