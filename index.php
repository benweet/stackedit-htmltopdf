<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
   2 => array("file", "/dev/null", "w") // stderr is a file to write to
);

$process = proc_open('./wkhtmltopdf-lin-amd -L 25 -R 25 -T 25 -B 25 --header-html blank.html --header-spacing 5 --footer-html blank.html --footer-spacing 5 --javascript-delay 2000 - -', $descriptorspec, $pipes);

if (is_resource($process)) {
    $input = fopen('php://input', 'r');
    while (!feof($input)) {
        fwrite($pipes[0], fread($input, 8192));
    }

    fclose($pipes[0]);
    echo stream_get_contents($pipes[1]);
    fclose($pipes[1]);
    
    $return_value = proc_close($process);

}
}

