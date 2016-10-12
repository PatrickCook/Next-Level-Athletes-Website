<?php
ini_set('display_errors', 1);
include 'db_connect.php';

// GET info for database update
$name = strval($_POST['name']);
$day = strval($_POST['day'])."List";
// Search for exercise

$query = "INSERT INTO $day (exer_name) VALUES ('$name')";

$result = mysqli_query($conn, $query);
echo $query;
?>