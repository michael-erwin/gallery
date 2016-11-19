<div class="content-toolbar content-box clearfix">
    <!-- <form id="content_toolbar_form"> -->
        <div class="control-left">
            <select class="form-control input-sm" data-id="media_type">
                <option value="images">Photos</option>
                <option value="videos">Videos</option>
            </select>
            <select class="form-control input-sm" data-id="category">
                <option value="" selected="true">All</option>
<?php foreach($categories as $category): ?>
                <option value="<?php echo $category['id'];?>"><?php echo ucwords($category['title']);?></option>
<?php endforeach;?>
            </select>
            <input id="file_input" type="file" name="files" multiple="true" style="display:none" />
            <a href="<?php echo base_url().'admin/media/upload';?>" class="btn btn-control silent-link btn-sm">Upload</a>
        </div>
        <div class="control-right">
            <div class="toolbar-search">
                <form data-id="search_form">
                    <input type="text" class="form-control input-sm" placeholder="Search..." data-id="search_box" />
                    <button data-id="search_btn">
                        <i class="fa fa-search"></i>
                    </button>
                </form>
            </div>
        </div>
    <!-- </form> -->
</div>
<div class="content-block clearfix">
    <div class="float-left">
        <div data-id="display_buttons">
            <button title="Thumbnail view" class="btn btn-default btn-sm active" data-display="thumb">
                <i class="fa fa-th-large"></i>
            </button>
            <button title="List view" class="btn btn-default btn-sm" data-display="list">
                <i class="fa fa-th-list"></i>
            </button>
        </div>
    </div>
    <div class="m-pagination float-right">
        <button class="btn btn-default btn-sm prev"><i class="glyphicon glyphicon-chevron-left"></i></button>
        <input type="text" class="form-control input-sm index" />
        <span class="of-pages">&nbsp;of <span class="total">5</span>&nbsp;</span>
        <button class="btn btn-default btn-sm next"><i class="glyphicon glyphicon-chevron-right"></i></button>
    </div>
</div>
<div class="content-block row" data-id="content">
    <!-- Thumbnails will load here. -->
</div>
<div class="content-block clearfix">
    <div class="m-pagination float-right">
        <button class="btn btn-default btn-sm prev"><i class="glyphicon glyphicon-chevron-left"></i></button>
        <input type="text" class="form-control input-sm index" />
        <span class="of-pages">&nbsp;of <span class="total">5</span>&nbsp;</span>
        <button class="btn btn-default btn-sm next"><i class="glyphicon glyphicon-chevron-right"></i></button>
    </div>
</div>