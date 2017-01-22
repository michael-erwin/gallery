        /**
        * This script will initialize all components used in admin upload page.
        * @author Michael Erwin Virgines <michael.erwinp@gmail.com>
        * @requires assets/js/admin.js
        */

        $(document).ready(function(){
            // Initialize uploader.
            admin_app.uploader.data.category_list = <?php echo @$category_list;?>;
            admin_app.uploader.init();
            // Initialize photo editor.
            admin_app.photo_editor.init();
            admin_app.video_editor.init();
        });
