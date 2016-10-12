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
          <a class="navbar-brand" href="index.php">NEXT LEVEL ATHLETES</a>
        </div>
        <ul class="nav navbar-nav">
          <li class="active"><a href="exercise.php">Exercises</a></li>
          <li><a href="scheduling.php">Scheduling</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li><a id="day-of-week" style="text-align: center;"></a></li>
          <li><button id="decDayBut" type="button" class="btn btn-center "> <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> </button> </li>
          <li><button id="incDayBut" type="button" class="btn btn-center "> <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> </button> </li>
        </ul>
      </div>
    </nav>
    <div class="row">
      <div id="table-container" class="col-md-3" style="padding-left: 30px;">
        <div style="height:75vh;overflow:auto;">
          <table class="table table-hover" id="day-table">
          <tbody id="day-table-body"> </tbody>
        </table>
        <div id="error-section"> </div>
      </div>

    </div>
    <div id="info-container" class="col-md-5" style="width: 50vw;">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" id="title">
          <small id="subtitle" class="text-muted"></small>
          </h3>
        </div>
        <div class="panel-body">
          <div id="info-section">
            <script>
            /* Light YouTube Embeds by @labnol */
            /* Web: http://labnol.org/?p=27941 */
            document.addEventListener("DOMContentLoaded",
              function() {
                var div, n,
                v = document.getElementsByClassName("youtube-player");
                for (n = 0; n < v.length; n++) {
                  div = document.createElement("div");
                  div.setAttribute("data-id", v[n].dataset.id);
                  div.innerHTML = labnolThumb(v[n].dataset.id);
                  div.onclick = labnolIframe;
                  v[n].appendChild(div);
                }
              });
            function labnolThumb(id) {
              console.log(id)
              var thumb = "<img src=\"https:\/\/i.ytimg.com/vi/ID/hqdefault.jpg\"><noscript><img src=\"https:\/\/i.ytimg.com/vi/ID/hqdefault.jpg\"></noscript>";
              var play = '<div class="play"></div>';
              return thumb.replace("ID", id.substring(0,id.length-1)) + play;
            }
            function labnolIframe() {
              var iframe = document.createElement("iframe");
              iframe.setAttribute("src", "https://www.youtube.com/embed/" + this.dataset.id + "?autoplay=1");
              iframe.setAttribute("frameborder", "0");
              iframe.setAttribute("allowfullscreen", "1");
              this.parentNode.replaceChild(iframe, this);
            }
            </script>
            <hr>
            <div></div>
            <div id="info-explanation"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
