<?php
// Database settings
// database hostname or IP. default:localhost
// localhost will be correct for 99% of times
define("HOST", "nla-db-instance.cghqcivjv6pz.us-west-2.rds.amazonaws.com:3306");
// Database user
define("DBUSER", "pcook01");
// Database password
define("PASS", "Gibson1957");
// Database name
define("DB", "nla_db");
 
############## Make the mysql connection ###########
$conn = mysqli_connect(HOST, DBUSER, PASS, DB);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
$db = mysqli_select_db($conn, DB);
if (!$db)
{
    // cannot connect to the database so quit the script
    die('Could not connect to database!<br />Please contact the site\'s administrator.');
}
?>