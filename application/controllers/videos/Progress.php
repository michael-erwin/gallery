<?php
/**
* Track conversion progress.
*/
class Progress extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->config->load('media_gallery');
        $this->media_path = $this->config->item('mg_media_path');
    }

    public function _remap($uid=null)
    {
        if ($uid)
        {
            $this->progress($uid);
        }
    }

    private function progress($uid=null)
    {
        $errors = 0;
        $response = [
            'status' => 'error',
            'message' => 'Unknown error has occured.',
            'data' => [
                'progress' => 0,
                'complete' => false
            ]
        ];
        $stat_file = $this->media_path.'/videos/logs/'.$uid.'.log';
        $time_file = $this->media_path.'/videos/logs/'.$uid.'_duration.log';

        if(!$uid)
        {
            $errors++;
            $response['message'] = 'Log id is missing. ';
        }
        if(!file_exists($stat_file))
        {
            $errors++;
            $response['message'] .= 'Log file is missing. ';
        }
        elseif(!file_exists($time_file))
        {
            $errors++;
            $response['message'] .= 'Time file is missing. ';
        }
        if($errors === 0)
        {
            $stat_log = file_get_contents($stat_file);
            $time_log = trim(file_get_contents($time_file));
            preg_match_all('/B time=([0-9]{2}:[0-9]{2}:[0-9]{2}\.?[0-9]*) /', $stat_log, $matches);
            $time_now = trim(end($matches[1]));
            
            if(strlen($time_now) > 7)
            {
                $progress = floor(($this->hms_to_seconds($time_now)/$time_log)*100);
            }
            else
            {
                $progress = 0;
            }
            
            $response['status'] = 'ok';
            if(preg_match('/global headers:/',$stat_log))
            {
                $response['message'] = 'Conversion completed.';
                $response['data']['complete'] = true;
                $response['data']['progress'] = 100;
            }
            else
            {
                $response['message'] = 'Conversion in progress.';
                $response['data']['progress'] = $progress;
            }
        }
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    private function hms_to_seconds($hms)
    {
        list($HH, $MM, $SS) = explode(':', $hms);
        return ($HH*3600)+($MM*60)+$SS;
    }
}