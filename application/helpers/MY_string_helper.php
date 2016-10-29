<?php

function js_string($subject)
{
    $pattern = ['/[\t\r\n]/','/\s+/','/"/','/<\//'];
    $replace = ['',' ','\"','<\/'];
    return preg_replace($pattern, $replace, $subject);
}

function clean_whitespace($subject)
{
    $pattern = ['/[\t\r\n]/','/\s+/'];
    $replace = ['',' '];
    return preg_replace($pattern, $replace, $subject);
}

function clean_numeric_text($subject)
{
    $pattern = '/[^0-9]/';
    $replace = '';
    return preg_replace($pattern, $replace, $subject);
}

function clean_float_text($subject)
{
    $pattern = '/[^0-9\.]/';
    $replace = '';
    return preg_replace($pattern, $replace, $subject);
}

function clean_alpha_text($subject)
{
    $pattern = '/[^a-zA-Z]/';
    $replace = '';
    return preg_replace($pattern, $replace, $subject);
}

function clean_title_text($subject)
{
    $pattern = '/[^a-zA-Z0-9 \-_]/';
    $replace = '';
    return preg_replace($pattern, $replace, $subject);
}

function clean_body_text($subject)
{
    $pattern = '/[^a-zA-Z0-9 \.\-_]/';
    $replace = '';
    return preg_replace($pattern, $replace, $subject);
}