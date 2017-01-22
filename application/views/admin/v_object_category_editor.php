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
                            <div class="col-sm-3">
                                Title
                            </div>
                            <div class="col-sm-9">
                                <input type="text" class="form-control input-sm" name="title" />
                            </div>
                        </div>
                        <div class="form-group clearfix row">
                            <div class="col-sm-3">
                                Description
                            </div>
                            <div class="col-sm-9">
                                <textarea class="form-control input-sm" name="description"></textarea>
                            </div>
                        </div>
                        <div class="form-group clearfix row">
                            <div class="col-sm-3">
                                Icon
                            </div>
                            <div class="col-sm-9">
                                <input type="text" class="form-control input-sm" name="icon" placeholder="http://" />
                            </div>
                        </div>
                        <div data-id="levels" class="form-group clearfix row">
                            <div class="col-sm-3">Level</div>
                            <div class="col-sm-9">
                                <div class="row">
                                    <div class="col-xs-6"><label><input type="radio" name="level" value="1" checked>&nbsp;Main</label></div>
                                    <div class="col-xs-6"><label><input type="radio" name="level" value="2">&nbsp;Sub</label></div>
                                </div>
                            </div>
                        </div>
                        <div data-id="parent_category" class="form-group clearfix row">
                            <div class="col-sm-3">Parent</div>
                            <div class="col-sm-9">
                                <select class="form-control input-sm list"></select>
                            </div>
                        </div>
                        <div class="form-group clearfix row">
                            <div class="col-sm-3">
                                Publish
                            </div>
                            <div class="col-sm-9">
                                <div class="row">
                                    <div class="col-xs-6"><label><input type="radio" name="publish" value="yes" checked>&nbsp;Yes</label></div>
                                    <div class="col-xs-6"><label><input type="radio" name="publish" value="no">&nbsp;No</label></div>
                                </div>
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
