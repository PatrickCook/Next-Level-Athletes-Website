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
  <script src="js/nla-scripts.js"></script>
  <script src="js/bootstrap.js"></script>
  <script src="js/jquery-ui.js"></script>
  <script src="js/redips-drag-min.js"></script>
</head>
<body id="exercise-body">
  <nav class="navbar navbar-default navbar-static-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="index.php">NEXT LEVEL ATHLETES</a>
      </div>
      <div class="collapse navbar-collapse" id="navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="active"><a href="exercise.php">Exercises</a></li>
          <li><a href="scheduling.php">Scheduling</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li>
              <span id="day-of-week" class="center-in-navbar"></span>
              <span id="decDayBut" class="center-in-navbar glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
              <span id="incDayBut" class="center-in-navbar glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="row row-fluid">
    <div id="table-container" class="col-sm-4">
      <table class="table table-hover" id="day-table">
        <tbody id="day-table-body"> </tbody>
      </table>
      <div id="error-section"> </div>
    </div>
    <div class="col-sm-6">
      <div id="info-container" class="panel panel-default">

      </div>
    </div>
  </div>
</body>
</html>
