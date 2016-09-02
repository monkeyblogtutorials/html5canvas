<?php

$saveDir = '/var/www/html5canvas/session_test/data/';

if ($handle = opendir($saveDir)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            echo sprintf('<a href="index.php?f=%s">%s</a><br/>', $entry, $entry);
        }
    }
    closedir($handle);
}

echo '<hr>';

function getEntries($array, $prefix = 'SESSION') {
    $result = [];
    foreach($array AS $key => $value) {
        $newPrefix = $prefix.".".$key;
        $type = gettype($value);
        if(in_array($type, ['boolean', 'integer', 'string', 'NULL', 'double', 'float', 'resource', 'unknown type'])) {
            $result[] = $newPrefix . ' = ' . (string) $value;
        }
        if(in_array($type, ['array'])) {
            $result = array_merge($result, getEntries($value, $newPrefix));
        }
        if($type == 'object') {
            $result[] = $newPrefix . ' = ' . str_replace(["\n", "\r", "\n\r", "\r\n", "\t", '  '], "", var_export($value, true));
        }
    }
    return $result;
}

if(isset($_REQUEST['f'])) {
    $content = file_get_contents($saveDir.$_REQUEST['f']);
    $data = unserialize($content);
    $entries = getEntries($data);
    if(isset($_REQUEST['s'])) {
        echo implode('<br/>', array_filter($entries, function ($value) {
            $a = stripos($value, $_REQUEST['s']) === false;
            return !$a;
        }));
    } else {
        echo '<pre>';
        echo '<div style="background-color:black;color:white;">'.__CLASS__.'::'.__FUNCTION__.'('.__LINE__.')</div>';
        print_r($entries);
        exit;
    }
}