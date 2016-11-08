<div class="row">
    <div class="col-xs-12 col-sm-8 media-block">
        <div class="media media-video">
            <video id="video_item_display" class="video-js vjs-default-skin vjs-big-play-centered"
              controls preload="auto"
              poster="<?php echo @$poster_url;?>"
              data-setup='{"fluid":true}'>
              <source src="<?php echo @$video_url;?>" type="video/mp4" />
            </video>
        </div>
    </div>
    <div class="col-xs-12 col-sm-4 info-block">
        <div class="info">
            <table class="table table-bordered">
                <thead>
                    <tr><th colspan="2">Details</th></tr>
                </thead>
                <tbody>
                    <tr><td>Title</td><td><?php echo @$title;?></td></tr>
                    <tr><td>Description</td><td><?php echo @$description;?></td></tr>
                    <tr><td>Dimension</td><td><?php echo @$dimension;?></td></tr>
                    <tr><td>File size</td><td><?php echo @$file_size;?></td></tr>
                </tbody>
            </table>
            <table class="table table-bordered">
                <thead>
                    <tr><th>Tags</th></tr>
                </thead>
                <tbody>
                    <tr><td>
                    <?php foreach($tags as $tag):?>
                        <a class="label label-default" href="<?php echo base_url("search/videos?kw={$tag}");?>"><?php echo @$tag;?></a>
                    <?php endforeach;?>
                    </td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
