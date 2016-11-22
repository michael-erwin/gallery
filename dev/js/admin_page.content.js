admin_page.content =
{
    get: function(e, ob = null) {
        e.preventDefault();
        if(!ob) var ob = this;
        var url_clean = ob;
        //var url_clean = site.base_url+'/admin';
        var url_pieces = ob.pathname.split('/admin');
        var url_hash = url_pieces[url_pieces.length-1];
        $.ajax({
            method: "get",
            url: url_clean+'/json',
            error: function(jqXHR,textStatus,errorThrown){
                toastr["error"]("Failed to load content.", "Error "+jqXHR.status);
            },
            success: function(response){
                if(response.page_title){
                    //top.location.hash = url_hash;
                    history.pushState(null, null, ob.pathname);
                    admin_page.sidebar.selectMenu(response.sidebar_menus);
                    admin_page.content.setTitle({"text":response.page_title,"small":response.page_description});
                    admin_page.content.setBreadCrumb(response.breadcrumbs);
                    admin_page.content.setBody(response.content);
                    admin_page.content.setObjects(response.objects);
                    var script = ob.pathname+'/js';
                    try {
                        $.getScript(script);
                    }
                    catch(e){console.log("Unable to load script from "+script);}
                }
            }
        });
    },
    setTitle: function(title) {
        if(title) {
            $('.content-header h1').html(title.text+'<small>'+title.small+'</small>');
        }
    },
    setBreadCrumb: function(crumbs) {
        if(crumbs) {
            var breadcrumbs = '';
            for(var menu=0;menu<crumbs.length;menu++) {
                if(crumbs[menu].link != "") {
                    breadcrumbs += '<li><a onclick="admin_page.content.get(event,this)" href="'+crumbs[menu].link+'">'+crumbs[menu].text+'</a></li>';
                }
                else {
                    breadcrumbs += '<li class="active">'+crumbs[menu].text+'</li>';
                }
            }
            $('.content-header .breadcrumb').html(breadcrumbs);
        }
    },
    setBody: function(content) {
        $('section.content').html(content);
    },
    setObjects: function(objects) {
        $('#objects_holder').html(objects);
    }
}
