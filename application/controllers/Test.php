<?php
/**
* Tester
*/
class Test extends CI_Controller
{

    function __construct()
    {
        parent::__construct();
    }

    public function _remap()
    {
        $url = "http://www.youtube.com?video=1234534";
        $sch = parse_url($url, PHP_URL_SCHEME);
        if(empty($sch)){
            echo "Scheme is empty.";
        }
        else {
            echo "Scheme is ".$sch;
        }
    }
}
