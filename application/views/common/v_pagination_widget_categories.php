<div>
    <button class="btn btn-default prev" <?php if($prev_disabled){echo "disabled";}?>>
        <span class="glyphicon glyphicon-chevron-left"></span>
    </button>
    <input type="text" class="form-control pagination_number index" value="<?php echo $current_page;?>" <?php if($total_page == 1){echo "disabled";}?> />
    <span class="of-pages">of <span class="total"><?php echo $total_page;?></span></span>
    <button class="btn btn-default next" <?php if($next_disabled){echo "disabled";}?>>
        <span class="glyphicon glyphicon-chevron-right"></span>
    </button>
    <div style="display:none">
        <a rel="prev" <?php if(!$prev_disabled){echo 'href="'.@$prev_link.'"';}?>>Prev</a>
        <a rel="next" <?php if(!$next_disabled){echo 'href="'.@$next_link.'"';}?>>Next</a>
    </div>
</div>
