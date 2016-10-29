<?php
class Index extends CI_Controller
{
    function __construct()
    {
        parent::__construct();
    }

    public function index($option=null)
    {
        header("Location: ".base_url('admin/dashboard'));
    }
}