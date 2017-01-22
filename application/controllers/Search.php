<?php
/**
*
*/
class Search extends CI_Controller
{

    function __construct()
    {
        parent::__construct();
    }

    public function _remap($options=null)
    {
        $method = $this->uri->segment(2);
        $param_1 = $this->uri->segment(3);
        $param_2 = $this->uri->segment(4);

        if($method)
        {
            if($method == "videos")
            {
                $this->fetch($method);
            }
            elseif($method == "category")
            {
                $type = ($param_1 == "videos")? $param_1 : "photos";
                $category_id = (!empty(clean_numeric_text($param_2)))? explode('-', $param_2) : 1;
                $category_id = is_array($category_id)? end($category_id) : $category_id;
                $this->fetch($type,trim($category_id));
            }
            elseif($method == "tags") {
                $this->fetchTags();
            }
            else
            {
                $this->fetch($method);
            }
        }
        else
        {
            $this->fetch("photos");
        }
    }

    private function fetchTags()
    {
        $keyword = $this->input->get('kw');
        $response = [];
        if($keyword)
        {
            $keyword = clean_title_text($keyword);
            if(!empty($keyword)) {
                $sql = "SELECT `name` FROM `tags` WHERE `name` LIKE '%{$keyword}%' ORDER BY `name` LIMIT 5";
                $query = $this->db->query($sql);
                $response = $query->result_array();
            }
        }
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    private function fetch($type=null,$value=null)
    {
        $type = ($type != "")? $type : "photos";
        $crumbs = [
            'Home' => base_url(),
            ucfirst($type) => base_url("categories/{$type}"),
            'Search' => ""
        ];
        $keys = clean_title_text($this->input->get('kw'));
        $page = clean_numeric_text($this->input->get('p'));
        $page = empty($page)? 1 : $page;
        $page -= 1;
        $category = $value? $value : clean_numeric_text($this->input->get('c'));
        $limit = clean_numeric_text($this->input->get('l'));
        $limit = empty($limit)? 20 : $limit;
        $offset = $page * $limit;
        $mode = $this->input->get("m");

        if(strlen($keys) < 3)
        {
            $keys = $this->db->escape_like_str($keys);
            $sql = "SELECT SQL_CALC_FOUND_ROWS * FROM `{$type}`";

            if(!empty($category))
            {
                $sql .= ($type == "videos")? " WHERE `category_id` = {$category} AND `complete`=1 AND " : " WHERE `category_id` = {$category} AND ";
            }
            else
            {
                $sql .= ($type == "videos")? " WHERE `complete`=1 AND " : " WHERE ";
            }

            $sql .= "(`title` LIKE '%{$keys}%' OR `description` LIKE '%{$keys}%' OR `tags` LIKE '%{$keys}%') LIMIT {$limit} OFFSET {$offset}";
        }
        else
        {
            $keys = $this->db->escape_str(preg_replace('/-+$/', '', $keys));
            $sql = "SELECT SQL_CALC_FOUND_ROWS * FROM `{$type}`";
            if(!empty($category))
            {
                $sql .= ($type == "videos")? "WHERE `category_id` = {$category} AND `complete`=1 AND " : "WHERE `category_id` = {$category} AND ";
            }
            else
            {
                $sql .= ($type == "videos")? "WHERE `complete`=1 AND " : " WHERE ";
            }
            $sql .= "(MATCH (`title`,`description`,`tags`) AGAINST('*{$keys}*' IN BOOLEAN MODE)) LIMIT {$limit} OFFSET {$offset}";
        }

        $data = $this->db->query($sql);
        $rows = $this->db->query("SELECT FOUND_ROWS() AS `total`");

        $items = $data->result_array();
        $total = $rows->result_array()[0]['total'];

        $response = [
            'type' => $type,
            'keywords' => $keys,
            'category_name' => "",
            'category_id' => $category,
            'crumbs' => $crumbs,
            'route' => 'search',
            'page' => [
                'current' => $page+1,
                'total' => ceil($total / $limit),
                'limit' => $limit
            ],
            'items' => [
                'type' => $type,
                'entries' => $items,
                'total' => $total
            ]
        ];

        $page_meta = [
            'title' => 'Gallery - Search Results',
            'description' => '',
            'keywords' => ''
        ];

        // Output types:
        if($mode && $mode == "json")
        {
            $response['page_meta'] = $page_meta;
            header("Content-Type: application/json");
            echo json_encode($response);
        }
        else
        {
            $this->index($response,$page_meta);
        }
    }

    private function index($result, $page_meta=null)
    {
        $data = [];
        $data['thumbs'] = '';
        $data['breadcrumbs'] = $this->load->view('common/v_breadcrumbs_frontend',['crumbs'=>$result['crumbs']],true);
        $data['pagination'] = '';
        $data['result_js_init'] = $this->load->view('scripts/v_scripts_results',['result'=>$result],true);

        // Page meta SEO logic.
        if($page_meta)
        {
            $data['page_title'] = $page_meta['title'];
            $data['meta_description'] = $page_meta['description'];
            $data['meta_keywords'] = $page_meta['keywords'];
        }

        // Search widget and thumbnails display logic.
        if($result['items']['type'] == "photos")
        {
            $data['search_widget'] = $this->load->view('common/v_search_widget',['type'=>'photos'],true);

            if($result['items']['total'] > 0)
            {
                foreach ($result['items']['entries'] as $item)
                {
                    $thumb_data['data'] = json_encode($item);
                    $thumb_data['title'] = $item['title'];
                    $thumb_data['uid'] = $item['uid'];
                    $thumb_data['seo_title'] = preg_replace('/\s/', '-', $item['title']).'-'.$item['uid'];
                    $data['thumbs'] .= $this->load->view('common/v_result_thumbs_photos',$thumb_data,true);
                }
            }
            else
            {
                $data['thumbs'] = '<div class="alert alert-warning">No results.</div>';
            }

        }
        else if($result['items']['type'] == "videos")
        {
            $data['search_widget'] = $this->load->view('common/v_search_widget',['type'=>'videos'],true);

            if($result['items']['total'] > 0)
            {
                foreach ($result['items']['entries'] as $item)
                {
                    $thumb_data['data'] = json_encode($item);
                    $thumb_data['title'] = $item['title'];
                    $thumb_data['uid'] = $item['uid'];
                    $thumb_data['seo_title'] = preg_replace('/\s/', '-', $item['title']).'-'.$item['uid'];
                    $data['thumbs'] .= $this->load->view('common/v_result_thumbs_videos',$thumb_data,true);
                }
            }
            else
            {
                $data['thumbs'] = '<div class="alert alert-warning">No results.</div>';
            }

        }

        // Pagination display logic.
        $pagination_data = [
            'type' => $result['type'],
            'keywords' => $result['keywords'],
            'category_id' => $result['category_id'],
            'category_name' => $result['category_name'],
            'current_page' => $result['page']['current'],
            'total_page' => $result['page']['total'],
            'prev_disabled' => false,
            'next_disabled' => false
        ];
        if($result['page']['current'] == 1) $pagination_data['prev_disabled'] = true;
        if($result['page']['current'] >= $result['page']['total']) $pagination_data['next_disabled'] = true;

        $data['pagination'] = $this->load->view('common/v_pagination_widget',$pagination_data,true);
        $this->load->view("v_results_layout",$data);
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
