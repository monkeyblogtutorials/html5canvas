<?php

session_start();

echo '<a href="index.php">index.php</a><br/>';

echo session_save_path();

echo '<pre>';
echo '<div style="background-color:black;color:white;">'.__CLASS__.'::'.__FUNCTION__.'('.__LINE__.')</div>';
print_r($_SESSION);
exit;

