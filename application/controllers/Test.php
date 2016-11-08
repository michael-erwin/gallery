<?php
/**
* Tester
*/
class Test extends CI_Controller
{
    
    function __construct()
    {
        parent::__construct();
        $this->load->model("m_tag");
    }

    public function _remap($type="")
    {
        $tags = $this->input->get('tags');
        if($tags) {
            $tags = explode(' ', $tags);
            header("Content-Type: text/plain");
            print_r($this->m_tag->add($tags));
        }
    }
}