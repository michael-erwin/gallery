<script>
(function(){
    admin.sidebar.selectmenu(['dashboard']);
    admin.content.setHeader({'title':'Dashboard','line':'Site Overview'});
    var crumbs = [
      {'title':'Admin','link':'<?php echo base_url("admin");?>'},
      {'title':'Dashboard','link':''},
    ];
    admin.content.setBreadCrumb(crumbs);
})();
</script>
