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
        items:[],
        selector_visible: false,
        endpoint: null,
        passed_fn: null
    },
    init: function(){
        // Define objects.
        this.self = $(this.self);
        this.objects.selection_form = this.self.find('[data-id="selector_form"]');
        this.objects.selection_count = this.self.find('[data-id="item_count"]')
        this.objects.selection_box = this.self.find('[data-id="category_box"]');
        this.objects.save_button = this.self.find('[data-id="save_button"]');
        this.objects.cancel_button = this.self.find('[data-id="cancel_button"]');
        // Set normal behaviour.
        this.self.modal({backdrop: 'static'}).modal('hide');
        // Bind event handlers.
        this.self.unbind('hidden.bs.modal').on('hide.bs.modal', (function(){
            this.data.selector_visible = false;
            $('select[data-id="bulk_operation"]').val('default');
        }).bind(this));
        this.objects.selection_form.unbind().on('submit', this.save.bind(this));
    },
    render: function(){
        var category_structure = {};
        var category_html = "";
        var categories = admin_app.library.data.category_list;
        // Build category structure.
        for(var i=0;i<categories.length;i++) {
            if(categories[i].level == 1){
                category_structure['parent_'+categories[i].id] = {self:categories[i],children:[]};
            }
            if(categories[i].level == 2){
                var my_parent_id = 'parent_'+categories[i].parent_id;
                if(typeof category_structure[my_parent_id] !== 'undefined'){
                    category_structure[my_parent_id]['children'].push(categories[i]);
                }
                else{
                    category_structure[my_parent_id] = {self:null,children:[categories[i]]};
                }
            }
        }
        // Create HTML output.
        for(item in category_structure){
            var main_cat = category_structure[item];
            if(main_cat['self'].id == 1 && main_cat['self'].core == "yes"){
                if(this.data.item.category_id == main_cat['self'].id){ // Select category for currently selected item.
                    category_html += '<option value="'+main_cat['self'].id+'" selected>'+main_cat['self'].title+'</option>';
                }
                else{
                    category_html += '<option value="'+main_cat['self'].id+'">'+main_cat['self'].title+'</option>';
                }
            }
            else{
                category_html += '<optgroup label="'+main_cat['self'].title+'">';
                if(main_cat['children'].length > 0){
                    for(var x=0;x<main_cat['children'].length;x++){
                        if(this.data.item.category_id == main_cat['children'][x].id){ // Select category for currently selected item.
                            category_html += '<option value="'+main_cat['children'][x].id+'" selected>'+main_cat['children'][x].title+'</option>';
                        }
                        else{
                            category_html += '<option value="'+main_cat['children'][x].id+'">'+main_cat['children'][x].title+'</option>';
                        }
                    }
                }
                category_html += '</optgroup>';
            }
        }
        this.objects.selection_box.html(category_html);
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
        this.data.endpoint = endpoint; //
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
