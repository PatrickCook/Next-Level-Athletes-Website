<?php
ini_set('display_errors', 1);
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
    case "query_exer_info":
        $name = strval($_POST['name']);
        query_exer_info($name);
        break;
    case "clear_column":
        $day = strval($_POST['day'])."List";
        clear_column($day);
        break;
    case "update_schedule":
        $name = strval($_POST['name']);
        $day = strval($_POST['day'])."List";
        $sets = strval($_POST['sets']);
        $reps = strval($_POST['reps']);
        update_schedule($day, $name, $sets, $reps);
        break;
    default:
      echo "error in switch";
    }
}
function clear_column($day) {
  include 'db_connect.php';

  $query = "DELETE FROM $day";
  $result = mysqli_query($conn, $query);
  echo "Success clearing column for $day.";
}
function update_schedule($day, $name, $sets, $reps) {
  include 'db_connect.php';

  $query = "INSERT INTO $day (exer_name) VALUES ('$name')";
  $result = mysqli_query($conn, $query);

  $query = "UPDATE exercises SET sets='$sets', reps='$reps' WHERE name='$name'";
  $result = mysqli_query($conn, $query);
  echo $query;
}

function show_userbox() {
// retrieve the session information
    $u = $_SESSION['username'];
    $uid = $_SESSION['id'];
// display the user box
    echo "<div style='text-align:left;' id='userbox'>
    Welcome $u, head over to the exercises page to view your daily workout or schedule a workout!<br><br>
    </div>
    <button class='btn login-but'><a href='php/logout.php'>Logout</a></button>";

}
function query_day_info($day) {
    include 'db_connect.php';
    $query = "SELECT * FROM $day;";
    $result = mysqli_query($conn, $query);
    // Check if query returned any
    if (mysqli_num_rows($result) > 0) {
        $types = array();
        while(($row = $result->fetch_assoc())) {
            $name = $row['exer_name'];
            $query = "SELECT sets, reps FROM exercises WHERE name='$name';";
            $result2 = mysqli_query($conn, $query);
            $row2 = $result2->fetch_assoc();
            // Check if query returned any
            if (mysqli_num_rows($result2) > 0) {
                $types[] = array($name, $row2['sets'], $row2['reps']);
            }
        }
        echo json_encode($types);
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

function query_exer_info($exer_name) {
  include 'db_connect.php';
  $query = "SELECT name, sets, reps, video_id, body_part FROM exercises WHERE name='$exer_name'";
  $result = mysqli_query($conn, $query);

  if (mysqli_num_rows($result) > 0) {
      $row = $result->fetch_assoc();
      $name = $row['name'];
      $sets = $row['sets'];
      $reps = $row['reps'];
      $body = $row['body_part'];
      $vid_id = $row['video_id'];
      echo "<div class='panel-heading'>
              <h2 id='title'> $name
              <small id='subtitle' class='text-muted'>$body</small>
              </h2>
            </div>
            <div class='panel-body'>
              <div id='info-section'>
              <video width='100%' height='100%' preload='none' poster='../videos/${vid_id}_thumb.jpg' controls>
                <source src='../videos/$vid_id.mp4'  type='video/mp4'>
                Your browser does not support the video tag.
              </video>
              </div>
            </div>";

    }
//<div class='youtube-player' data-id='$vid_id'></div>
  }
  /*

?>
