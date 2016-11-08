<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><?php echo @$page_title;?></title>
    <meta name="description" content="<?php echo @$meta_description;?>" />
    <meta name="keywords" content="<?php echo @$meta_keywords;?>" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/libs/bootstrap/bootstrap.min.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/libs/font-awesome/css/font-awesome.min.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/plugins/toastr/toastr.min.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/plugins/fullsizable/css/jquery-fullsizable.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/plugins/fullsizable/css/jquery-fullsizable-theme.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/plugins/videojs/video-js.min.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/css/video-modal.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/css/frontend-common.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/css/results-layout.css" />
</head>
<body>
    <div id="page_wrapper">
        <header>
            <section id="top_bar" class="container-fluid max-width main-padding">
                <div id="logo">
                    <a href="<?php echo base_url();?>"><i class="fa fa-camera fa-lg" style="color:#D61"></i> Media Gallery</a>
                </div>
                <div id="actions">
                    <ul>
                        <li class="hasmenu">
                            <a>FAVORITES</a>
                            <div class="box-wrapper">
                                <ul class="submenu" id="menu_favorites">
                                    <li><a data-id="photos">Images <span class="badge" data-id="fav_badge_photos">0</span></a></li>
                                    <li><a data-id="videos">Videos <span class="badge" data-id="fav_badge_videos">0</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li>&nbsp;|&nbsp;</li>
                        <li><a>SIGN IN</a></li>
                    </ul>
                </div>
            </section>
        </header>
        <main>
            <div id="results_app">
                <section id="search_bar" tabindex="1">
                    <div class="container-fluid max-width main-padding">
                        <div id="search_box" class="float-left">
                            <?php echo @$search_widget;?>
                        </div>
                        <div class="float-right m-pagination">
                            <?php echo @$pagination;?>
                        </div>
                    </div>
                </section>
                <section class="container-fluid max-width">
                    <div data-id="breadcrumbs" style="padding-left:10px;padding-right:10px">
                        <?php echo @$breadcrumbs;?>
                    </div>
                </section>
                <section id="category_thumbs_display" class="container-fluid max-width">
                    <?php echo @$category_thumbs;?>
                </section>
                <section id="thumbs_display" class="container-fluid max-width">
                    <div class="clearfix" data-id="thumbs">
                        <!-- Result -->
                            <?php echo @$thumbs; ?>
                        <!-- /Result -->
                    </div>
                    <div class="ajax-loader" data-id="loading">
                        <div><i class="fa fa-refresh fa-2x rotating"></i></div>
                    </div>
                </section>
                <section id="media_item_display" class="container-fluid max-width media-item-display">
                    <?php echo @$media_item_details;?>
                </section>
                <section id="bottom_bar">
                    <div class="container-fluid max-width main-padding">
                        <div class="float-right m-pagination">
                            <!-- <?php echo @$pagination;?> -->
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>
    <footer>

    </footer>
    <!-- Modals -->
    <div class="modal" id="modal_favorites">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">My Favorites</h4>
                </div>
                <div class="modal-body">
                    <div class="row favorite-thumbs" data-id="contents">
                        <div class="favorites-loading"><img src="<?php echo base_url();?>assets/img/hourglass.gif" /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" id="modal_video" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div data-id="container">
                        <div class="title">Title</div>
                        <video id="modal_video_player" preload="none" class="video-js vjs-default-skin">
                            <source type="video/mp4">
                        </video>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" id="modal_media_details">
        <div class="modal-dialog modal-fluid">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Media Information</h4>
                </div>
                <div class="modal-body media-item-display loading">
                    <div class="row" data-id="contents">
                        <div class="col-xs-12 col-sm-8 media-block">
                            <div class="media">
                                <video id="video_item_object" preload="none" class="video-js vjs-default-skin vjs-big-play-centered" controls data-setup='{"fluid":true}'>
                                  <source src=" " type="video/mp4" />
                                </video>
                                <img id="image_item_object">
                                <div class="display-options">
                                    <span class="display-options-icon fullscreen" title="Fullscreen"></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-4 info-block">
                            <div class="info">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr><th colspan="2">Details</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>Title</td><td>&nbsp;</td></tr>
                                        <tr><td>Description</td><td>&nbsp;</td></tr>
                                        <tr><td>Dimension</td><td>&nbsp;</td></tr>
                                        <tr><td>File size</td><td>&nbsp;</td></tr>
                                    </tbody>
                                </table>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr><th>Tags</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>&nbsp;</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="image_fullscreen" class="fs-window">
        <div class="display-content"></div>
        <div class="exit-btn" title="Exit"></div>
    </div>
    <!-- /Modals -->
    <!-- Main Libs -->
    <script src="<?php echo base_url();?>assets/libs/jquery/jquery-2.2.4.min.js"></script>
    <script src="<?php echo base_url();?>assets/libs/bootstrap/bootstrap.min.js"></script>
    <!-- Plugins -->
    <script src="<?php echo base_url();?>assets/plugins/toastr/toastr.min.js"></script>
    <script src="<?php echo base_url();?>assets/plugins/fullsizable/js/jquery.fullsizable.js"></script>
    <script src="<?php echo base_url();?>assets/plugins/videojs/video.min.js"></script>
    <!-- <script src="<?php echo base_url();?>assets/js/video-modal.js"></script> -->
    <script src="<?php echo base_url();?>assets/js/frontend-app.js"></script>
    <script src="<?php echo base_url();?>assets/js/search-hint.js"></script>
    <script>
        var site = {base_url:"<?php echo base_url();?>"}
        $(document).ready(function(){
            favorites.init();
            results.init();

            $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();
                var isFixedTopbar = false;
                if(scroll > 43) {
                    isFixedTopbar = true;
                }
                if(isFixedTopbar){
                    $("header").addClass("fixed-top");
                    $("#search_bar").addClass("fixed-top");
                    $("#thumbs_display").addClass("scrolling-top");
                }
                else{
                    $("header").removeClass("fixed-top");
                    $("#search_bar").removeClass("fixed-top");
                    $("#thumbs_display").removeClass("scrolling-top");
                }
            });
            $('form[action="search"] [name="kw"]').searchHint();
        });
    </script>
    <?php echo @$result_js_init;?>
</body>
</html>