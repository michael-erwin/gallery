<?php
/**
* CI controller for media uploads under Media Gallery project.
* Requires:
* - ./application/model/M_categories.php
*
* @package  Media Gallery
* @author   Michael Erwin Virgines <michael.erwinp@gmail.com>
*
*/
class Upload extends CI_Controller
{
    private $sidebar_menus, $page_title, $page_description, $breadcrumbs;

    function __construct()
    {
        parent::__construct();
        $this->load->model('m_category');
        $this->page_title = "Upload";
        $this->page_description = "Add New";
        $this->breadcrumbs =
        [
            ["text"=>"Admin","link"=>base_url("admin/dashboard")],
            ["text"=>"Upload","link"=>""]
        ];
        $this->sidebar_menus = ["media","upload"];
    }

    public function index($option=null)
    {
        // Sidebar - User Panel.
        $data['sidebar_user_panel'] = $this->load->view('admin/v_sidebar_user_panel','',true);

        // Sidebar - Menu.
        $data['sidebar_menu'] = $this->load->view('admin/v_sidebar_menu','',true);

        // Content.
        $data['content'] = $this->load->view('admin/v_content_upload','',true);

        // JSON Data used by js to initialize contents.
        $data['json']['sidebar_menus'] = json_encode($this->sidebar_menus);
        $data['json']['title'] = "{\"text\":\"{$this->page_title}\",\"small\":\"{$this->page_description}\"}";
        $data['json']['breadcrumbs'] = json_encode($this->breadcrumbs);

        // Page objects.
        $data['objects']  = $this->load->view('admin/v_object_photo_editor','',true);
        $data['objects'] .= $this->load->view('admin/v_object_video_editor','',true);

        // JS Scripts.
        $js_scripts = [
            'category_list' => json_encode($this->m_category->get_all('photo'))
        ];
        $data['js_scripts'] = $this->load->view('admin/scripts/v_scripts_media_upload',$js_scripts,true);

        // Page Template.
        $this->load->view('v_admin_layout',$data);
    }

    public function json($option=null)
    {
        // Content.
        $body = clean_whitespace($this->load->view('admin/v_content_upload','',true));

        // Page objects.
        $objects  = $this->load->view('admin/v_object_photo_editor','',true);
        $objects .= $this->load->view('admin/v_object_video_editor','',true);

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
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    public function js()
    {
        header("Content-Type: application/javascript");
        $js_scripts = [
            'category_list' => json_encode($this->m_category->get_all('photo'))
        ];
        $this->load->view('admin/scripts/v_scripts_media_upload',$js_scripts);
    }
}
