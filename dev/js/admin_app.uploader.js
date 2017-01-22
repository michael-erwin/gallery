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
        media_category_id: 1,
        allowed_photos: ['image/jpeg','image/pjpeg','image/png','image/bmp','image/x-windows-bmp','image/gif'],
        allowed_videos: ['video/mp4','video/mpeg','video/mpeg','video/quicktime','video/x-matroska','video/x-flv','video/x-msvideo','video/x-ms-wmv'],
        category_list: []
    },
    init: function() {

        // Reset data.
        this.objects.files = [];

        // Set common objects.
        this.objects.drop_box = $("#file_drop_box"),
        this.objects.drop_zone = this.objects.drop_box.find('.zone');
        this.objects.file_list_box = $('#file_list_box');
        this.objects.category_box = $('#content_toolbar_form [name="category"]');
        this.objects.file_input = $("#file_input");
        this.objects.media_type_box = $('#content_toolbar_form [name="type"]');

        // Set media selection events.
        this.objects.media_type_box.unbind('change').on('change',this.setMediaType.bind(this));
        this.objects.category_box.unbind('change').on('change',function(){this.data.media_category_id = this.objects.category_box.val();}.bind(this));

        // Initialize drop zone box event handlers.
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

        // Prevent default file drop tiggers outside of designated drop zone.
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
        this.renderCategoryDropdown();
    },
    render: function() {
        var remove_indexes = [];
        // Render cued files.
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
        // Remove marked internal indexes.
        for(var n=remove_indexes.length-1; n>=0; n--) {
            this.objects.files.splice(remove_indexes[n],1);
        }
        // Set media type selection.
        this.objects.media_type_box.val(this.data.media_type);
    },
    setMediaType: function() {
        this.data.media_type = this.objects.media_type_box.val();
        // Fetch category list for selected media type
        $.ajax({
            "method": "get",
            "context": this,
            "url": site.base_url+'admin/media/categories/json',
            "data": "list="+this.data.media_type,
            "error" : function(jqXHR,textStatus,errorThrown){
                toastr["error"]("Failed to load category list.", "Error "+jqXHR.status);
            },
            "success": function(response){
                this.data.category_list = response;
                this.renderCategoryDropdown();
            }
        });
    },
    getNextUpload() {
        var files = this.objects.files;
        for (var i=0; i<files.length; i++) {
            if(files[i].progress > 0 && !files[i].complete) { // There is an ongoing process. Do not return anything.
                return false;
            }
            else if(files[i].progress == 0) {
                files[i].setAsActive();
                return files[i];
            }
        }
    },
    upload: function(file_widget) {

        // Disable changing of type and category.
        this.objects.media_type_box.prop("disabled", true);
        this.objects.category_box.prop("disabled", true);

        // Upload variables.
        var media_type = this.data.media_type;
        var item_name = file_widget.file.name;

        // XHR Object Definition
        admin_app.uploader.objects.xhr = new XMLHttpRequest();
        var xhr = this.objects.xhr;

        // Form data.
        var form_data = new FormData();
        form_data.append('file', file_widget.file);
        form_data.append('category_id', this.data.media_category_id);

        // Events.
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

                        // Attach events.
                        file_widget.onEdit(function(){admin_app.photo_editor.open(id)});
                        file_widget.onDelete(function(){
                            var delete_item = function() {
                                $.ajax({
                                    "method": "post",
                                    "url": site.base_url+'photos/delete',
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

                        // Complete current upload.
                        file_widget.setAsComplete(uid);

                        // Enable changing of type and category.
                        this.objects.media_type_box.prop("disabled", false);
                        this.objects.category_box.prop("disabled", false);

                        // Process next upload.
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
                                                    // Set widget as completed.
                                                    file_widget.setAsComplete(uid);
                                                    // Edit button function.
                                                    file_widget.onEdit(function(){admin_app.video_editor.open(id)});
                                                    // Delete button function.
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
                                                    // Enable changing of type and category.
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

        // Submit files.
        xhr.open('POST', site.base_url+'upload/'+media_type, true);
        xhr.send(form_data);
    },
    uploadNext() {
        // Process next upload.
        var next_upload = admin_app.uploader.getNextUpload();
        if(next_upload) { // No ongoing upload.
            admin_app.uploader.upload(next_upload);
        }
    },
    renderCategoryDropdown() {
        var category_structure = {};
        var category_list = this.data.category_list;
        var category_html = "";
        // Build category structure.
        for(var i=0;i<category_list.length;i++) {
            if(category_list[i].level == 1){
                category_structure['parent_'+category_list[i].id] = {self:category_list[i],children:[]};
            }
            if(category_list[i].level == 2){
                var my_parent_id = 'parent_'+category_list[i].parent_id;
                if(typeof category_structure[my_parent_id] !== 'undefined'){
                    category_structure[my_parent_id]['children'].push(category_list[i]);
                }
                else{
                    category_structure[my_parent_id] = {self:null,children:[category_list[i]]};
                }
            }
        }
        // Create HTML output.
        for(item in category_structure){
            var main_cat = category_structure[item];
            if(main_cat['self'].id == 1 && main_cat['self'].core == "yes"){
                category_html += '<option value="'+main_cat['self'].id+'" selected>'+main_cat['self'].title+'</option>';
            }
            else{
                category_html += '<optgroup label="'+main_cat['self'].title+'">';
                if(main_cat['children'].length > 0){
                    for(var x=0;x<main_cat['children'].length;x++){
                        category_html += '<option value="'+main_cat['children'][x].id+'">'+main_cat['children'][x].title+'</option>';
                    }
                }
                category_html += '</optgroup>';
            }
        }
        this.objects.category_box.html(category_html);
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
