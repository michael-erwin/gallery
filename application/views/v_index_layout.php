<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gallery</title>
    <meta name="description" content="Search high quality and royalty free stock images and videos." />
    <meta name="keywords" content="stock photos, stock images, stock videos, images, photos, videos" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/libs/bootstrap/bootstrap.min.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/libs/font-awesome/css/font-awesome.min.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/css/frontend-common.css" />
    <link rel="stylesheet" href="<?php echo base_url();?>assets/css/index-layout.css" />
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
                            <ul class="submenu" id="menu_favorites">
                                <li><a data-id="photos">Images <span class="badge" data-id="fav_badge_photos">0</span></a></li>
                                <li><a data-id="videos">Videos <span class="badge" data-id="fav_badge_videos">0</span></a></li>
                            </ul>
                        </li>
                        <li>&nbsp;|&nbsp;</li>
                        <li><a>SIGN IN</a></li>
                    </ul>
                </div>
            </section>
        </header>
        <main>
            <div id="cta_block">
                <div class="background" style="background-image:url(<?php echo @$backdrop_image;?>)"></div>
                <div class="foreground">
                    <div class="search_action">
                        <form id="search_action_form">
                            <div class="search_action_container">
                                <input type="hidden" name="type" value="images">
                                <input type="text" name="kw" placeholder="Search for images">
                                <span class="separator"></span>
                                <div id="media_type_box" class="media-type" tabindex="1">
                                    <div id="search_type"><span class="text">Images</span> <span class="caret"></span></div>
                                    <ul>
                                        <li><a data-value="images">Images</a></li>
                                        <li><a data-value="videos">Videos</a></li>
                                    </ul>
                                </div>
                                <button><i class="fa fa-search"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div id="categories_block" class="max-width">
                <h2>Browse Categries</h2>
                <section class="container-fluid">
                    <!--
                    <div class="thumb-box col-xs-6 col-sm-4 col-md-3"><div class="category-thumb"></div></div>
                    -->
                    <?php echo @$category_thumbs;?>
                </section>
            </div>
        </main>
    </div>
    <footer>

    </footer>
    <!-- Modals -->
    <div class="modal" id="modal_favorites" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">My Favorites</h4>
                </div>
                <div class="modal-body">
                    <div class="row favorite-thumbs" data-id="contents">
                        <div class="favorites-loading"><img src="/assets/img/hourglass.gif" /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Modals -->
    <!-- Main Libs -->
    <script src="<?php echo base_url();?>assets/libs/jquery/jquery-2.2.4.min.js"></script>
    <script src="<?php echo base_url();?>assets/libs/bootstrap/bootstrap.min.js"></script>
    <!-- Plugins -->
    <script src="<?php echo base_url();?>assets/js/frontend-app.js"></script>
    <script>
        $(document).ready(function(){
            favorites.init();
            $("#media_type_box a").click(function(){
                $("#media_type_box").blur();
                $("#search_type .text").text($(this).text());
                $("#search_action_form [name=\"type\"]").val($(this).attr('data-value'));
                $("#search_action_form [name=\"kw\"]").attr("placeholder","Search for "+$(this).attr('data-value'));
            });
            $("#search_action_form").submit(function(e){
                e.preventDefault();
                var action_url = location.protocol+'//'+location.host+'/search/'+$("#search_action_form [name=\"type\"]").val()+'?kw='+encodeURIComponent($("#search_action_form [name=\"kw\"]").val());
                location = action_url;
            });
        });
    </script>
    <?php echo @$result_js_init;?>
</body>
</html>