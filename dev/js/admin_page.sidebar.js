admin_page.sidebar =
{
    selected_menu: null,
    selectMenu: function(menus) {
        if(menus) {
            $('.sidebar-menu li').removeClass('active');
            for(var index=0;index<menus.length;index++) {
                var menu = $('.sidebar-menu [data-menu="'+menus[index]+'"]');
                menu.addClass('active').find('.fa-angle-left').addClass('turned-down');
                if(menu.hasClass('treeview')) menu.addClass('tree-open');
            }
            this.selected_menu = menus;
        }
    }
}
