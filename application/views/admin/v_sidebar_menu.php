<ul class="sidebar-menu">
                    <li data-menu="dashboard">
                        <a class="page-link" href="<?php echo base_url();?>admin/dashboard">
                            <i class="fa fa-dashboard"></i> <span>Dashboard</span>
                        </a>
                    </li>
                    <li data-menu="users">
                        <a class="page-link" href="<?php echo base_url();?>admin/users">
                            <i class="fa fa-users"></i> <span>Users</span>
                        </a>
                    </li>
                    <li data-menu="media" class="treeview">
                        <a href="#">
                            <i class="fa fa-tv"></i> <span>Media</span>
                            <span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
                        </a>
                        <ul class="treeview-menu">
                            <li data-menu="library">
                                <a class="page-link" href="<?php echo base_url();?>admin/media/library">
                                    <i class="fa fa-dot-circle-o"></i> Library
                                </a>
                            </li>
                            <li data-menu="categories">
                                <a class="page-link" href="<?php echo base_url();?>admin/media/categories">
                                    <i class="fa fa-dot-circle-o"></i> Categories
                                </a>
                            </li>
                            <li data-menu="upload">
                                <a class="page-link" href="<?php echo base_url();?>admin/media/upload">
                                    <i class="fa fa-dot-circle-o"></i> Upload
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li data-menu="settings">
                        <a class="page-link" href="<?php echo base_url();?>admin/settings">
                            <i class="fa fa-cog"></i> <span>Settings</span>
                        </a>
                    </li>
                </ul>
