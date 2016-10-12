<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Scheduling</title>
      <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
      <link href="css/bootstrap.min.css" rel="stylesheet">
      <link href="css/style.css" rel="stylesheet">
      <link href="css/bootstrap-select.css" rel="stylesheet">
      <script src="js/jquery.min.js"></script>
      <script src="js/bootstrap.js"></script>
      <script src="js/bootstrap-select.js"></script>
      <script src="js/redips-drag-min.js"></script>
      <script src="js/nla-scripts.js"></script>
   </head>
   <body>
      <nav class="navbar navbar-default navbar-static-top">
         <div class="container-fluid">
            <div class="navbar-header">
               <a class="navbar-brand" href="index.php">NEXT LEVEL ATHLETES</a>
            </div>
            <ul class="nav navbar-nav">
               <li><a href="exercise.php">Exercises</a></li>
               <li class="active"><a href="scheduling.php">Scheduling</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
               <li><a id="day-of-week" style="text-align: center;"></a></li>
            </ul>
         </div>
      </nav>
      <div class="container" id="redips-drag">
         <div class="col-md-6" style="max-height: 70vh;">
            <div class="panel panel-default">
               <div class="panel-heading">
                  <h3 class="panel-title">Create a workout:</h3>
               </div>
               <div class="panel-body">
                  <form class="form-inline" style="padding-bottom: 15px;">
                     <div class="form-group">
                        <label class="control-label" for="lunch">Day:</label>
                     </div>
                     <div class="form-group">
                        <select id="day-choice" data-width="100%" class="selectpicker" title="Select day...">
                           <option>Monday</option>
                           <option>Tuesday</option>
                           <option>Wednesday</option>
                           <option>Thursday</option>
                           <option>Friday</option>
                           <option>Saturday</option>
                           <option>Sunday</option>
                        </select>
                     </div>
                     <div class="form-group">
                        <label class="control-label" for="lunch">Muscle Group:</label>
                     </div>
                     <div class="form-group">
                        <select id="muscle-choice" data-width="100%" class="selectpicker" multiple data-max-options="4" title="Select muscle group..." disabled="true">
                           <option>Abs</option>
                           <option>Back</option>
                           <option>Biceps</option>
                           <option>Chest</option>
                           <option>Legs</option>
                           <option>Shoulders</option>
                           <option>Triceps</option>
                        </select>
                     </div>
                  </form>
                  <div style="max-height:60vh;overflow:auto;">
                     <table class="table table-hover" id="fromExerTable">
                     </table>
                  </div>
               </div>
               <button style="margin: 20px;" type="button" class="btn btn-success" id="reload-button">
               Reload</button>
            </div>
         </div>
         <div class="col-md-6" style="max-height:70vh;">
            <div class="panel panel-default">
               <div class="panel-heading">
                  <h3 class="panel-title">Add exercises to schedule:</h3>
               </div>
               <div class="panel-body" style="height:60vh;overflow:auto;">
                  <table class="table table-hover" id="toExerTable">
                  </table>
               </div>
               <br>
               <button style="margin: 20px;" id="submit-button" type="button" class="btn btn-success"> <span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>
               <button style="margin: 20px;" id="delete-button" type="button" class="btn btn-danger"> <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> </button>
            </div>
         </div>
      </body>
   </html>
