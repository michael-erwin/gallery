<?php
/**
* CI controller for photos under Media Gallery project.
* Requires:
* - ./application/config/media_gallery.php
* - ./application/libraries/SimpleImage.php
* - ./application/models/M_photo.php
*
* @package  Media Gallery
* @author   Michael Erwin Virgines <michael.erwinp@gmail.com>
*
*/
class Photos extends CI_Controller
{
    private $media_path;

    function __construct()
    {
        parent::__construct();
        $this->load->library('SimpleImage');
        $this->load->model('m_photo');
        $this->config->load('media_gallery');
        $this->media_path = $this->config->item('mg_media_path');
    }

    public function index()
    {
        $category_id = $this->input->post('category_id');

        if(isset($_FILES['file']))
        {
            $response = ['status'=>'error','code'=>null,'message'=>'Unknown error has occured.','data'=>null,'debug_info'=>null];
            $category_id = is_numeric($category_id)? $category_id : 1;
            $path = $this->media_path;
            $title = explode('.',$_FILES['file']['name']);array_pop($title);
            $title = implode('.', $title);
            $uid = str_replace('.', '_', microtime(true));
            $source = $_FILES['file']['tmp_name'];
            $size = 0;

            try
            {
                $picture = $this->simpleimage->load($source);
                $width  = $picture->get_width();
                $height = $picture->get_height();
                $orientation = ($width > $height)? "horizontal" : "vertical";

                // Save original dimension to file system.
                $full_size_file = "{$path}/photos/private/full_size/{$uid}.jpg";
                $picture->save($full_size_file);

                // Get the saved file size.
                $size = filesize($full_size_file);

                // Save 256px square box cover dimension to file system.
                if ($orientation == "horizontal") { $picture->fit_to_height(256); }else{ $picture->fit_to_width(256); };
                $picture->save("{$path}/photos/public/256/{$uid}.jpg");

                // Save 128px square box cover dimension to file system.
                if ($orientation == "horizontal") { $picture->fit_to_height(128); }else{ $picture->fit_to_width(128); };
                $picture->save("{$path}/photos/public/128/{$uid}.jpg");

                // Insert entry to database.
                if ($id = $this->m_photo->add($title,$uid,$width,$height,$size,$category_id))
                {
                    $response['status'] = "ok";
                    $response['message'] = "Photo added.";
                    $response['data'] = ['id'=>$id,'uid'=>$uid];
                    header("Content-Type: application/json");
                    echo json_encode($response);
                }
                else
                {
                    $response['message'] = "Data insert failed.";
                    header("Content-Type: application/json");
                    echo json_encode($response);
                }
            }
            catch (Exception $e)
            {
                header("HTTP/1.1 500 Internal Server Error");
                header("Content-Type: application/json");
                echo json_encode($response);
            }
        }
    }
}
