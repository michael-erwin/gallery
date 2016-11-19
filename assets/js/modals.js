/**
 * This script is for used by common system modals.
 *
 * @author Michael Erwin Virgines <michael.erwinp@gmail.com>
 * @requires assets/libs/jquery/jquery-*
 * @requires assets/libs/bootstrap/bootstrap.min.js
 *
 */

 var modal = {
    "message" : function(message,fn_ok) {
        $('#modal_message').modal('show');
        $('#modal_message .modal-body').text(message);
        var ok_btn = $('#modal_message [data-btn="ok"]');
        if(fn_ok){
            ok_btn.unbind('click').click(function(){
                fn_ok();
                $('#modal_message').modal('hide');
            });
        }
        else{
            ok_btn.unbind('click').click(function(){
                $('#modal_message').modal('hide');
            });
        }
    },
    "confirm" : function(message,fn_yes) {
        $('#modal_confirm').modal('show');
        $('#modal_confirm .modal-body').text(message);
        var yes_btn = $('#modal_confirm [data-btn="yes"]');
        if(fn_yes){
            yes_btn.unbind('click').click(function(){
                fn_yes();
                $('#modal_confirm').modal('hide');
            });
        }
        else{
            yes_btn.unbind('click').click(function(){
                $('#modal_confirm').modal('hide');
            });
        }
    }
 }