<?php
/**
* Tester
*/
class Test extends CI_Controller
{
    
    function __construct()
    {
        parent::__construct();
        $this->load->library('SimpleImage');
    }

    public function _remap($type="")
    {
        header("Content-Type: text/plain");
        $reply = ($type == "images")? "Your request is valid for image." : "Your request is something else.";
        echo $reply;
    }
}