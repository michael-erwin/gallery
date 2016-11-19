<?php
/**
* CI model for videos under Media Gallery project.
* @package  Media Gallery
* @author   Michael Erwin Virgines <michael.erwinp@gmail.com>
*
*/
class M_tag extends CI_Model
{
    private $media_path, $max_thumbs;

    function __construct()
    {
        parent::__construct();
        $this->config->load('media_gallery');
    }

    /**
    * Function 'add' inserts new tag entries to database.
    *
    * @param array $tags Array of string tags.
    */
    public function add ($tags)
    {
        if ($tags)
        {
            $tags_compare = []; foreach ($tags as $tag) {$tags_compare[] = "'$tag'";}
            $tags_new = [];
            $tags_found = [];
            $tags_query = $this->db->query("SELECT `id`,`name` FROM `tags` WHERE `name` IN (".implode(',', $tags_compare).")");
            $tags_data = $tags_query->result_array(); foreach ($tags_data as $tag_data) { $tags_found[] = $tag_data['name']; }
            
            foreach ($tags as $tag) {
                if(!in_array($tag, $tags_found)) $tags_new[] = $tag;
            }

            if(count($tags_new) > 0) {
                $date = time();
                $tags_insert_query = "INSERT INTO `tags`(`name`,`date_added`,`date_modified`) VALUES ";
                $insert_values = [];
                foreach($tags_new as $tag_new) {
                    $insert_values[] = "('{$tag_new}',{$date},{$date})";
                }
                $tags_insert_query .= implode(',', $insert_values);
                return $this->db->query($tags_insert_query);
            }
        }
        else
        {
            return false;
        }
    }
}