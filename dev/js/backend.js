/**
 * This script is for use in backend administration functions.
 *
 * @author Michael Erwin Virgines <michael.erwinp@gmail.com>
 * @requires assets/libs/jquery/jquery-*
 * @requires assets/plugins/toastr/toastr.min.js
 *
 */

/* Utilities */
// Remove array item by value.
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var admin_page = {};
var admin_app = {};
