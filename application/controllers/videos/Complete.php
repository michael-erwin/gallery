<?php
/**
* Adds completed information as file size and complete status in database.
*/
class Complete extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->config->load('media_gallery');
        $this->media_path = $this->config->item('mg_media_path');
        $this->load->model('m_video');
    }

    public function _remap($id=null)
    {
        $this->setComplete($id);
    }

    private function setComplete($id=null)
    {
        if($id)
        {
            $id = clean_numeric_text($id);

            if(strlen($id) > 0)
            {
                $data = $this->m_video->get_by_id($id);
                $data = $data[0];
                if(count($data) > 0)
                {
                    if($data['file_size'] == 0)
                    {
                        $uid = $data['uid'];
                        $source = $this->media_path.'/videos/private/full_size/'.$uid.'.mp4';
                        $response = [
                            "status" => "error",
                            "message" => "File no longer exist."
                        ];

                        if(file_exists($source))
                        {
                            // Delete temporary files.
                            @unlink($this->media_path."/videos/temp/{$uid}");
                            @unlink($this->media_path.'/videos/logs/'.$uid.'.log');
                            @unlink($this->media_path.'/videos/logs/'.$uid.'_duration.log');

                            $file_size = filesize($source);
                            if($this->m_video->update ($id, null, null, null, null, $file_size, 1))
                            {
                                $response['status'] = "ok";
                                $response['message'] = "Record updated.";
                            }
                            else
                            {
                                $response['message'] = "Database error occured.";
                            }
                        }

                        header("Content-Type: application/json");
                        echo json_encode($response);
                    }
                }
            }
        }
    }
}