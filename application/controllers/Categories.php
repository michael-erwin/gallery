<?php
/**
* 
*/
class Categories extends CI_Controller
{
    
    function __construct()
    {
        parent::__construct();
        $this->load->model('m_category');
    }

    public function _remap()
    {
        $method = $this->uri->segment(2);
        $param_1 = $this->uri->segment(3);
        $param_2 = $this->uri->segment(4);

        if($method == "add")
        {
            $this->add();
        }
        elseif($method == "update")
        {
            $this->update();
        }
        elseif($method == "delete")
        {
            $this->delete();
        }
        elseif($method == "get_all")
        {
            $this->get_all();
        }
        elseif(preg_match('/^[a-zA-z\-\_]+-[0-9]+$/', $method)) // If method parameter follows "category-name-1" pattern.
        {
            $media_type = ($param_1 == "videos")? $param_1 : "images";
            $category_id = (!empty(clean_numeric_text($method)))? explode('-', $method) : 1;
            $category_id = is_array($category_id)? end($category_id) : $category_id;
            $category_name = explode('-',$method);
            array_pop($category_name);
            $category_name = implode('-', $category_name);
            $page = !empty($param_2)? trim($param_2) : 1;
            $page = preg_match('/^[0-9]+$/', $page)? $page : 1;
            // Display entries belonging to this particular category.
            $this->fetch_categories($media_type,$category_name,$category_id,$page);
        }
        else
        {
            // Anything else fetch all categories.
            $category_titles = [];
            $data = [
                "breadcrumbs" => "",
                "category_thumbs" => "",
                "search_widget" => $this->load->view('common/v_search_widget',['type'=>'images'],true)
            ];
            $pagination_data = [
                'current_page' => 1,
                'total_page' => 1,
                'prev_disabled' => true,
                'next_disabled' => true
            ];
            $data['pagination'] = $this->load->view('common/v_pagination_widget',$pagination_data,true);
            $query = $this->db->query("SELECT * FROM `categories` WHERE `published`='yes' LIMIT 16");
            $result = $query->result_array();
            foreach($result as $category)
            {
                $seo_title = explode(' ', $category['title']);
                $seo_title = end($seo_title).'-'.$category['id'];
                $category_titles[] = strtolower($category['title']);
                $data_thumb['title'] = $category['title'];
                $data_thumb['icon'] = $category['icon'];
                $data_thumb['images_link'] = base_url("categories/{$seo_title}/images/");
                $data_thumb['videos_link'] = base_url("categories/{$seo_title}/videos/");
                $data['category_thumbs'] .= $this->load->view('common/v_category_thumb_frontend',$data_thumb,true);
            }
            $breadcrumbs['crumbs'] = [
                'Home' => base_url(),
                'Categories' => ""
            ];
            $data['page_title'] = "Gallery - Categories";
            $data['meta_description'] = "Select category for photos and videos.";
            $data['meta_keywords'] = implode(',', $category_titles);
            $data['breadcrumbs'] = $this->load->view('common/v_breadcrumbs_frontend',$breadcrumbs,true);
            $this->load->view("v_results_layout",$data);
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
        if($result['items']['type'] == "images")
        {
            $data['search_widget'] = $this->load->view('common/v_search_widget',['type'=>'images'],true);
            
            if($result['items']['total'] > 0)
            {
                foreach ($result['items']['entries'] as $item)
                {
                    $thumb_data['data'] = json_encode($item);
                    $thumb_data['title'] = $item['title'];
                    $thumb_data['uid'] = $item['uid'];
                    $thumb_data['seo_title'] = preg_replace('/\s/', '-', $item['title']).'-'.$item['uid'];
                    $data['thumbs'] .= $this->load->view('common/v_result_thumbs_images',$thumb_data,true);
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

        // Load page layout.
        $this->load->view("v_results_layout",$data);
    }

    private function fetch_categories($media_type,$cat_name,$cat_id,$page)
    {
        $media_type = ($media_type != "")? $media_type : "images;";
        $crumbs = [
            'Home' => base_url(),
            'Categories' => base_url("categories"),
            $cat_name." ({$media_type})" => ""
        ];
        $page = clean_numeric_text($page)-1;
        $category = clean_numeric_text($cat_id);
        $limit = clean_numeric_text($this->input->get('l'));
        $limit = empty($limit)? 20 : $limit;
        $offset = $page * $limit;
        $mode = $this->input->get("m");

        // Retrieve category details.
        $sql_category = "SELECT `title`,`description` FROM `categories` WHERE `id`={$category}";
        $data_category = $this->db->query($sql_category);
        $info_category = $data_category->result_array()[0];
        $page_meta = [
            'title' => $info_category['title'],
            'description' => $info_category['description'],
            'keywords' => strtolower($info_category['title'])
        ];

        // Retrieve all items belonging to this particular category.
        $sql_items = "SELECT SQL_CALC_FOUND_ROWS * FROM `{$media_type}`";
        $sql_items .= ($media_type == "videos")? " WHERE `category_id` = {$category} AND `complete`=1 " : " WHERE `category_id` = {$category} ";
        $sql_items .= "LIMIT {$limit} OFFSET {$offset}";

        $data_items = $this->db->query($sql_items);
        $rows_items = $this->db->query("SELECT FOUND_ROWS() AS `total`");
        
        $items = $data_items->result_array();
        $total = $rows_items->result_array()[0]['total'];

        $response = [
            'type' => $media_type,
            'keywords' => "",
            'category_id' => $cat_id,
            'category_name' => $cat_name,
            'crumbs' => $crumbs,
            'route' => 'categories',
            'page' => [
                'current' => $page+1,
                'total' => ceil($total / $limit),
                'limit' => $limit
            ],
            'items' => [
                'type' => $media_type,
                'entries' => $items,
                'total' => $total
            ]
        ];

        // Output types:
        if($mode && $mode == "json")
        {
            header("Content-Type: application/json");
            echo json_encode($response);
        }
        else
        {
            $this->index($response,$page_meta);
        }
    }

    private function add()
    {
        $errors = 0;
        $response = [
            "status" => "error",
            "message" => "Unknown error has occured.",
            "data" => "null"
        ];

        // Required fields.
        $title = clean_title_text(trim($this->input->post('title')));
        $description = clean_body_text(trim($this->input->post('description')));
        $icon = trim($this->input->post('icon'));
        $publish = clean_alpha_text(trim($this->input->post('publish')));

        // Process data.
        if(strlen($title) == 0)
        {
            $errors++;
            $response['message'] = "Title field is missing. ";
        }
        if(strlen($publish) == 0)
        {
            $publish = "yes";
        }
        if(!$this->m_category->add($title, $description, $icon, $publish))
        {
            $errors++;
            $response['message'] .= "Database insert failed. ";
        }
        if(!$data = $this->m_category->get_all())
        {
            $errors++;
            $response['message'] .= "Data fetch failed. ";
        }

        // Check for errors before output.
        if($errors == 0)
        {
            $response['status'] = "ok";
            $response['message'] = "New entry added.";
            $response['data'] = $data;
        }

        // Generate output.
        header("Content-Type: application/json");
        echo json_encode($response);
    }
    private function update()
    {
        $errors = 0;
        $response = [
            "status" => "error",
            "message" => "Unknown error has occured.",
            "data" => "null"
        ];

        // Required fields.
        $id = clean_numeric_text(trim($this->input->post('id')));
        $title = clean_title_text(trim($this->input->post('title')));
        $description = clean_body_text(trim($this->input->post('description')));
        $icon = trim($this->input->post('icon'));
        $publish = clean_alpha_text(trim($this->input->post('publish')));

        // Process data.
        if(strlen($id) == 0)
        {
            $errors++;
            $response['message'] = "ID field is missing. ";
        }
        if(strlen($title) == 0)
        {
            $errors++;
            $response['message'] .= "Title field is missing. ";
        }
        if(strlen($publish) == 0)
        {
            $publish = "yes";
        }
        if(!$this->m_category->update($id, $title, $description, $icon, $publish))
        {
            $errors++;
            $response['message'] .= "Database update failed. ";
        }
        if(!$data = $this->m_category->get_all())
        {
            $errors++;
            $response['message'] .= "Data fetch failed. ";
        }

        // Check for errors before output.
        if($errors == 0)
        {
            $response['status'] = "ok";
            $response['message'] = "Entry updated.";
            $response['data'] = $data;
        }

        // Generate output.
        header("Content-Type: application/json");
        echo json_encode($response);
    }
    private function delete()
    {
        $errors = 0;
        $response = [
            "status" => "error",
            "message" => "Unknown error has occured.",
            "data" => "null"
        ];

        // Required fields.
        $id = $this->input->post('id');
        $ids = [];
        if(is_array($id))
        {
            foreach($id as $row)
            {
                $entry = clean_numeric_text($row);
                if(strlen($entry) == 0)
                {
                    $errors++;
                    break;
                }
                elseif($row == 1)
                {
                    $errors++;
                    $response['message'] = "Cannot delete default item. ";
                    break;
                }
                else
                {
                    $ids[] = $entry;
                }
            }
            if(count($ids) > 0)
            {
                $id = $ids;
            }
            else
            {
                $id = "";
            }
        }
        else {
            $id = clean_numeric_text($this->input->post('id'));
        }

        // Process data.
        if(!is_array($id))
        {
            if(strlen($id) == 0)
            {
                $errors++;
                $response['message'] = "ID field is invalid. ";
            }
        }
        if(!$deleted_rows = $this->m_category->delete($id))
        {
            $errors++;
            $response['message'] .= "Row delete failed. ";
        }
        if(!$data = $this->m_category->get_all())
        {
            $errors++;
            $response['message'] .= "Data fetch failed. ";
        }

        // Check for errors before output.
        if($errors == 0)
        {
            // List of ids.
            if(is_array($id)) $id = implode(',', $id);

            // Transfer images to uncategorized.
            $this->db->query("UPDATE `images` SET `category_id`=1 WHERE `category_id` IN ({$id})");

            $response['status'] = "ok";
            $response['message'] = "{$deleted_rows} category item(s) deleted.";
            $response['data'] = $data;
        }

        // Generate output.
        header("Content-Type: application/json");
        echo json_encode($response);
    }
    private function get_all()
    {
        $response = [
            "status" => "error",
            "message" => "Unknown error has occured.",
            "data" => null
        ];
        if($data = $this->m_category->get_all())
        {
            $response['status'] = "ok";
            $response['message'] = "Success.";
            $response['data'] = $data;
        }
        header("Content-Type: application/json");
        echo json_encode($response);
    }
    private function test()
    {
        header("Content-Type: text/plain");
        $sample_text = 'The quick brown fox jumps over the lazy dog. 1234567890 !@#$%^&*() +-_.';
        echo clean_body_text($sample_text);
    }
}