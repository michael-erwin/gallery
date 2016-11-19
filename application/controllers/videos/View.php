<?php
/**
* Stream a video.
*/
class View extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->config->load('media_gallery');
        $this->media_path = $this->config->item('mg_media_path');
    }

    public function hd480 ($uid=null)
    {
        $source = $this->media_path.'/videos/public/480p/'.$uid.'.mp4';

        if (file_exists($source))
        {
            header("Content-Type: video/mp4");
            readfile($source);
        }
        else
        {
            header("Content-Type: text/plain");
            echo "File not found.";
        }
    }

    public function fhd ($uid=null)
    {
        $source = $this->media_path.'/videos/private/full_size/'.$uid.'.mp4';

        if (file_exists($source))
        {
            header("Content-Type: video/mp4");
            readfile($source);
        }
        else
        {
            header("Content-Type: text/plain");
            echo "File not found.";
        }
    }
}