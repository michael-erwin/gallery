<?php if($type=="photos"):?>
<form data-id="search_form" action="search">
    <input type="hidden" name="type" value="photos" />
    <div style="display:inline-block;vertical-align:middle;position:relative">
        <div class="input-group">
            <input type="text" name="kw" autocomplete="off" class="form-control input-search" placeholder="Search for..." value="<?php echo trim(@$_GET['kw']);?>" />
            <div class="search-types" tabindex="1">
                <a rel="dropdown-link"><span data-id="search_box_display">Photos</span> <span class="caret"></span></a>
                <ul class="dropdown-option">
                    <li data-text="Photos" data-value="photos" data-id="search_box_option" class="selected"><a><i class="fa fa-check"></i> Photos</a></li>
                    <li data-text="Videos" data-value="videos" data-id="search_box_option"><a><i class="fa fa-check"></i> Videos</a></li>
                </ul>
            </div>
            <span class="input-group-btn">
                <button class="btn btn-default" type="submit"><i class="fa fa-search"></i></button>
            </span>
        </div>
        <div id="search_hint_box" class="search-hint-box"></div>
    </div>
</form>
<?php elseif($type=="videos"):?>
<form data-id="search_form" action="search">
    <input type="hidden" name="type" value="videos" />
    <div style="display:inline-block;vertical-align:middle;position:relative">
        <div class="input-group">
            <input type="text" name="kw" autocomplete="off" class="form-control input-search" placeholder="Search for..." value="<?php echo trim(@$_GET['kw']);?>" />
            <div class="search-types" tabindex="1">
                <a rel="dropdown-link"><span data-id="search_box_display">Videos</span> <span class="caret"></span></a>
                <ul class="dropdown-option">
                    <li data-text="Photos" data-value="photos" data-id="search_box_option"><a><i class="fa fa-check"></i> Photos</a></li>
                    <li data-text="Videos" data-value="videos" data-id="search_box_option" class="selected"><a><i class="fa fa-check"></i> Videos</a></li>
                </ul>
            </div>
            <span class="input-group-btn">
                <button class="btn btn-default" type="submit"><i class="fa fa-search"></i></button>
            </span>
        </div>
        <div id="search_hint_box" class="search-hint-box"></div>
    </div>
</form>
<?php endif;?>
