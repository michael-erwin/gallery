        /**
        * This script will initialize all components used in admin upload page.
        * @author Michael Erwin Virgines <michael.erwinp@gmail.com>
        * @requires assets/js/admin.js
        */

        $(document).ready(function(){
            // Initialize uploader.
            admin_app.uploader.init();
            // Initialize image editor.
            admin_app.image_editor.init();
            admin_app.video_editor.init();
        });
