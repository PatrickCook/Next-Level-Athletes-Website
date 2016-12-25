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
      case "query_schedule":
        $day = strval($_POST['day'])."List";
        query_schedule($day);
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
        $data = json_decode($_POST['schedule']);
        $day = strval($_POST['day'])."List";
        update_schedule($day, $data);
        break;
    default:
      echo "error in switch";
    }
}

// clears the exerises on that day
function clear_column($day) {
  include 'db_connect.php';

  $query = "DELETE FROM $day";
  $result = mysqli_query($conn, $query);
  echo "Success clearing column for $day.";
}
//Add new exercise to the day
function update_schedule($day, $data) {
  include 'db_connect.php';
  echo $data;
  //$query = "INSERT INTO $day (ExerciseName, Sets, Reps) VALUES ($data)";
  //$result = mysqli_query($conn, $query);

//  echo $query;

}

function show_userbox() {
// retrieve the session information
    $u = $_SESSION['username'];
    $uid = $_SESSION['id'];
// display the user box
    echo "<div style='text-align:left;' id='userbox'>
    Welcome <strong>$u<strong>, head over to the ExerciseList page to view your daily workout or schedule a workout!<br><br>
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
            $types[] = array($row['ExerciseName'], $row['Sets'], $row['Reps']);
        }
        echo json_encode($types);
    }
    mysqli_close($conn);
}
function query_schedule($day) {
    include 'db_connect.php';

    $query = "SELECT ExerciseList.`ExerciseName`, {$day}.`Sets`, {$day}.`Reps`
              FROM $day LEFT JOIN ExerciseList ON ExerciseList.`ExerciseID` = {$day}.`ExerciseID`;";
    $result = mysqli_query($conn, $query);
    // Check if query returned any
    if (mysqli_num_rows($result) > 0) {
        $types = array();
        while(($row = $result->fetch_assoc())) {
            // Check if query returned any
            $types[] = array($row['ExerciseName'], $row['Sets'], $row['Reps']);
        }
        echo json_encode($types);
    }
    mysqli_close($conn);
}
function query_muscle_info($muscles) {
  include 'db_connect.php';

  $query = "SELECT `ExerciseName` FROM ExerciseList WHERE $muscles";

  $result = mysqli_query($conn, $query);
  // Check if query returned any
  if (mysqli_num_rows($result) > 0) {
      $types = array();
      while(($row = $result->fetch_assoc())) {
          // Check if query returned any
          $types[] = array($row['ExerciseName'], 4, 10);
      }
      echo json_encode($types);
  }
  mysqli_close($conn);
}

function query_exer_info($ExerciseName) {
  include 'db_connect.php';
  $query = "SELECT ExerciseID, ExerciseName, ExerciseMuscle FROM ExerciseList WHERE name='$ExerciseName'";
  $result = mysqli_query($conn, $query);

  if (mysqli_num_rows($result) > 0) {
      $row = $result->fetch_assoc();
      $name = $row['ExerciseName'];
      $body = $row['ExerciseMuscle'];
      $vid_id = $row['ExerciseID'];
      $vid_path = "../videos/$vid_id.mp4";
      //Check if video ID is set
      if (!file_exists($vid_path))
        $vid_id = "default";

      echo "<div class='panel-heading'>
              <h2 id='title'> $name
              <small id='subtitle' class='text-muted'>$body</small>
              </h2>
            </div>
            <div class='panel-body'>
              <div id='info-section'>
              <video width='100%' height='100%' preload='none' poster='../thumbnails/${vid_id}_thumb.jpg' controls>
                <source src='../videos/$vid_id.mp4'  type='video/mp4'>
                Your browser does not support the video tag.
              </video>
              </div>
            </div>";

    }
  }
?>
