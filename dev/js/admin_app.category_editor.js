admin_app.category_editor =
{
    self: '#modal_category_editor',
    objects: {
        'modal_title': null,
        'editor_form': null,
        'publish_options': null,
        'category_levels': null,
        'category_parent_dropdown': null,
        'parent_level_block': null,
        'item': {
            'id': null,
            'title': null,
            'icon': null,
            'description': null,
            'category_level_main': null,
            'category_level_sub': null,
            'publish_yes': null,
            'publish_no': null
        },
        save_button: null,
        cancel_button: null
    },
    data: {
        editor_title: 'New Category',
        editor_visible: false,
        item: {
            id: "",
            level: null,
            type: null,
            title: "",
            description: "",
            icon: "",
            publish: "no"
        },
        type: "",
        disabled: {
            'id': false,
            'title': false,
            'description': false,
            'category_parent_input': false,
            'category_level_main': false,
            'category_level_sub': false,
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
        this.objects.publish_options = this.self.find('[name="publish"]');
        this.objects.parent_level_block = this.self.find('[data-id="parent_category"]');
        this.objects.category_levels = this.self.find('[name="level"]');
        this.objects.category_parent_dropdown = this.self.find('[data-id="parent_category"] select');
        this.objects.item.id = this.self.find('[name="id"]');
        this.objects.item.title = this.self.find('[name="title"]');
        this.objects.item.description = this.self.find('[name="description"]');
        this.objects.item.icon = this.self.find('[name="icon"]');
        this.objects.item.category_level_main = this.self.find('[name="level"][value="1"]');
        this.objects.item.category_level_sub = this.self.find('[name="level"][value="2"]');
        this.objects.item.publish_yes = this.self.find('input[value="yes"]');
        this.objects.item.publish_no = this.self.find('input[value="no"]');
        this.objects.item.save_button = this.self.find('button[type="submit"]');
        this.objects.item.cancel_button = this.self.find('button[type="button"]');
        // Set UI behavior.
        this.self.unbind('hidden.bs.modal').on('hidden.bs.modal', (function(){
            this.data.editor_visible = false;
        }).bind(this));
        this.self.modal({backdrop: 'static'}).modal('hide');
        this.data.disabled = {
            'id': false,
            'title': false,
            'description': false,
            'publish_yes': false,
            'publish_no': false
        }
        // Bind event handlers.
        this.objects.category_levels.unbind().on('click',this.setLevel.bind(this));
        this.objects.editor_form.unbind().on('submit',this.save.bind(this));
    },
    render: function() {
        // Update parent category dropdown list box contents.
        var parent_dropdown_html = '';
        for(var i=0;i<admin_app.category.data.media_list.length;i++){
            var current_item = admin_app.category.data.media_list[i];
            if((current_item.id > 1) && (current_item.level == 1)) parent_dropdown_html += '<option value="'+current_item.id+'">'+current_item.title+'</option>';
        }
        this.objects.parent_level_block.find('select.list').html(parent_dropdown_html);
        // Update input field values.
        this.self.find('.error').removeClass('error');
        this.objects.modal_title.text(this.data.editor_title);
        this.objects.item.id.val(this.data.item.id);
        this.objects.item.title.val(this.data.item.title);
        this.objects.item.description.val(this.data.item.description);
        this.objects.item.icon.val(this.data.item.icon);
        // Update category level radio buttons & sub category dropdown display logic.
        if(this.self.find('[name="level"]:checked').val() == 1){
            this.objects.parent_level_block.css('display','none');
        }
        else{
            this.objects.category_parent_dropdown.val(this.data.item.parent_id);
            this.objects.parent_level_block.css('display','block');
        }
        // Update publish radio button display logic.
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
            type: admin_app.category.data.media_type,
            level: 1,
            description: "",
            icon: "",
            parent_id: 0,
            publish: "no"
        }
        this.data.disabled['id'] = false;
        this.data.disabled['title'] = false;
        this.data.disabled['description'] = false;
        this.data.disabled['publish_yes'] = false;
        this.data.disabled['publish_no'] = false;
        this.data.disabled['category_level_main'] = false;
        this.data.disabled['category_level_sub'] = false;
        this.data.editor_title = "New Category ("+admin_app.category.data.media_type.ucfirst()+")";
        this.data.editor_visible = true;
        this.objects.category_levels.each(function(){
            if($(this).val() == 1) {
                $(this).prop('checked',true);
            }
            else {
                $(this).prop('checked',false);
            }
        });
        this.render();
    },
    edit: function(data) {
        this.data.task = "update";
        this.data.item = {
            id: data.id,
            title: data.title,
            type: admin_app.category.data.media_type,
            level: data.level,
            description: data.description,
            icon: data.icon,
            parent_id: data.parent_id,
            publish: data.published
        }
        this.objects.category_levels.each(function(){
            if($(this).val() == data.level) {
                $(this).prop('checked',true);
            }
            else {
                $(this).prop('checked',false);
            }
        });
        if(data.level == 1){
            this.data.disabled['category_level_main'] = false;
            this.data.disabled['category_level_sub'] = true;
        }
        else{
            this.data.disabled['category_level_main'] = true;
            this.data.disabled['category_level_sub'] = false;
        }
        if(data.core == "yes") {
            this.data.disabled['title'] = true;
            this.data.disabled['description'] = true;
        }
        else {
            this.data.disabled['title'] = false;
            this.data.disabled['description'] = false;
        }
        this.data.disabled['publish_yes'] = false;+")"
        this.data.disabled['publish_no'] = false;

        this.data.editor_title = "Edit Category ("+admin_app.category.data.media_type.ucfirst()+")";
        this.data.editor_visible = true;
        this.render();
    },
    setLevel: function() {
        this.data.item.title = this.objects.item.title.val();
        this.data.item.description = this.objects.item.description.val();
        this.data.item.icon = this.objects.item.icon.val();
        this.render();
    },
    save: function(e) {
        e.preventDefault();
        var errors = 0;
        this.data.item.id = this.objects.item.id.val();
        this.data.item.title = this.objects.item.title.val();
        this.data.item.description = this.objects.item.description.val();
        this.data.item.icon = this.objects.item.icon.val();
        this.data.item.publish = this.self.find('[name="publish"]:checked').val();
        this.data.item.level = this.self.find('[name="level"]:checked').val();
        // Validate inputs.
        if($.trim(this.data.item.title).length == 0) {
            this.objects.item.title.addClass('error');
            errors++;
        }
        if(this.data.item.level == 1){
            this.data.item.parent_id = 0;
        }
        else{
            var category_parent = this.objects.category_parent_dropdown;
            if(category_parent.val() === null){
                this.data.item.parent_id = 0;
                category_parent.addClass('error');
                errors++;
            }
            else{
                category_parent.removeClass('error');
                this.data.item.parent_id = category_parent.val();
            }
        }
        if(errors === 0) {
            this.objects.item.title.removeClass('error');
            this.disableState();
            var data = this.data.item;
            $.ajax({
                url: site.base_url+'categories/manage/'+this.data.task,
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
