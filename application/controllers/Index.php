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
            'backdrop_photo' => "",
            'category_thumbs' => ""
        ];

        // Get backdrop for CTA block.
        $folder = 'assets/img/backdrops/';
        $files = scandir('assets/img/backdrops/');
        $photos = [];
        foreach($files as $file)
        {
            if(is_file($folder.$file))
            {
                $photos[] = $file;
            }
        }
        $i = rand(0,count($photos)-1);
        $data['backdrop_photo'] = base_url($folder.$photos[$i]);

        // Get category for thumb listing.
        $data['category_thumbs'] = "";
        $media_types = [
            ["icon"=>"assets/img/category_icons/core/photos.jpg","link"=>base_url('categories/photos'),"title"=>"Photos"],
            ["icon"=>"assets/img/category_icons/core/videos.jpg","link"=>base_url('categories/videos'),"title"=>"Videos"]
        ];
        foreach($media_types as $item)
        {
            $data['category_thumbs'] .= $this->load->view('common/v_category_thumb_frontend',$item,true);
        }
        $data['category_thumbs'] = compress_html($data['category_thumbs']);

        $this->load->view('v_index_layout',$data);
    }
}
