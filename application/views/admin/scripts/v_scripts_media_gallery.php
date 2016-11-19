        /**
        * This script will initialize all components used in admin media gallery page.
        * @author Michael Erwin Virgines <michael.erwinp@gmail.com>
        * @requires assets/js/admin.js
        */

        $(document).ready(function(){
            admin_app.image_editor.init();
            admin_app.video_editor.init();
            admin_app.category_selector.data.categories = <?php echo @$categories;?>;
            admin_app.category_selector.init();
            admin_app.library.init();
            $('.silent-link').unbind().on('click',admin_page.content.get);
        });
