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
        // Identify objects.
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
        // Bind event handlers.
        this.self.unbind('hidden.bs.modal').on('hidden.bs.modal', (function(){
            this.data.editor_visible = false;
        }).bind(this));
        this.objects.editor_form.unbind().on('submit',this.save.bind(this));
        // Set UI behavior.
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
        // Disabled items.
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
