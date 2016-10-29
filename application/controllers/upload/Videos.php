<?php
/**
* Video uploader.
*/
class Videos extends CI_Controller
{
    
    function __construct()
    {
        parent::__construct();
        $this->load->model('m_video');
        $this->config->load('media_gallery');
        $this->media_path = $this->config->item('mg_media_path');
    }

    public function index()
    {
        $category_id = $this->input->post('category_id');

        if(isset($_FILES['file']) && $category_id)
        {
            $path = $this->media_path;
            $uid = str_replace('.', '_', microtime(true));
            $source = $path.'/videos/temp/'.$uid;

            if(move_uploaded_file($_FILES['file']['tmp_name'], $source))
            {
                $response = ['status'=>'error','code'=>null,'message'=>'Unknown error has occured.','data'=>null,'debug_info'=>null];
                $category_id = clean_numeric_text($category_id);
                $category_id = !empty($category_id)? $category_id : 1;
                $title = explode('.',$_FILES['file']['name']);array_pop($title);
                $title = implode('.', $title);
                $size = 0;
                $dimensions = $this->get_dimensions($source);
                $duration = trim(shell_exec("ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 {$source}"));

                // Insert entry to database.
                if ($id = $this->m_video->add($title,$uid,$dimensions['width'],$dimensions['height'],0,$category_id,$duration))
                {
                    $full_size = $path.'/videos/private/full_size/'.$uid.'.mp4';
                    $preview_size = $path.'/videos/public/480p/'.$uid.'.mp4';
                    $pinkynail = $path.'/videos/public/128/'.$uid.'.jpg';
                    $thumbnail = $path.'/videos/public/256/'.$uid.'.jpg';
                    $poster = $path.'/videos/public/480/'.$uid.'.jpg';
                    $watermark = $path.'/videos/private/watermark/sample.png';
                    
                    $log_file = $path.'/videos/logs/'.$uid.'.log';
                    $log_duration_file = $path.'/videos/logs/'.$uid.'_duration.log';
                    $mid_time = round($duration/2);

                    // Log total duration in seconds.
                    file_put_contents($log_duration_file, $duration);

                    // Input source and watermark.
                    $cmd  = "ffmpeg -y -i {$source} -i {$watermark}";
                    // Output preview video (watermarked 480p).
                    $cmd .= " -c:v libx264 -filter_complex \"overlay=(W-w)/2:(H-h)/2,scale=852:480\" {$preview_size}";
                    // Output pinkynail.
                    $cmd .= " -vframes 1 -ss {$mid_time} -s 228x128 {$pinkynail}";
                    // Output thumbnail.
                    $cmd .= " -vframes 1 -ss {$mid_time} -s 455x256 {$thumbnail}";
                    // Output poster.
                    $cmd .= " -vframes 1 -ss {$mid_time} -s 852x480 {$poster}";
                    // Output fullsize video.
                    $cmd .= " {$full_size} </dev/null 1>/dev/null 2>{$log_file} &";

                    // Start processing...
                    shell_exec($cmd);

                    // Send response.
                    $response['status'] = "ok";
                    $response['message'] = "Converting video now.";
                    $response['data'] = ['id'=>$id,'uid'=>$uid];
                }
                else
                {
                    $response['message'] = "Data insert failed.";
                }

                header("Content-Type: application/json");
                echo json_encode($response);
            }
            else
            {
                $response = ['status'=>'error','code'=>null,'message'=>'Unable to move temp files.','data'=>null,'debug_info'=>null];
                header("Content-Type: application/json");
                echo json_encode($response);
            }
        }
        else
        {
            $response = ['status'=>'error','code'=>null,'message'=>'Server has rejected the file.','data'=>null,'debug_info'=>null];
            header("Content-Type: application/json");
            echo json_encode($response);
        }
    }

    private function get_dimensions($filepath)
    {
        if (file_exists($filepath)) {
            $dimensions = shell_exec("ffprobe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width {$filepath}");
            $dimensions = explode("\n", trim($dimensions));
            return [
                "width" => explode("=", trim($dimensions[0]))[1],
                "height" => explode("=", trim($dimensions[1]))[1]
            ];
        }
        else
        {
            return false;
        }
    }
}