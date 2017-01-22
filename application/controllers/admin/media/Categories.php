<?php
class Categories extends CI_Controller
{
    private $sidebar_menus, $page_title, $page_description, $breadcrumbs;

    function __construct()
    {
        parent::__construct();
        $this->page_title = "Categories";
        $this->page_description = "All Media";
        $this->breadcrumbs =
        [
            ["text"=>"Admin","link"=>base_url("admin/dashboard")],
            ["text"=>"Categories","link"=>""]
        ];
        $this->sidebar_menus = ["media","categories"];
        $this->load->model('m_category');
    }

    public function index($option=null)
    {
        // Sidebar - User Panel.
        $data['sidebar_user_panel'] = $this->load->view('admin/v_sidebar_user_panel','',true);

        // Sidebar - Menu.
        $data['sidebar_menu'] = $this->load->view('admin/v_sidebar_menu','',true);

        // Content.
        $data['content'] = $this->load->view('admin/v_content_categories','',true);

        // JSON Data used by js to initialize contents.
        $data['json']['sidebar_menus'] = json_encode($this->sidebar_menus);
        $data['json']['title'] = "{\"text\":\"{$this->page_title}\",\"small\":\"{$this->page_description}\"}";
        $data['json']['breadcrumbs'] = json_encode($this->breadcrumbs);

        // Page objects.
        $data['objects'] = $this->load->view('admin/v_object_category_editor','',true);

        // JS Scripts.
        $data['js_scripts'] = $this->load->view('admin/scripts/v_scripts_media_categories','',true);

        // Page Template.
        $this->load->view('v_admin_layout',$data);
    }

    public function json($option=null)
    {
        $list_type = $this->input->get('list');
        if($list_type == "photos")
        { // Get list of all categories under photos media type.
            $response = $this->m_category->get_all('photo');
        }
        elseif($list_type == "videos")
        { // Get list of all categories under photos media type.
            $response = $this->m_category->get_all('video');
        }
        else {
            $body = clean_whitespace($this->load->view('admin/v_content_categories','',true));
            // Page objects.
            $objects = $this->load->view('admin/v_object_category_editor','',true);

            if ($option)
            {
                if ($option == "page_title") $response = $this->page_title;
                if ($option == "page_description") $response = $this->page_description;
                if ($option == "breadcrumbs") $response = $this->breadcrumbs;
                if ($option == "content") $response = $body;
            }
            else
            {
                $response = [
                    "sidebar_menus" => $this->sidebar_menus,
                    "page_title" => $this->page_title,
                    "page_description" => $this->page_description,
                    "breadcrumbs" => $this->breadcrumbs,
                    "content" => $body,
                    "objects" => $objects
                ];
            }
        }
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    public function js()
    {
        header("Content-Type: application/javascript");
        $this->load->view('admin/scripts/v_scripts_media_categories');
    }
}
