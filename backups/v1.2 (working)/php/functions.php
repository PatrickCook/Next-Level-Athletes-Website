<?php
//ini_set('display_errors', 1);
/*Test if the action being called by the method in scheduling.js
*is corresponding to a method. Then procede to call a method.
*If confused why you did this: http://stackoverflow.com/questions/
*2269307/using-jquery-ajax-to-call-a-php-function
*/
if (isset($_POST['show_userbox'])) {
    echo show_userbox();
}
if (isset($_POST['phpfunc'])) {
  $func = $_POST['phpfunc'];

  switch ($func) {
    case "query_day_info":
      $day = strval($_POST['day'])."List";
      query_day_info($day);
      break;
    case "query_muscle_info":
      $muscles = $_POST['muscles'];
      query_muscle_info($muscles);
      break;
    case "clear_column":
        $day = strval($_POST['day'])."List";
        clear_column($day);
        break;
    case "update_schedule":
        $name = strval($_POST['name']);
        $day = strval($_POST['day'])."List";
        update_schedule($day, $name);
        break;
    default:
      echo "error in switch";
    }
}
function clear_column($day) {
  include 'db_connect.php';

  $query = "DELETE FROM $day";
  $result = mysqli_query($conn, $query);
}
function update_schedule($day, $name) {
  include 'db_connect.php';
  $query = "INSERT INTO $day (exer_name) VALUES ('$name')";
  $result = mysqli_query($conn, $query);

  echo $query;
}

function show_userbox() {
// retrieve the session information
    $u = $_SESSION['username'];
    $uid = $_SESSION['id'];
// display the user box
    echo "<div id='userbox'>
    Welcome $u
    <ul>
        <li><a href='php/logout.php'>Logout</a></li>
    </ul>
</div>";

}
function query_day_info($day) {
    include 'db_connect.php';
    $query = "SELECT * FROM $day;";
    $result = mysqli_query($conn, $query);
    // Check if query returned any
    if (mysqli_num_rows($result) > 0) {
        $types = array();
        while(($row = $result->fetch_assoc())) {
            $types[] = $row['exer_name'];
        }
        echo json_encode($types);
    } else {

    }
    mysqli_close($conn);
}
function query_muscle_info($muscles) {
    include 'db_connect.php';
    $query = "SELECT * FROM exercises WHERE " . $muscles;
    $result = mysqli_query($conn, $query);
    // Check if query returned any
    if (mysqli_num_rows($result) > 0) {
        $types = array();
        while(($row = $result->fetch_assoc())) {
            $types[] = $row['name'];
        }
        echo json_encode($types);
    }
}
?>
