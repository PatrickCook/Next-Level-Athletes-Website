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
      <script src="js/nla-scripts.js"></script>
      <script src="js/bootstrap-select.js"></script>
      <script src="js/redips-drag-min.js"></script>

   </head>
   <body>
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
                 <li><a href="exercise.php">Exercises</a></li>
                 <li class="active"><a href="scheduling.php">Scheduling</a></li>
              </ul>
              <ul class="nav navbar-nav navbar-right">
                 <li><a id="day-of-week" style="text-align: center;"></a></li>
              </ul>
           </div>
         </div>
      </nav>
      <div class="container" id="redips-drag">
         <div class="col-sm-6">
            <div class="panel panel-default">
               <div class="panel-heading">
                  <h3 class="panel-title">Create a workout:</h3>
               </div>
               <div class="panel-body">
                  <form class="form-inline" style="padding-bottom: 15px;">
                     <div class="form-group">
                        <label class="control-label" for="lunch">Day:</label>
                     </div>
                     <div style="padding-left:4.7em;"class="form-group">
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
                     <br>
                     <div class="form-group">
                        <label class="control-label" for="lunch">Muscle Group:&nbsp</label>
                     </div>
                     <div class="form-group">
                        <select id="muscle-choice" data-width="100%" class="selectpicker" multiple data-max-options="2" title="Select muscle group..." disabled="true">
                           <option>Abs</option>
                           <option>Back</option>
                           <option>Biceps</option>
                           <option>Cardio</option>
                           <option>Chest</option>
                           <option>Legs</option>
                           <option>Shoulders</option>
                           <option>Triceps</option>
                           <option>Traps</option>
                        </select>
                     </div>
                     <small>(can select more than 1)</small>
                  </form>
                  <div class='table-responsive' id='leftTable'>
                     <table class="table table-hover" id="fromExerTable">
                     </table>
                  </div>
               </div>
               <button style="margin: 20px;" type="button" class="btn btn-success" id="reload-button">
               Reload</button>
            </div>
         </div>
         <div class="col-sm-6">
            <div class="panel panel-default">
               <div class="panel-heading">
                  <h3 class="panel-title">Add exercises to schedule:</h3>
               </div>
               <div id='rightTable' class="panel-body">
                  <table class="table table-hover" id="toExerTable">
                  </table>
               </div>
               <br>
               <button style="margin: 10px;" id="submit-button" type="button" class="btn btn-success"> <span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>
               <button style="margin: 10px;" id="delete-button" type="button" class="btn btn-danger"> <span class="glyphicon glyphicon-remove" disabled="true" aria-hidden="true"></span> </button>
            </div>
         </div>
      </body>
   </html>
