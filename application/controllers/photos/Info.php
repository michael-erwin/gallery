<?php
class Info extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->model('m_photo');
    }

    public function _remap($option=null)
    {
        $id = $this->input->get('id');
        if($id)
        {
            $ids = explode(',',$id);
            $this->get_by_id($ids);
        }
        elseif(is_numeric($option))
        {
            $this->get_by_id($option);
        }
    }

    private function get_by_id($number=null)
    {
        $date_format = $this->config->item('log_date_format');

        $result = [
            "status" => "error",
            "message" => "Id not set.",
            "data" => null
        ];
        if($data = $this->m_photo->get_by_id($number))
        {
            $result['status'] = "ok";
            $result['message'] = "Single entry retrieved successfully.";
            $data_formated = [];

            foreach($data as $item)
            {
                // Format data.
                $item['file_size'] = $this->formatSizeUnits($item['file_size']);
                $item['date_added'] = date($date_format,$item['date_added']);
                $item['date_modified'] = empty($item['date_modified'])? "" : date($date_format,$item['date_modified']);
                $data_formated[] = $item;
            }

            if(count($data_formated) == 1)
            {
                $result['data'] = $data_formated[0];
            }
            else
            {
                $result['data'] = $data_formated;
            }
        }

        header("Content-Type: application/json");
        echo json_encode($result);
    }

    private function formatSizeUnits($bytes)
    {
        if ($bytes >= 1073741824)
        {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        }
        elseif ($bytes >= 1048576)
        {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        }
        elseif ($bytes >= 1024)
        {
            $bytes = number_format($bytes / 1024, 2) . ' kB';
        }
        elseif ($bytes > 1)
        {
            $bytes = $bytes . ' bytes';
        }
        elseif ($bytes == 1)
        {
            $bytes = $bytes . ' byte';
        }
        else
        {
            $bytes = '0 bytes';
        }

        return $bytes;
    }
}
