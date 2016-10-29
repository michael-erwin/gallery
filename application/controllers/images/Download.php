<?php
/**
* Preview Images
*/
class Download extends CI_Controller
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

    public function _remap($options=null)
    {
        if($options)
        {
            $this->lg($options);
        }
    }

    public function md($name = null)
    {
        $path = $this->media_path;
        $mark = $this->watermark;
        $file = "{$path}/images/private/full_size/{$uid}.jpg";
        $overlay = "{$path}/images/private/watermark/{$mark}";

        if ($name && file_exists($file))
        {
            $picture = $this->simpleimage->load($file);
            $picture->best_fit(768, 768);
            $picture->overlay($overlay,"tile");
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
        $overlay = "{$path}/images/private/watermark/{$mark}";

        if ($name && file_exists($file))
        {
            $picture = $this->simpleimage->load($file);
            $picture->best_fit(1080, 1080);
            $picture->overlay($overlay,"tile");
            header("Content-disposition: attachment; filename=\"{$uid}.jpg\"");
            $picture->output();
        }
        else
        {
            show_404();
        }
    }
    public function test($name)
    {
        $name = explode('-', $name);$name = end($name);
        print_r($name);
    }
}