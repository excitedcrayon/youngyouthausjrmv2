<?php 
    header("Access-Control-Allow-Origin: https://youngyouth.jrmorg.com");
    header('Content-Type','application/json');
    $lessons = $_SERVER['DOCUMENT_ROOT'] . '/lessons/';
    $fileList = array_slice(scandir($lessons), 2);

    sort($fileList);

    echo json_encode($fileList); 
?>