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
        <a rel="prev" href="<?php if(!$prev_disabled){echo base_url("search/{$type}?kw={$keywords}&p=".($current_page-1));}else{echo "#";}?>">Prev</a>
        <a rel="next" href="<?php if(!$next_disabled){echo base_url("search/{$type}?kw={$keywords}&p=".($current_page+1));}else{echo "#";}?>">Next</a>
    </div>
</div>