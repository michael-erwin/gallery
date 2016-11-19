<?php
class Settings extends CI_Controller
{
    private $sidebar_menus, $page_title, $page_description, $breadcrumbs;

    function __construct()
    {
        parent::__construct();
        $this->page_title = "Settings";
        $this->page_description = "General";
        $this->breadcrumbs =
        [
            ["text"=>"Admin","link"=>base_url("admin/dashboard")],
            ["text"=>"Settings","link"=>""]
        ];
        $this->sidebar_menus = ["settings"];
    }

    public function index($option=null)
    {
        // Sidebar - User Panel.
        $data['sidebar_user_panel'] = $this->load->view('admin/v_sidebar_user_panel','',true);

        // Sidebar - Menu.
        $data['sidebar_menu'] = $this->load->view('admin/v_sidebar_menu','',true);

        // Content.
        $data['content'] = $this->load->view('admin/v_content_settings','',true);

        // JSON Data
        $data['json']['sidebar_menus'] = json_encode($this->sidebar_menus);
        $data['json']['title'] = "{\"text\":\"{$this->page_title}\",\"small\":\"{$this->page_description}\"}";
        $data['json']['breadcrumbs'] = json_encode($this->breadcrumbs);

        // JS Scripts.
        //$data['js_scripts'] = $this->load->view('admin/scripts/v_scripts_settings','',true);

        // Page Template.
        $this->load->view('v_admin_layout',$data);
    }

    public function json($option=null)
    {
        $body = clean_whitespace($this->load->view('admin/v_content_settings','',true));

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
                "content" => $body
            ];
        }
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    public function js()
    {
        header("Content-Type: application/javascript");
        //$this->load->view('admin/scripts/v_scripts_*');
    }
}