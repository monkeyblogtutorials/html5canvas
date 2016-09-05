<?php

$saveDir = '/var/www/sessiondata/';

$allParams = $_GET;

if ($handle = opendir($saveDir)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            $allParams['f'] = $entry;
            echo sprintf('<a href="index.php?%s">%s</a><br/>', http_build_query($allParams), $entry);
        }
    }
    closedir($handle);
}

echo '<hr>';

function _forceReadableObject($o, $castTo = 'stdClass')
{
    if(!is_object($o) && gettype($o) == 'object') { // = detect `__PHP_Incomplete_Class`

        $serialized = serialize($o);
        $casted = preg_replace('/^O:\d+:"[^"]++"/', 'O:' . strlen($castTo) . ':"'.$castTo.'"', $serialized);
        return unserialize($casted);
    }
    return $o;
}

function getEntries($array, $prefix = 'SESSION') {
    $result = [];
    foreach($array AS $key => $value) {
        $newPrefix = $prefix.".".$key;
        $type = gettype($value);
        if(in_array($type, ['boolean', 'integer', 'string', 'NULL', 'double', 'float', 'resource', 'unknown type'])) {
            $result[] = $newPrefix . ' = ' . gettype($value) . '; ' . $value;
        }
        if(in_array($type, ['array'])) {
            $result = array_merge($result, getEntries($value, $newPrefix));
        }
        if($type == 'object') {
            $stdObject = _forceReadableObject($value);
            $objectAsArray = get_object_vars($stdObject);
            $result = array_merge($result, getEntries($objectAsArray, $newPrefix.'[OBJECT]'));
        }
    }
    return $result;
}

if(isset($_REQUEST['f'])) {
    $content = file_get_contents($saveDir.$_REQUEST['f']);
    $data = unserialize($content);
    $entries = getEntries($data);
    if(isset($_REQUEST['s'])) {
        $searches = explode("|", $_REQUEST['s']);
        echo implode('<br/>', array_filter($entries, function ($value) use ($searches) {
            foreach($searches AS $search) {
                $a = stripos($value, $search) === false;
                if(!$a) {
                    return true;
                }
            }
            return false;
        }));
    } else {
        echo implode("<br/>", $entries);
        exit;
    }
}