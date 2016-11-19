<div class="modal common" id="modal_category_editor" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <form data-id="editor_form">
                <input type="hidden" name="id" />
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Category Edit</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group clearfix row">
                            <div class="col-sm-2">
                                Title
                            </div>
                            <div class="col-sm-10">
                                <input type="text" class="form-control input-sm" name="title" />
                            </div>
                        </div>
                        <div class="form-group clearfix row">
                            <div class="col-sm-2">
                                Description
                            </div>
                            <div class="col-sm-10">
                                <textarea class="form-control input-sm" name="description"></textarea>
                            </div>
                        </div>
                        <div class="form-group clearfix row">
                            <div class="col-sm-2">
                                Icon
                            </div>
                            <div class="col-sm-10">
                                <input type="text" class="form-control input-sm" name="icon" placeholder="http://" />
                            </div>
                        </div>
                        <div class="form-group clearfix row">
                            <div class="col-sm-2">
                                Publish
                            </div>
                            <div class="col-sm-10">
                                <label><input type="radio" name="publish" value="yes" selected="true">&nbsp;Yes</label>
                                &nbsp;
                                <label><input type="radio" name="publish" value="no">&nbsp;No</label>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" data-id="save_btn">Save</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
