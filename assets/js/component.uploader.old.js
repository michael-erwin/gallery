admin_app.uploader_old =
{
    action_object: "",
    allowed_types: [],
    upload_type: "",
    init: function() {
        var drop_box = $("#file_drop_box");
        var drop_zone = $("#file_drop_box .zone");
        var file_input = $("#file_input");

        // Initialize drop zone box event handlers.
        drop_zone.on('dragenter', function (e){
            e.stopPropagation();
            e.preventDefault();
            drop_box.addClass("drag-over");
        });
        drop_zone.on('dragover', function (e){
            e.stopPropagation();
            e.preventDefault();
        });
        drop_zone.on('drop', function (e){
            drop_box.removeClass("drag-over");
            e.preventDefault();
            var files = e.originalEvent.dataTransfer.files;
            admin_app.uploader.handleInput(files);
        });
        drop_zone.on('dragleave', function (e){
            e.stopPropagation();
            e.preventDefault();
            drop_box.removeClass("drag-over");
        });
        drop_zone.on('click', function(e){
            file_input.trigger('click');
        });
        file_input.on('change', function(e){
            var files = e.target.files;
            admin_app.uploader.handleInput(files);
        });

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
    },
    handleInput: function(files) {
        /**
        * Receives files from drop or browse action.
        * @param {object} files Filelist object returned from drag and drop or
        *                       from file input element.
        */
        var list_box = $('#file_list_box');
        var file_type = $('#content_toolbar_form [name="type"]').val();
        var category_id = $('#content_toolbar_form [name="category"]').val();
        var allowed_types = [];
        var upload_path = "";

        // Determine file type.
        if(file_type == "photos") {
            allowed_types = ['image/jpeg','image/pjpeg','image/png','image/bmp','image/x-windows-bmp','image/gif'];
            action_object = "images";
        }
        if(file_type == "videos") {
            allowed_types = ['video/mp4','video/mpeg','video/mpeg','video/quicktime','video/x-matroska','video/x-flv','video/x-msvideo','video/x-ms-wmv'];
            action_object = "videos";
        }

        // Apply necessary settings for the file type.
        admin_app.uploader.upload_type = file_type;
        admin_app.uploader.allowed_types = allowed_types;
        admin_app.uploader.action_object = action_object;

        // Prepare payload object.
        var payload = {
            "category": category_id,
            "container": list_box,
            "files": files
        }

        // Pass the files to uploader and trigger the upload process.
        admin_app.uploader.start(payload);
    },
    start: function(payload) {
        var files = payload.files;
        var files_category = payload.category;
        var container_element = payload.container;

        function initEntry(form_data,container_element,app) {
            var file_entry_component = new app.fileEntry(container_element);
            var file_title = files[i].name.split('.');file_title.pop();
            file_entry_component.setName(file_title);
            // app.sendFile(form_data,file_entry_component,this.action_object);
        }

        for(var i=0; i<files.length; i++) {
            var form_data = new FormData();
            form_data.append('file', files[i]);
            form_data.append('category_id', files_category);

            // Validate files.
            if($.inArray(files[i].type,this.allowed_types) > -1) {
                initEntry(form_data,container_element,this);
            }
            else {
                toastr["error"]("File "+files[i].type+" is not allowed.");
            }
        }
    },
    fileEntry: function(default_ob) {
        this.container = $('<div class="media-item uploading clearfix"></div>');
        this.item = $('<div class="item"></div>').appendTo(this.container);
        this.control = $('<div class="control"></div>').appendTo(this.container);
        this.item_pinkynail = $('<div class="pinkynail"><i class="fa fa-lg"></i></div>').appendTo(this.item);
        this.item_name = $('<span>undefined</span>').appendTo(this.item);
        this.control_progress_bar = $('<div class="ul-progress-bar"></div>').appendTo(this.control);
        this.control_progress_level = $('<div class="progress" data-control="progress"></div>').appendTo(this.control_progress_bar);
        this.control_abort = $('<a class="btn btn-warning" data-control="abort">Abort</a>').appendTo(this.control);
        this.control_edit = $('<a class="btn btn-primary" data-control="edit">Edit</a>').appendTo(this.control);
        this.control_delete = $('<a class="btn btn-danger" data-control="delete">Delete</a>').appendTo(this.control);
        this.attach = function(ob){
          if(ob) this.container.appendTo(ob);
        }
        this.error = function() {
            this.container.removeClass("uploading").addClass('errored');
        }
        this.setProgress = function(amount) {
            this.control_progress_level.width(amount+'%');
        }
        this.setName = function(name) {
            this.item_name.text(name);
        }
        this.setAbort = function(fn){
            this.control_abort.click(fn);
        }
        this.setEdit = function(fn) {
            this.control_edit.click(fn);
        }
        this.setDelete = function(fn) {
            this.control_delete.click(fn);
        }
        this.setComplete = function(image_uid,type) {
            if(type == "images") {
                this.container.removeClass("uploading").addClass("completed");
                this.item_pinkynail.css('background-image','url('+site.base_url+'media/'+type+'/public/128/'+image_uid+'.jpg');
            }
            else if(type == "videos") {
                this.container.removeClass("uploading").addClass("converting");
            }
            else {
                toastr["error"]("Unknown media type.");
            }
        }
        if(default_ob) this.attach(default_ob);
    },
    sendFile: function(data,component,media_type) {
        var item_name = component.item_name.text();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', site.base_url+'upload/'+this.upload_type, true);
        xhr.upload.onprogress = function(e) {
            if(e.lengthComputable) {
                var percent = Math.ceil((e.loaded/e.total) * 100);
                component.setProgress(percent);
            }
        }
        component.setAbort(function(){
            xhr.abort();
            component.container.remove();
        });
        xhr.error = function(e) {
            toastr["warning"]("Failed to upload "+item_name+".");
        }
        xhr.onload = function(e) {
            try {
                var response = JSON.parse(xhr.responseText);
                var id = response.data.id;
                var uid = response.data.uid;
                if(response.status == "ok") {
                    component.setComplete(uid,media_type);
                    component.setEdit(function(){admin_app.image_editor.open(id,component)});
                    component.setDelete(function(){
                        var delete_item = function() {
                            $.ajax({
                                "method": "post",
                                "url": site.base_url+this.action_object+'/delete',
                                "data": "id="+id,
                                "error" : function(jqXHR,textStatus,errorThrown){
                                    toastr["error"]("Failed to delete \""+item_name+"\".", "Error "+jqXHR.status);
                                },
                                "success": function(response){
                                    if(response.status == "ok"){
                                        component.container.remove();
                                        toastr["success"]("Deleted \""+item_name+"\".");
                                    }
                                    else{
                                        toastr["error"]("Failed to delete \""+item_name+"\".", "Error 500");
                                    }
                                }
                            });
                        }
                        modal.confirm("Delete the file named \""+item_name+"\"?",delete_item);
                    });
                }
            }
            catch(e) {
                component.error();
                toastr["warning"]("Failed to upload "+item_name+".");
            }
        }
        xhr.send(data);
    }
}