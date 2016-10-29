<div class="content-toolbar content-box clearfix">
    <form id="content_toolbar_form">
        <div class="control-left">
            <select class="form-control input-sm" name="type">
                <option value="photos">Photos</option>
                <option value="videos">Videos</option>
            </select>
            <select class="form-control input-sm" name="category">
<?php foreach($categories as $category): ?>
                <option value="<?php echo $category['id'];?>"><?php echo ucwords($category['title']);?></option>
<?php endforeach;?>
            </select>
            <input id="file_input" type="file" name="files" multiple="true" style="display:none" />
        </div>
        <div class="control-right"></div>
    </form>
</div>
<div id="file_drop_box">
    <div>
        <h3>Drop files here</h3>
        <p>or<br>click to browse</p>
    </div>
    <div class="zone"></div>
</div>
<div id="file_list_box">
    
    <!--
    <div class="media-item clearfix uploading">
        <div class="item">
            <div class="pinkynail">
            <i class="fa fa-lg"></i>
            </div>
            <span>avatar-horse</span>
        </div>
        <div class="control">
            <div class="ul-progress-bar">
                <div class="progress"></div>
            </div>
            <a class="btn btn-warning" data-control="abort">Abort</a>
            <a class="btn btn-primary" data-control="edit">Edit</a>
            <a class="btn btn-danger" data-control="delete">Delete</a>
        </div>
    </div>
    
    <div class="media-item clearfix converting active">
        <div class="item">
            <div class="pinkynail"">
            <i class="fa fa-lg"></i>
            </div>
            <span>avatar-horse</span>
        </div>
        <div class="control">
            <div class="ul-progress-bar">
                <div class="progress"></div>
            </div>
            <a class="btn btn-warning" data-control="abort">Abort</a>
            <a class="btn btn-primary" data-control="edit">Edit</a>
            <a class="btn btn-danger" data-control="delete">Delete</a>
        </div>
    </div>

    <div class="media-item clearfix errored">
        <div class="item">
            <div class="pinkynail">
            <i class="fa fa-lg fa-warning"></i>
            </div>
            <span>avatar-horse</span>
        </div>
        <div class="control">
            <div class="ul-progress-bar">
                <div class="progress"></div>
            </div>
            <a class="btn btn-warning" data-control="abort">Abort</a>
            <a class="btn btn-primary" data-control="edit">Edit</a>
            <a class="btn btn-danger" data-control="delete">Delete</a>
        </div>
    </div>

    <div class="media-item clearfix completed">
        <div class="item">
            <div class="pinkynail" style="background-image:url('http://gallery.loc/media/images/public/128/5794aeb359379.jpg');">
            <i class="fa fa-lg"></i>
            </div>
            <span>avatar-horse</span>
        </div>
        <div class="control">
            <div class="ul-progress-bar">
                <div class="progress"></div>
            </div>
            <a class="btn btn-warning" data-control="abort">Abort</a>
            <a class="btn btn-primary" data-control="edit">Edit</a>
            <a class="btn btn-danger" data-control="delete">Delete</a>
        </div>
    </div>
    -->
    
</div>