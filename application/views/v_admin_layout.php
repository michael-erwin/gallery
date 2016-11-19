<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <title>Admin</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <!-- Library Dependency -->
    <link href="<?php echo base_url();?>assets/libs/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/libs/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet">
    <!-- Plugins Dependency -->
    <link href="<?php echo base_url();?>assets/plugins/toastr/toastr.min.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/plugins/fullsizable/css/jquery-fullsizable.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/plugins/fullsizable/css/jquery-fullsizable-theme.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/plugins/videojs/video-js.min.css" rel="stylesheet">
    <!-- Main Style -->
    <link href="<?php echo base_url();?>assets/css/admin.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/css/admin-skin.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/css/video-modal.css" rel="stylesheet">
    <!-- Common Resets -->
    <link href="<?php echo base_url();?>assets/css/common.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/css/admin-components.css" rel="stylesheet">
    <!--
    <link href="<?php echo base_url();?>assets/plugins/pace/pace-minimal.css" rel="stylesheet">
    <script src="<?php echo base_url();?>assets/plugins/pace/pace.min.js"></script>
    -->
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body class="hold-transition skin-custom sidebar-mini">
    <div class="wrapper">
        <!-- Main Header -->
        <header class="main-header" id="main_header">
            <!-- Logo -->
            <a class="logo" href="<?php echo base_url();?>">
                <!-- mini logo for sidebar mini 50x50 pixels -->
                <span class="logo-mini"><i class="fa fa-camera fa-lg"></i></span>
                <!-- logo for regular state and mobile devices -->
                <span class="logo-lg"><i class="fa fa-camera fa-lg"></i> Media Gallery</span>
            </a>
            <!-- Header Navbar -->
            <nav class="navbar navbar-static-top" role="navigation">
                <!-- Sidebar toggle button-->
                <a class="sidebar-toggle" data-toggle="offcanvas" href="#" role="button"><span class="sr-only">Toggle navigation</span></a> <!-- Navbar Right Menu -->
                <div class="navbar-custom-menu">
                    <ul class="nav navbar-nav">
                        <!-- Other notifications go here... -->
                        <!-- User Account Menu -->
                        <li class="dropdown user user-menu">
                            <!-- Menu Toggle Button -->
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            <!-- The user image in the navbar-->
                            <img alt="User Image" class="user-image" src="<?php echo base_url();?>assets/img/user.jpg">
                            <!-- hidden-xs hides the username on small devices so only the image appears. -->
                            <span class="hidden-xs">Johnnie Walker</span></a>
                            <ul class="dropdown-menu">
                                <!-- The user image in the menu -->
                                <li class="user-header">
                                    <img alt="User Image" class="img-circle" src="<?php echo base_url();?>assets/img/user.jpg">
                                    <p>Johnnie Walker - Administrator <small>Member since Jan. 2015</small></p>
                                </li>
                                <!-- Menu Body -->
                                <!-- Menu Footer-->
                                <li class="user-footer">
                                    <div class="pull-left">
                                        <a class="btn btn-default btn-flat" href="#">Profile</a>
                                    </div>
                                    <div class="pull-right">
                                        <a class="btn btn-default btn-flat" href="#">Sign out</a>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <!-- Left side column. contains the logo and sidebar -->
        <aside class="main-sidebar">
            <!-- sidebar -->
            <section class="sidebar">
                <!-- Sidebar user panel (optional) -->
                <?php echo @$sidebar_user_panel;?>
                <!-- Sidebar Menu -->
                <?php echo @$sidebar_menu;?>
                <!-- /.sidebar-menu -->
            </section>
            <!-- /.sidebar -->
        </aside>
        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <section class="content-header">
                <h1>Page Title <small>Page Description</small></h1>
                <ol class="breadcrumb">
                    <li>
                        <a href="#">Menu 1</a>
                    </li>
                    <li class="active">Menu 2</li>
                </ol>
            </section>
            <!-- Main content -->
            <section class="content">
                <!-- Your Page Content Here -->
                <?php echo @$content;?>
            </section>
            <!-- /.content -->
        </div><!-- /.content-wrapper -->
        <!-- Main Footer -->
        <footer class="main-footer">
            <!-- To the right -->
            <div class="pull-right hidden-xs">
                Version 1.0.0
            </div>
            <!-- Default to the left -->
            <strong>Copyright &copy; 2016 <a href="#">Media Gallery</a>.</strong> All rights reserved.
        </footer>
        <!-- Add the sidebar's background. This div must be placed immediately after the control sidebar -->
        <div class="control-sidebar-bg"></div>
    </div><!-- /.wrapper -->
    <!-- Page specific objects -->
    <div id="objects_holder">
    <?php echo @$objects;?>
    </div>
    <!-- /Page specific objects -->
    <!-- Common Modals -->
    <div class="modal common" id="modal_message" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Message</h4>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-btn="ok">Ok</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal common" id="modal_confirm" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">Confirm</h4>
                </div>
                <div class="modal-body">
                ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-btn="yes">Yes</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modal_video" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div data-id="container">
                        <div class="title">Test Title</div>
                        <video id="modal_video_player" class="video-js vjs-default-skin">
                            <source src="" type="video/mp4">
                        </video>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Common Modals -->
    <!-- Global Constants -->
    <script>
        site = {
            "base_url": "<?php echo base_url();?>"
        }
    </script>
    <!-- /Global Constants -->
    <!-- Library Dependencies -->
    <!-- jQuery 2.2.3 -->
    <script src="<?php echo base_url();?>assets/libs/jquery/jquery-2.2.4.min.js"></script>
    <!-- Bootstrap 3.3.6 -->
    <script src="<?php echo base_url();?>assets/libs/bootstrap/bootstrap.min.js"></script>
    <!-- Plugins Dependency -->
    <script src="<?php echo base_url();?>assets/plugins/toastr/toastr.min.js"></script>
    <script src="<?php echo base_url();?>assets/plugins/fullsizable/js/jquery.fullsizable.js"></script>
    <script src="<?php echo base_url();?>assets/plugins/videojs/video.min.js"></script>
    <!-- Theme App -->
    <script src="<?php echo base_url();?>assets/js/app.js"></script>
    <!-- Routine -->
    <script src="<?php echo base_url();?>assets/js/modals.js"></script>
    <script src="<?php echo base_url();?>assets/js/admin.js"></script>
    <script src="<?php echo base_url();?>assets/js/video-modal.js"></script>
    <script>
        // Initialize displays.
        admin_page.sidebar.selectMenu(<?php echo @$json['sidebar_menus'];?>);
        admin_page.content.setTitle(<?php echo @$json['title'];?>);
        admin_page.content.setBreadCrumb(<?php echo @$json['breadcrumbs'];?>);
        // Bind main page links.
        $('a.page-link').click(admin_page.content.get);
    </script>
    <!-- Extended App -->
    <script>
    <?php echo @$js_scripts;?>
    </script>
</body>
</html>