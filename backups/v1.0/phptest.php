<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Weekly Excercises</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
  </head>
  <body id="exercise-body">
  <?php
    ini_set('display_errors',1);
    ini_set('display_startup_errors',1);
    error_reporting(E_ALL);
    include "../inc/dbinfo.inc";
    /* Connect to MySQL and select the database. */
    $connection = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD);
    if (mysqli_connect_errno()) 
      echo "Failed to connect to MySQL: " . mysqli_connect_error();
      $database = mysqli_select_db($connection, DB_DATABASE);
  }

  ?>
  <!-- Display table data. -->
  <table class="table table-hover" id="day-table">
    <tbody id="day-table-body">
      <?php
      $result = mysqli_query($connection, "INSERT INTO `admin` DEFAULT VALUES;");
      $result = mysqli_query($connection, 'CREATE TABLE "admin" (
      `id` INTEGER 1,
      `username` TEXT "admin",
      `password` TEXT "password"');
      $result = mysqli_query($connection, "SELECT * FROM admin");
      while($query_data = mysqli_fetch_row($result)) {
      echo "<tr>";
        echo "<td>",$query_data[0], "</td>",
        "<td>",$query_data[1], "</td>",
        "<td>",$query_data[2], "</td>";
      echo "</tr>";
      }
      ?>
    </tbody>
  </table>
  <!-- Clean up. -->
  <?php
  mysqli_free_result($result);
  mysqli_close($connection);
  /* Check for the existence of a table. */
  function TableExists($tableName, $connection, $dbName) {
    $t = mysqli_real_escape_string($connection, $tableName);
    $d = mysqli_real_escape_string($connection, $dbName);
    $checktable = mysqli_query($connection,
    "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_NAME = '$t' AND TABLE_SCHEMA = '$d'");
    if(mysqli_num_rows($checktable) > 0) 
      return true;
    return false;
  }
  ?>
  </body>
</html>