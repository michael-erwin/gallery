<?php
/**
* CI model for categories under Media Gallery project.
*
* @package  Media Gallery
* @author   Michael Erwin Virgines <michael.erwinp@gmail.com>
*
*/
class M_category extends CI_Model
{
    private $media_path, $max_thumbs;

    function __construct()
    {
        parent::__construct();
        $this->config->load('media_gallery');
        $this->media_path = $this->config->item('mg_media_path');
        $this->max_thumbs = $this->config->item('mg_max_thumbs');
    }

    /**
    * Function 'add' inserts new image entry to database.
    * @param  string   $title        Title of the category.
    * @param  string   $description  Description.
    * @param  string   $publish      Whether to set public or not. Values can be 'yes' or 'no'.
    * @param  integer  $parent_id    Parent id where the new category will be placed (optional).
    * @return integer|boolean        Id number of inserted row on success, false on failure.
    *
    */
    public function add ($title = null, $description=null, $icon = null, $publish=null, $parent_id = null)
    {
        $parent_id = isset($parent_id)? is_numeric($parent_id)? 1 : $parent_id : 1;

        if ($title)
        {
            $title = $this->db->escape_str($title);
            $description = $this->db->escape_str($description);
            $icon = $this->db->escape_str($icon);
            $publish = $this->db->escape_str($publish);
            $date = time();

            $sql = "INSERT INTO `categories` SET `title`='{$title}', `description`='{$description}', `icon`='{$icon}', `published`='{$publish}', `parent_id`={$parent_id}, date_added={$date}";
            
            if ($query = $this->db->query($sql))
            {
                return $this->db->insert_id();
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    /**
    * Function 'update' inserts new image entry to database.
    * @param  integer  $id           Id of the category.
    * @param  string   $title        Title of the category.
    * @param  string   $description  Description.
    * @param  string   $publish      Whether to set public or not. Values can be 'yes' or 'no'.
    * @param  integer  $parent_id    Parent id where the category will be placed (optional).
    * @return integer|boolean        True on success, false on failure.
    *
    */
    public function update ($id = null, $title = null, $description=null, $icon = null, $publish=null, $parent_id = null)
    {
        $id = isset($id)? is_numeric($id)? $id : null : null;
        $parent_id = isset($parent_id)? is_numeric($parent_id)? 1 : $parent_id : 1;

        if ($id && $title)
        {
            $title = $this->db->escape_str($title);
            $description = $this->db->escape_str($description);
            $publish = $this->db->escape_str($publish);
            $date = time();

            $sql = "UPDATE `categories` SET `title`='{$title}', `description`='{$description}', `icon`='{$icon}', `published`='{$publish}', `parent_id`={$parent_id}, date_modified={$date} WHERE `id`={$id}";
            
            if ($this->db->query($sql))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    /**
    * Delete a single category entry.
    * @param   integer|array  Number or array of numbers of the category to delete.
    * @return  boolean        Returns true on success, false on failure.
    *
    */
    public function delete($id)
    {
        $ids = [];
        $id = is_null($id)? "" : $id;

        if (is_array($id))
        {
            foreach ($id as $row) {
                $row = clean_numeric_text($row);
                if(strlen($row) > 0) $ids[] = $row;
            }
            if(count($ids) > 0)
            {
                $id = implode(',', $ids);
            }
            else
            {
                $id = "";
            }
        }
        else
        {
            $id = clean_numeric_text($id);
        }

        if (strlen($id) > 0)
        {
            $sql_delete = "DELETE FROM `categories` WHERE `id` IN ({$id})";
            $this->db->query($sql_delete);
            return $this->db->affected_rows();
        }
        else
        {
            return false;
        }
    }

    /**
    * Function 'get_all' fetch all category entries.
    * @return array Array of category objects.
    *
    */
    public function get_all()
    {
        $sql = "SELECT * FROM `categories`";
        $query = $this->db->query($sql);
        return $query->result_array();
    }
}