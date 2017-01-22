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

    /**
    * Function description.
    * @param  type  $variable  Variable description.
    * @return type             Return value description.
    *
    */
    public function _remap()
    {
        $action = $this->uri->segment(2);
        $param_1 = $this->uri->segment(3);
        $param_2 = $this->uri->segment(4);
        $param_3 = $this->uri->segment(5);

        if($action == "manage")
        {
            if($param_1 == "add")
            {
                $this->add();
            }
            elseif($param_1 == "update")
            {
                $this->update();
            }
            elseif($param_1 == "delete")
            {
                $this->delete();
            }
            elseif($param_1 == "get_all")
            {
                $media_type = clean_alpha_text($this->input->get('type'));
                $this->get_all($media_type);
            }
        }
        elseif($action == "photos" || $action == "videos")
        {  // If $action parameter follows "categories/type" pattern.
           // i.e. http://domain.com/categories/photos/

            if(preg_match('/^([a-zA-z\-\_]+)-([0-9]+)$/', $param_1, $main_cat_match))
            {  // If $param_1 parameter follows "main-category-name-1" pattern.
               // i.e. http://domain.com/categories/photos/main-category-name-1
               // Extract from URI name and id.

                $main = [
                    'type' => $action,
                    'id' => $main_cat_match[2],
                    'title' => $main_cat_match[1]
                ];

                if(preg_match('/^([a-zA-z\-\_]+)-([0-9]+)$/', $param_2, $sub_cat_match))
                {  // If $param_2 parameter follows "sub-category-name-1" pattern.
                   // i.e. http://domain.com/categories/photos/main-category-name-1/sub-category-name-2

                    $sub = [
                        'type' => $action,
                        'id' => $sub_cat_match[2],
                        'title' => $sub_cat_match[1]
                    ];
                    $page = preg_match('/^[0-9]+$/', $param_3)? $param_3 : 1;
                    $this->display_media_items($action,$main['id'],$main['title'],$sub['id'],$sub['title'],$page);
                }
                else{
                    $this->display_subcats($action,$main['id'],$main['title']);
                }
            }
            else{
                // Display main categories under photos media types.
                $this->display_maincats($action);
            }
        }
        else
        {
            $this->display_media_types();
        }
    }

    /**
    * Function description.
    * @param  type  $variable  Variable description.
    * @return type             Return value description.
    *
    */
    private function display_media_types()
    {
        // Page meta information.
        $data['page_title'] = "Categories";
        $data['meta_description'] = "Select category types";
        $data['meta_keywords'] = "";
        // Build search wdiget html markups.
        $data['search_widget'] = $this->load->view('common/v_search_widget',['type'=>"photos"],true);
        // Build pagination html markups.
        $pagination_data = [
            'type' => "photos",
            'keywords' => "",
            'category_id' => "",
            'category_name' => "",
            'current_page' => 1,
            'total_page' => 1,
            'prev_disabled' => true,
            'next_disabled' => true
        ];
        $data['pagination'] = $this->load->view('common/v_pagination_widget',$pagination_data,true);
        // Build breadcrumbs html markups.
        $crumbs = ['Home'=>base_url(),'Categories'=>""];
        $data['breadcrumbs'] = $this->load->view('common/v_breadcrumbs_frontend',['crumbs'=>$crumbs],true);
        // Build category thumbs html markups.
        $data['category_thumbs'] = "";
        $items = [
            ["icon"=>"assets/img/category_icons/core/photos.jpg","link"=>base_url('categories/photos'),"title"=>"Photos"],
            ["icon"=>"assets/img/category_icons/core/videos.jpg","link"=>base_url('categories/videos'),"title"=>"Videos"]
        ];
        foreach($items as $item)
        {
            $data['category_thumbs'] .= preg_replace("/\n/",'',$this->load->view('common/v_category_thumb_frontend',$item,true));
        }
        $this->load->view("v_results_layout",$data);
    }

    /**
    * Function description.
    * @param  string  $type  Media type name in plural i.e. photos.
    * @return void           Flush HTML buffer to browser.
    *
    */
    private function display_maincats($type)
    {
        // Page meta information.
        $data['page_title'] = "Categories";
        $data['meta_description'] = "Select category types";
        $data['meta_keywords'] = "";
        // Build breadcrumbs html markups.
        $crumbs = ['Home'=>base_url(),'Categories'=>base_url('categories'),ucfirst($type) => ""];
        $data['breadcrumbs'] = $this->load->view('common/v_breadcrumbs_frontend',['crumbs'=>$crumbs],true);
        // Build search wdiget html markups.
        $data['search_widget'] = $this->load->view('common/v_search_widget',['type'=>$type],true);
        // Build pagination html markups.
        $pagination_data = [
            'type' => $type,
            'keywords' => "",
            'category_id' => "",
            'category_name' => "",
            'current_page' => 1,
            'total_page' => 1,
            'prev_disabled' => true,
            'next_disabled' => true
        ];
        $data['pagination'] = $this->load->view('common/v_pagination_widget',$pagination_data,true);
        // Build category thumbs html markups.
        $data['category_thumbs'] = "";
        $sql = "SELECT * FROM `categories` WHERE type='".rtrim(clean_title_text($type),"s")."' AND `level`=1 AND `published`='yes' ORDER BY `title`";
        $query = $this->db->query($sql); $categories = $query->result_array();
        foreach($categories as $item)
        {
            $sef_title = preg_replace('/\s/','-',strtolower($item['title'])).'-'.$item['id'];
            $icon_url = empty(trim($item['icon']))? "" : empty(parse_url($item['icon'], PHP_URL_SCHEME))? base_url($item['icon']) : $item['icon'];
            $item_info = [
                'icon' => $icon_url,
                'title' => ucfirst($item['title']),
                'link' => base_url("categories/{$type}/{$sef_title}")
            ];
            $data['category_thumbs'] .= $this->load->view('common/v_category_thumb_frontend',$item_info,true);
        }
        $data['category_thumbs'] = compress_html($data['category_thumbs']);
        $this->load->view("v_results_layout",$data);
    }

    /**
    * Function description.
    * @param  type  $variable  Variable description.
    * @return type             Return value description.
    *
    */
    private function display_subcats($type,$main_id,$main_title)
    {
        // Page meta information.
        $data['page_title'] = "Categories";
        $data['meta_description'] = "Select category types";
        $data['meta_keywords'] = "";
        // Build breadcrumbs html markups.
        $main_link = preg_replace('/\s/','-',strtolower($main_title)).'-'.$main_id;
        $crumbs = [
            'Home'=>base_url(),
            'Categories'=>base_url('categories'),
            ucfirst($type)=>base_url("categories/{$type}"),
            ucfirst($main_title)=>""
        ];
        $data['breadcrumbs'] = $this->load->view('common/v_breadcrumbs_frontend',['crumbs'=>$crumbs],true);
        // Build search wdiget html markups.
        $data['search_widget'] = $this->load->view('common/v_search_widget',['type'=>$type],true);
        // Build pagination html markups.
        $pagination_data = [
            'type' => $type,
            'keywords' => "",
            'category_id' => "",
            'category_name' => "",
            'current_page' => 1,
            'total_page' => 1,
            'prev_disabled' => true,
            'next_disabled' => true
        ];
        $data['pagination'] = $this->load->view('common/v_pagination_widget',$pagination_data,true);
        // Build category thumbs html markups.
        $data['category_thumbs'] = "";
        $sql = "SELECT * FROM `categories` WHERE type='".rtrim(clean_title_text($type),"s")."' AND `parent_id`={$main_id} AND `level`=2 AND `published`='yes' ORDER BY `title`";
        $query = $this->db->query($sql); $categories = $query->result_array();
        foreach($categories as $item)
        {
            $sef_title = preg_replace('/\s/','-',strtolower($item['title'])).'-'.$item['id'];
            $icon_url = empty(trim($item['icon']))? "" : empty(parse_url($item['icon'], PHP_URL_SCHEME))? base_url($item['icon']) : $item['icon'];
            $item_info = [
                'icon' => $icon_url,
                'title' => ucfirst($item['title']),
                'link' => base_url("categories/{$type}/{$main_link}/{$sef_title}")
            ];
            $data['category_thumbs'] .= $this->load->view('common/v_category_thumb_frontend',$item_info,true);
        }
        $data['category_thumbs'] = compress_html($data['category_thumbs']);
        $this->load->view("v_results_layout",$data);
    }

    /**
    * Function description.
    * @param  type  $variable  Variable description.
    * @return type             Return value description.
    *
    */
    private function display_media_items($type,$main_id,$main_title,$sub_id,$sub_title,$page)
    {
        // Page meta information.
        $data['page_title'] = "Categories";
        $data['meta_description'] = "Select category types";
        $data['meta_keywords'] = "";
        // Build breadcrumbs html markups.
        $main_link = preg_replace('/\s/','-',strtolower($main_title)).'-'.$main_id;
        //$sub_link = preg_replace('/\s/','-',strtolower($main_title)).'-'.$main_id;
        $crumbs = [
            'Home' => base_url(),
            'Categories' => base_url('categories'),
            ucfirst($type) => base_url("categories/{$type}"),
            ucfirst($main_title) => base_url("categories/{$type}/{$main_link}"),
            ucfirst($sub_title) => ""
        ];
        $data['breadcrumbs'] = $this->load->view('common/v_breadcrumbs_frontend',['crumbs'=>$crumbs],true);
        // Build search wdiget html markups.
        $data['search_widget'] = $this->load->view('common/v_search_widget',['type'=>$type],true);
        // Build pagination html markups.
        $pagination_data = [
            'type' => $type,
            'keywords' => "",
            'category_id' => "",
            'category_name' => "",
            'current_page' => 1,
            'total_page' => 1,
            'prev_disabled' => true,
            'next_disabled' => true
        ];
        $data['pagination'] = $this->load->view('common/v_pagination_widget',$pagination_data,true);
        // Build results thumbs.
        //$thumb_data['data'] = json_encode($item);
        // $thumb_data['title'] = $item['title'];
        // $thumb_data['uid'] = $item['uid'];
        // $thumb_data['seo_title'] = preg_replace('/\s/', '-', $item['title']).'-'.$item['uid'];
        // $data['thumbs'] .= $this->load->view('common/v_result_thumbs_photos',$thumb_data,true);
        // TODO: Make properly pagination output.
        $data['thumbs'] = "";
        $sql = "SELECT * FROM `{$type}` WHERE `category_id`={$sub_id}";
        $query = $this->db->query($sql); $result = $query->result_array();
        foreach($result as $item)
        {
            $thumb_data['title'] = $item['title'];
            $thumb_data['uid'] = $item['uid'];
            $thumb_data['seo_title'] = preg_replace('/\s/', '-', $item['title']).'-'.$item['uid'];
            $data['thumbs'] .= $this->load->view("common/v_result_thumbs_{$type}",$thumb_data,true);
        }
        $data['thumbs'] = compress_html($data['thumbs']);
        $this->load->view("v_results_layout",$data);
    }

    private function results_layout($result, $page_meta=null)
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

    /**
    * Inserts new category record.
    * @param  integer  $level        Post variable with values 1 or 2.
    * @param  string   $type         Post variable - media type in plural form i.e. photos.
    * @param  string   $title        Post variable description.
    * @param  string   $description  Post variable description.
    * @param  string   $icon         Post variable description.
    * @param  string   $publish      Post variable description.
    * @param  integer  $parent_id    Post variable description.
    * @return string                 JSON text response.
    *
    */
    private function add()
    {
        // Required params via post.
        $level = clean_numeric_text(trim($this->input->post('level')));
        $type = rtrim(clean_alpha_text(trim($this->input->post('type'))),'s'); // Strips 's' at the end.
        $title = clean_title_text(trim($this->input->post('title')));
        $description = clean_body_text(trim($this->input->post('description')));
        $icon = trim($this->input->post('icon'));
        $publish = clean_alpha_text(trim($this->input->post('publish')));
        $parent_id = clean_numeric_text(trim($this->input->post('parent_id')));

        $errors = 0;
        $response = [
            "status" => "error",
            "message" => "Unknown error has occured.",
            "data" => "null"
        ];
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
        if(!$this->m_category->add($level, $type, $title, $description, $icon, $publish, $parent_id))
        {
            $errors++;
            $response['message'] .= "Database insert failed. ";
        }
        if(!$data = $this->m_category->get_all($type))
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

    /**
    * Update existing category record.
    * @param  string   $type         Post variable - media type in plural form i.e. photos.
    * @param  string   $title        Post variable description.
    * @param  string   $description  Post variable description.
    * @param  string   $icon         Post variable description.
    * @param  string   $publish      Post variable description.
    * @param  integer  $parent_id    Post variable description.
    * @return string                 JSON text response.
    *
    */
    private function update()
    {
        // Required fields.
        $id = clean_numeric_text(trim($this->input->post('id')));
        $type = rtrim(clean_alpha_text(trim($this->input->post('type'))),'s'); // Strips 's' at the end.
        $title = clean_title_text(trim($this->input->post('title')));
        $description = clean_body_text(trim($this->input->post('description')));
        $icon = trim($this->input->post('icon'));
        $publish = clean_alpha_text(trim($this->input->post('publish')));
        $parent_id = clean_numeric_text(trim($this->input->post('parent_id')));

        $errors = 0;
        $response = [
            "status" => "error",
            "message" => "Unknown error has occured.",
            "data" => "null"
        ];

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
        if(!$this->m_category->update($id, $title, $description, $icon, $publish, $parent_id))
        {
            $errors++;
            $response['message'] .= "Database update failed. ";
        }
        if(!$data = $this->m_category->get_all($type))
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
    /**
    * Function description.
    * @param  type  $variable  Variable description.
    * @return type             Return value description.
    *
    */
    private function delete()
    {
        $errors = 0;
        $response = [
            "status" => "error",
            "message" => "Unknown error has occured. ",
            "data" => "null"
        ];
        $accept_media_type_ids = ["photo","video"];

        // Required fields.
        $media_type = clean_alpha_text($this->input->post('type'));
        $media_type_id = rtrim($media_type,'s');
        $item_id = $this->input->post('id');

        // Check media type is accurate.
        if(in_array($media_type_id,$accept_media_type_ids))
        {
            $ids = [];
            if(is_array($item_id))
            {
                foreach($item_id as $row)
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
                    $item_id = $ids;
                }
                else
                {
                    $item_id = "";
                }
            }
            else {
                $item_id = clean_numeric_text($this->input->post('id'));
            }
            // Ensure $item_id is not empty.
            if(!is_array($item_id))
            {
                if(strlen($item_id) == 0)
                {
                    $errors++;
                    $response['message'] = "ID field is invalid. ";
                }
            }
            // Delete action:
            // Deletes all associated subcategories.
            // Move all associated media to category 1 (uncategorized).
            if(!$deleted_rows = $this->m_category->delete($item_id,$media_type_id))
            {
                $errors++;
                $response['message'] .= "Row delete failed. ";
            }
            // Get latest record after delete.
            if(!$data = $this->m_category->get_all($media_type_id))
            {
                $errors++;
                $response['message'] .= "Data fetch failed. ";
            }
        }
        else
        {
            $response['message'] .= "Unsupported media id : {$media_type_id}. ";
            $errors++;
        }
        // Check for errors before output.
        if($errors == 0)
        {
            $response['status'] = "ok";
            $response['message'] = "{$deleted_rows} category item(s) deleted.";
            $response['data'] = $data;
        }

        // Generate output.
        header("Content-Type: application/json");
        echo json_encode($response);
    }
    /**
    * Function description.
    * @param  type  $variable  Variable description.
    * @return type             Return value description.
    *
    */
    private function get_all($type)
    {
        $type = rtrim($type,'s'); // Removes letter 's' at the end.
        $response = [
            "status" => "error",
            "message" => "Unknown error has occured.",
            "data" => null
        ];
        if($data = $this->m_category->get_all($type))
        {
            $response['status'] = "ok";
            $response['message'] = "Success.";
            $response['data'] = $data;
        }
        header("Content-Type: application/json");
        echo json_encode($response);
    }
}
