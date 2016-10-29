<script>
(function(){
    admin.sidebar.selectmenu(['settings']);
    admin.content.setHeader({'title':'Settings','line':'General'});
    var crumbs = [
      {'title':'Admin','link':'<?php echo base_url("admin");?>'},
      {'title':'Settings','link':''},
    ];
    admin.content.setBreadCrumb(crumbs);
})();
</script>
