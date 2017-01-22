<script>
(function(){
    admin.sidebar.selectmenu(['roles']);
    admin.content.setHeader({'title':'Roles','line':'Manage Roles'});
    var crumbs = [
      {'title':'Admin','link':'<?php echo base_url("admin");?>'},
      {'title':'Roles','link':''},
    ];
    admin.content.setBreadCrumb(crumbs);
})();
</script>
