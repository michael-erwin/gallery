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
        var type = (caller_app.data.media_type=="photos")? "photos" : caller_app.data.media_type;
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
