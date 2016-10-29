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
    // Bind events.
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

        // Set common objects.
        this.objects.drop_box = $("#file_drop_box"),
        this.objects.drop_zone = this.objects.drop_box.find('.zone');
        this.objects.file_list_box = $('#file_list_box');
        this.objects.category_box = $('#content_toolbar_form [name="category"]');
        this.objects.file_input = $("#file_input");
        this.objects.media_type_box = $('#content_toolbar_form [name="type"]');

        // Set media selection events.
        this.objects.media_type_box.unbind().on('change',this.setMedia.bind(this));
        this.objects.category_box.unbind().on('change',this.setMedia.bind(this));

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
        $(document).unbind('dragenter').unbind().on('dragenter', function (e){
            e.stopPropagation();
            e.preventDefault();
        });
        $(document).unbind('dragover').unbind().on('dragover', function (e){
          e.stopPropagation();
          e.preventDefault();
        });
        $(document).unbind('drop').unbind().on('drop', function (e){
            e.stopPropagation();
            e.preventDefault();
        });
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
    },
    setMedia: function() {
        this.data.media_type = this.objects.media_type_box.val();
        this.data.media_category = this.objects.category_box.val();
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
        form_data.append('category_id', this.data.media_category);

        // Events.
        xhr.error = function(e) {
            toastr["warning"]("Failed to upload "+item_name+".");
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
    handleInput(files_list) {
        var type = this.data.media_type;
        var allowed_types = null;
        var total_count = files_list.length+this.objects.files.length;

        if(type == "photos") allowed_types = this.data.allowed_photos;
        if(type == "videos") allowed_types = this.data.allowed_videos;

        for(var i = 0; i < files_list.length; i++) {
            if($.inArray(files_list[i].type, allowed_types) != -1) {
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