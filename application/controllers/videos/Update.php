<?php
class Update extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->model('m_video');
        $this->load->model('m_tag');
    }

    public function _remap($method=null)
    {
        $this->update();
    }

    private function update()
    {
        $response = [
            "status" => "error",
            "message" => "No id is set.",
            "data" => null,
            "debug_info" => ["affected_rows"=>0]
        ];

        $id = $this->input->post('id');

        if($id)
        {
            $title = clean_title_text($this->input->post('title'));
            $description = clean_body_text($this->input->post('description'));
            $tags = clean_title_text($this->input->post('tags'));
            $category = clean_numeric_text($this->input->post('category_id'));

            if($affected = $this->m_video->update($id,$title,$description,$tags,$category))
            {
                $response['status'] = "ok";
                $response['message'] = "{$affected} video(s) updated.";
                $response['debug_info']['affected_rows'] = $affected;
                if(strlen($tags) > 2) $this->m_tag->add(explode(' ', $tags));
            }
            else
            {
                $response['message'] = "Update failed. Database error occured.";
            }
        }

        header("Content-Type: application/json");
        echo json_encode($response);
    }
}