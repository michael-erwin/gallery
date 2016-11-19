<?php
/**
* Delete Images
*/
class Delete extends CI_Controller
{
    private $media_path;

    function __construct()
    {
        parent::__construct();
        $this->config->load('media_gallery');
        $this->media_path = $this->config->item('mg_media_path');
        $this->load->model("m_video");
    }

    public function _remap()
    {
        $this->delete();
    }

    public function delete()
    {
        $id = $this->input->post('id');
        if($id)
        {
            $response = [
                "status" => "error",
                "message" => "Internal error has occured."
            ];

            if($deleted = $this->m_video->delete($id))
            {
                $response["status"] = "ok";
                $response["message"] = "{$deleted} files deleted.";
            }

            header("Content-Type: application/json");
            echo json_encode($response);
        }
    }
}