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
        $link = "";
        $crumbs =[
            "o"=>"One",
            "t"=>"Two",
            "tr"=>"Three"
        ];
        foreach($crumbs as $crumb)
        {
            $link .= $crumb.'>';
        }
        echo $link;
    }
}
