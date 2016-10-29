<?php
/**
* Stream a video.
*/
class Preview extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->config->load('media_gallery');
        $this->media_path = $this->config->item('mg_media_path');
    }

    public function _remap($filename=null)
    {
        if($filename)
        {
            $filename = end((explode('-', $filename)));
            $file_path = $this->media_path.'/videos/public/480p/'.$filename.'.mp4';

            if(file_exists($file_path))
            {
                header("Content-Type: video/mp4");
                readfile($file_path);
            }
            else
            {
                echo "File not found.";
            }
        }
    }
}