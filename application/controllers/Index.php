<?php
/**
* Main index page controller.
*/
class Index extends CI_Controller
{
    
    function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $data = [
            'backdrop_image' => "",
            'category_thumbs' => ""
        ];

        // Get backdrop for CTA block.
        $folder = 'assets/img/backdrops/';
        $files = scandir('assets/img/backdrops/');
        $images = [];
        foreach($files as $file)
        {
            if(is_file($folder.$file))
            {
                $images[] = $file;
            }
        }
        $i = rand(0,count($images)-1);
        $data['backdrop_image'] = base_url($folder.$images[$i]);

        // Get category for thumb listing.
        $query = $this->db->query("SELECT * FROM `categories` WHERE `published`='yes' LIMIT 16");
        $result = $query->result_array();

        foreach($result as $category)
        {
            $seo_title = explode(' ', $category['title']);
            $seo_title = end($seo_title).'-'.$category['id'];
            $data_thumb['title'] = $category['title'];
            $data_thumb['icon'] = $category['icon'];
            $data_thumb['images_link'] = base_url("categories/{$seo_title}/images/");
            $data_thumb['videos_link'] = base_url("categories/{$seo_title}/videos/");
            $data['category_thumbs'] .= $this->load->view('common/v_category_thumb_frontend',$data_thumb,true);
        }

        $this->load->view('v_index_layout',$data);
    }
}