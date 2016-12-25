<?php
// Start a session
session_start();
require_once ("php/db_connect.php");
require_once ("php/functions.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Welcome to NLA</title>
	<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/style.css" rel="stylesheet">
	<script src="js/jquery.min.js"></script>
	<script src="js/bootstrap.js"></script>
</head>
<body id="index-body">
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
			<?php
			if (isset($_SESSION['id']) && isset($_SESSION['username'])) {
				echo '<div class="collapse navbar-collapse" id="navbar-collapse">
					<ul class="nav navbar-nav">
						<li><a href="exercise.php">Exercises</a></li>
						<li><a href="scheduling.php">Scheduling</a></li>
					</ul>
			 </div>';
			}
			?>

		</div>
	</nav>
	<div class="container">
		<div class="row row-centered">
			<div class="col-sm-6 col-centered login-centered">
				<div id="guest">
					<div>
						<h2>Welcome to the NLA Workout Helper</h2>

						</div>
						<?php
						include "php/login.php";
						?>
					</div>
				</div>
			</div>
		</div>

	</body>
	</html>
