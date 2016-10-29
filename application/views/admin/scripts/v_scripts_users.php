<script>
(function(){
    admin.sidebar.selectmenu(['users']);
    admin.content.setHeader({'title':'Users','line':'Manage Users'});
    var crumbs = [
      {'title':'Admin','link':'<?php echo base_url("admin");?>'},
      {'title':'Users','link':''},
    ];
    admin.content.setBreadCrumb(crumbs);
})();
</script>