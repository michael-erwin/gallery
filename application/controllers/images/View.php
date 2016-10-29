<?php
/**
* View Images
*/
class View extends CI_Controller
{
    private $media_path, $watermark;

    function __construct()
    {
        parent::__construct();
        $this->load->library('SimpleImage');
        $this->config->load('media_gallery');
        $this->media_path = $this->config->item('mg_media_path');
        $this->watermark = $this->config->item('mg_watermark');
    }

    public function md($name = null)
    {
        $name = explode('-', $name);
        $uid = end($name);
        $path = $this->media_path;
        $mark = $this->watermark;
        $file = "{$path}/images/private/full_size/{$uid}.jpg";

        if ($uid && file_exists($file))
        {
            $picture = $this->simpleimage->load($file);
            $picture->best_fit(720, 720);
            $picture->output();
        }
        else
        {
            show_404();
        }
    }

    public function lg($name = null)
    {
        $name = explode('-', $name);
        $uid = end($name);
        $path = $this->media_path;
        $mark = $this->watermark;
        $file = "{$path}/images/private/full_size/{$uid}.jpg";

        if ($uid && file_exists($file))
        {
            $picture = $this->simpleimage->load($file);
            $picture->best_fit(1080, 1080);
            $picture->output();
        }
        else
        {
            show_404();
        }
    }

    public function full($name = null)
    {
        $name = explode('-', $name);
        $uid = end($name);
        $path = $this->media_path;
        $mark = $this->watermark;
        $file = "{$path}/images/private/full_size/{$uid}.jpg";

        if ($uid && file_exists($file))
        {
            $picture = $this->simpleimage->load($file);
            $picture->output();
        }
        else
        {
            show_404();
        }
    }
}