<?php

// temp dir
$tmpDir = sys_get_temp_dir();

// check we're on master
$out = [];
exec('git status', $out);
$suffix = 'branch master';
if(!isset($out[0]) || substr($out[0], -strlen($suffix)) != $suffix) {
    exit('Error: not on ' . $suffix . "\n");
}
echo "Check on branch master: ok\n";

// check there are no changes
$prefix = 'nothing to commit';
if(!isset($out[2]) || substr($out[2], 0, strlen($prefix)) != $prefix) {
    //exit("Error: there seem to be changes that are not committed. Clean-up the workspace first.\n");
}
echo "Check no uncommitted changes: ok\n";

// copy files to tmp so we can access them when checking out other branches
$out = [];
exec(sprintf('cp server.js %d', $tmpDir), $out);
exec(sprintf('cp template.html %d', $tmpDir), $out);

// get list of all (remote) branches
echo "Fetching remote branch-names...\n";
$out = [];
exec('git ls-remote', $out);
foreach($out AS $line) {
    if(preg_match('/refs\/heads\/(.?tutorial.?)$/i', $line, $matches)) {

        $output = [];
        $branch = $matches[1];
        echo "Checkout " . $branch . "...\n";
        exec(sprintf('git checkout %s', $branch)); // checkout branch
        exec('git pull'); // pull latest changes
        exec(sprintf('node %d', implode(DIRECTORY_SEPARATOR, [$tmpDir, 'server.js'])), $output);
        foreach($output AS $msg) {
            echo $msg . "\n";
        }

    }
}
exec('git checkout master');
echo 'script.php: FINISHED.';



