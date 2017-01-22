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
    * @param  integer  $level        1 or 2.
    * @param  string   $type         Media type in singular form i.e. photo.
    * @param  string   $title        Title of the category.
    * @param  string   $description  Description.
    * @param  string   $publish      Whether to set public or not. Values can be 'yes' or 'no'.
    * @param  integer  $parent_id    Parent id where the new category will be placed (optional).
    * @return integer|boolean        Id number of inserted row on success, false on failure.
    *
    */
    public function add ($level=null, $type = null, $title = null, $description=null, $icon = null, $publish=null, $parent_id = null)
    {
        $parent_id = isset($parent_id)? (is_numeric($parent_id)? $parent_id : 0) : 0;

        if ($title)
        {
            $allowed_types = ['photo','video'];
            $title = $this->db->escape_str($title);
            $type = $type;
            $description = $this->db->escape_str($description);
            $icon = $this->db->escape_str($icon);
            $publish = $this->db->escape_str($publish);
            $date = time();
            // Make sure to only insert allowed types.
            if(in_array($type,$allowed_types))
            {
                $sql  = "INSERT INTO `categories` SET `level`={$level}, `type`='{$type}', `title`='{$title}', `description`='{$description}',";
                $sql .= " `icon`='{$icon}', `published`='{$publish}', `parent_id`={$parent_id}, date_added={$date}";
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
        $parent_id = isset($parent_id)? (is_numeric($parent_id)? $parent_id : 0) : 0;

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
    * Delete a single or multiple category entry.
    * @param   integer|array  $id     Number or array of numbers of the category to delete.
    * @param   string         $type   Media type in singular form i.e. photo.
    * @return  boolean                Returns numeric (affected rows) on success, false on failure.
    *
    */
    public function delete($id,$type)
    {
        $ids = [];
        $id = is_null($id)? "" : $id;
        // Sanitize $id values either string or array.
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
        // Validate $id value.
        if (strlen($id) > 0)
        {
            // Delete category entries (main or sub) associated with id(s).
            $sql_delete_1 = "DELETE FROM `categories` WHERE `id` IN ({$id})";
            $this->db->query($sql_delete_1);
            $affected_cats = $this->db->affected_rows();

            // Delete all associated categories having same parent id(s). Essentially all sub categories.
            $sql_delete_2 = "DELETE FROM `categories` WHERE `parent_id` IN ({$id})";
            $this->db->query($sql_delete_2);

            // Move associated media of subcategories to category with id of 1 (Uncategorized).
            if($type=="video"){$type='videos';}elseif($type=="photo"){$type='photos';}
            $sql_delete_3 = "UPDATE `{$type}` SET `category_id`=1 WHERE `category_id` IN ({$id})";
            $this->db->query($sql_delete_3);

            return $affected_cats;
        }
        else
        {
            return false;
        }
    }

    /**
    * Function 'get_all' fetch all category entries.
    * @param   string  $type   Media type in singular form i.e. 'photo'.
    * @return  array           Array of category objects having $type media id and the uncategorized.
    *
    */
    public function get_all($type = 'photo')
    {
        $sql = "SELECT * FROM `categories` WHERE `type`='{$type}' OR `type`='all' ORDER BY `level`,`title`,`date_added` ASC";
        $query = $this->db->query($sql);
        return $query->result_array();
    }
}
