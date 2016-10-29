<?php
/**
* CI model for images under Media Gallery project.
* @package  Media Gallery
* @author   Michael Erwin Virgines <michael.erwinp@gmail.com>
*
*/
class M_video extends CI_Model
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
    * Function 'add' inserts new video entry to database.
    *
    * @param string        $title     Initial title for the uploaded video file (required).
    * @param string        $uid       Unique identifier that will map to physical file name (required).
    * @param integer       $width     Full width of the original video in pixels (required).
    * @param integer       $height    Full height of the original video in pixels (required).
    * @param float         $duration  Video duration. Float value in seconds (required).
    * @param integer|null  $category  Category id where the video belong (optional).
    * @return integer|boolean         Id number of inserted row on success, false on failure.
    */
    public function add ($title = null, $uid = null, $width=null, $height=null, $size=null, $category=null, $duration)
    {
        if ($title && $uid && $width && $height)
        {
            $title = $this->db->escape($title);
            $width = clean_numeric_text($width);
            $height = clean_numeric_text($height);
            $duration = clean_float_text($duration);
            $date = time();
            $category = $category? $this->db->escape($category) : 1;

            $sql = "INSERT INTO `videos` SET `category_id`={$category}, `title`={$title}, `uid`='{$uid}', `width`={$width}, `height`={$height}, `file_size`={$size}, `duration`={$duration}, date_added={$date}";
            
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
    * Function 'update' updates one or more video entry in database.
    *
    * @param   integer|array  $id           Id or array of id of the video.
    * @param   string         $title        Title of the video.
    * @param   string         $description  Description of the entry.
    * @param   string         $tags         Tags of the video entry.
    * @param   integer|null   $category     Category id where the video belong.
    * @param   integer        $file_size    File size in bytes.
    * @param   boolean        $complete     When video is fully converted. Value of 1 if true, 0 if false.
    * @return  boolean                      Number of affected rows on success, false on failure.
    *
    */
    public function update ($id=null, $title = null, $description=null, $tags=null, $category=null, $file_size=null, $complete=null)
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
            $title = is_null($title)? "" : $this->db->escape_str(clean_title_text($title));
            $description = is_null($description)? "" : $this->db->escape_str(clean_body_text($description));
            $tags = is_null($tags)? "" : $this->db->escape_str(clean_title_text($tags));
            $category = is_null($category)? "" : clean_numeric_text($category);
            $file_size = is_null($file_size)? "" : clean_numeric_text($file_size);
            $complete = is_null($complete)? "" : clean_numeric_text($complete);
            $date = time();

            $sql = "UPDATE `videos` SET";
            if (strlen($title) > 0) $sql .= " `title`='{$title}',";
            if (strlen($description) > 0) $sql .= " `description`='{$description}',";
            if (strlen($tags) > 0) $sql .= " `tags`='{$tags}',";
            if (strlen($category) > 0) $sql .= " `category_id`={$category},";
            if (strlen($file_size) > 0) $sql .= " `file_size`={$file_size},";
            if (strlen($complete) > 0) $sql .= " `complete`={$complete},";
            $sql .= " `date_modified`={$date} WHERE `id` IN ({$id})";
            
            $this->db->query($sql);
            return $this->db->affected_rows();
        }
        else
        {
            return false;
        }
    }

    /**
    * Delete a one or more video entry.
    * @param  integer|array $id Id of the video(s) to delete.
    * @return boolean       Returns true on success, false on failure.
    *
    */
    public function delete($id=null)
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

        if(strlen($id) > 0)
        {
            // Check if entry exists.
            $get_query = $this->db->query("SELECT `id`,`uid` FROM `videos` WHERE `id` IN ({$id})");
            $items = $get_query->result_array();

            if(count($items) == 0)
            {
                return false;
            }
            else
            {
                // Delete physical files.
                foreach($items as $item)
                {
                    $this->delete_file($item['uid']);
                }

                // Delete database entry.
                $this->db->query("DELETE FROM `videos` WHERE `id` IN ({$id})");

                return $this->db->affected_rows();
            }
        }
        else
        {
            return false;
        }
    }

    private function delete_file($uid=null)
    {
        if($uid)
        {
            // Delete full size video from disk.
            @unlink($this->media_path."/videos/private/full_size/{$uid}.mp4");

            // Delete 480p preview video from disk.
            @unlink($this->media_path."/videos/public/480p/{$uid}.mp4");

            // Delete poster from disk.
            @unlink($this->media_path."/videos/public/480/{$uid}.jpg");

            // Delete 256 cover image from disk.
            @unlink($this->media_path."/videos/public/256/{$uid}.jpg");

            // Delete 128 cover image from disk.
            @unlink($this->media_path."/videos/public/128/{$uid}.jpg");
        }
    }

    /**
    * Function 'get_by_id' fetch single or multiple video entry by id.
    * @param  integer|array  $id Id of video entry (required).
    * @return array          Array of data for entry.
    *
    */
    public function get_by_id($id)
    {
        $ids = [];

        if(is_array($id))
        {
            foreach ($id as $item) {
                $sanitized = clean_numeric_text($item);
                if(strlen($sanitized) > 0) $ids[] = $sanitized;
            }
        }
        else
        {
            $sanitized = clean_numeric_text($id);
            if(strlen($sanitized) > 0) $ids[] = $sanitized;
        }

        if(count($ids) > 0)
        {
            $ids = implode(',', $ids);
            $sql_get = "SELECT * FROM `videos` WHERE `id` IN ({$ids})";

            if($get_query = $this->db->query($sql_get))
            {
                $result = $get_query->result_array();
                if(count($result) > 0) return $result;
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
    * Function 'get_by_page' fetch image entries by page.
    * @param  integer  $per_page  Number of entries to display per page (required).
    * @param  integer  $page      Page number to get (required).
    * @return array               Array of image objects.
    *
    */
    public function get_all_by_page($per_page, $page)
    {
        $page -= 1;
        $offset = $per_page * $page;
        $sql = "SELECT * FROM `videos` LIMIT {$per_page} OFFSET {$offset}";
        $query = $this->db->query($sql);
        return $query->result_array();
    }
}