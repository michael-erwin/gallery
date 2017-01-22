<div class="modal common" id="modal_photo_editor" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Photo Edit</h4>
                </div>
                <div class="modal-body">
                    <div class="modal-media-box loading">
                        <img data-id="photo" data-src="">
                    </div>
                    <div class="modal-info-box">
                        <div class="meta clearfix">
                            <div class="meta-label">Date added</div>
                            <div class="meta-value" data-id="date_added"></div>
                            <div class="meta-label">Date modified</div>
                            <div class="meta-value" data-id="date_modified"></div>
                            <div class="meta-label">Filesize</div>
                            <div class="meta-value" data-id="file_size"></div>
                            <div class="meta-label">Dimension</div>
                            <div class="meta-value" data-id="dimension"></div>
                        </div>
                        <hr>
                        <div class="data clearfix">
                            <div class="data-label">Name</div>
                            <div class="data-value"><input type="text" class="form-control" name="title"></div>
                            <div class="data-label">Description</div>
                            <div class="data-value"><textarea class="form-control" name="description"></textarea></div>
                            <div class="data-label">Tags</div>
                            <div class="data-value">
                                <ul class="input-tags">
                                    <!--<li class="input-text" contenteditable="true"></li>-->
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-id="save_btn">Save</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
