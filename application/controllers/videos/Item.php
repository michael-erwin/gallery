<?php
/**
* Default image class.
*/
class Item extends CI_Controller
{

    function __construct()
    {
        parent::__construct();
    }

    public function _remap($param)
    {
        $item_name = $this->uri->segment(3);
        $name_pattern = '/\-([a-z0-9_]+$)/';
        $mode = $this->input->get('m');
        if(preg_match($name_pattern, $item_name, $matches))
        {
            $info = $this->getInfo($matches[1]);
            if($info) {
                if($mode && $mode == "json")
                {
                    $this->displayJSON($info);
                }
                else
                {
                    $this->displayHTML($info);
                }
            }
            else {
                show_404();
            }
        }
        else
        {
            show_404();
        }
    }

    private function displayHTML($info)
    {
        $type = "videos";
        $crumbs = [
            'Home' => base_url(),
            'Videos' => base_url("categories/videos"),
            $info['title'] => ""
        ];
        $media = [
            'title' => $info['title'],
            'description' => $info['description'],
            'dimension' => $info['width'].'x'.$info['height'],
            'file_size' => $this->formatSizeUnits($info['file_size']),
            'tags' => explode(' ',$info['tags']),
            'poster_url' => base_url()."media/videos/public/480/".$info['uid'].'.jpg',
            'video_url' => base_url()."videos/preview/".preg_replace('/\s/','-', $info['title'])."-".$info['uid']
        ];
        $data['breadcrumbs'] = $this->load->view('common/v_breadcrumbs_frontend',['crumbs'=>$crumbs],true);
        $data['pagination'] = '';
        $data['search_widget'] = $this->load->view('common/v_search_widget',['type'=>$type],true);
        $data['media_item_details'] = $this->load->view('common/v_video_item_page_frontend',$media,true);

        // Page meta SEO logic.
        $data['page_title'] = $info['title'];
        $data['meta_description'] = $info['description'];
        $data['meta_keywords'] = $info['tags'];

        // Pagination display logic.
        $pagination_data = [
            'current_page' => 1,
            'total_page' => 1,
            'prev_disabled' => true,
            'next_disabled' => true
        ];

        // Javscript triggers.
        $data['result_js_init'] = $this->load->view('scripts/v_scripts_photo_page','',true);

        $data['pagination'] = $this->load->view('common/v_pagination_widget',$pagination_data,true);
        $this->load->view("v_results_layout",$data);
    }

    private function displayJSON($info)
    {
        $info['dimension'] = $info['width'].'x'.$info['height'];
        $info['file_size'] = $this->formatSizeUnits($info['file_size']);
        $info['tags'] = explode(' ',$info['tags']);
        header("Content-Type: application/json");
        echo json_encode($info);
    }

    private function getInfo($uid)
    {
        $sql = "SELECT * FROM `videos` WHERE `uid`='{$uid}'";
        $query = $this->db->query($sql);
        $result = $query->result_array();
        if(count($result) > 0)
        {
            return $result[0];
        }
        else
        {
            return false;
        }
    }

    private function formatSizeUnits($bytes, $decimals = 2) {
        $size = ['B','kB','MB','GB','TB'];
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f ", $bytes / pow(1000, $factor)) . @$size[$factor];
    }
}
