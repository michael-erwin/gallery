<ol class="breadcrumb">
                        <?php foreach($crumbs as $title=>$link):
                        if(strlen($link) != 0):
                        ?><li><a href="<?php echo $link;?>"><?php echo $title;?></a></li>
                        <?php else:
                        ?><li><a class="active"><?php echo $title;?></a></li>
                        <?php endif; endforeach;?>
                    </ol>