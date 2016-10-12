//AUTHOR: PATRICK COOK 2016
var db;
var SCHEDULE_TABLE_SIZE = 15;
var d, currentDay;
// define redipsInit variable
var redipsInit;
var curMuscleRequest;
"use strict";
/********************************************/
/* DRAGGABLE TABLE ROWS */
/********************************************/
// redips initialization
redipsInit = function() {
  // reference to the REDIPS.drag lib
  var rd = REDIPS.drag;
  // initialization

  // dragged elements can be placed to the empty cells only
  rd.dropMode = 'single';

  // elements could be cloned with pressed SHIFT key
  rd.clone.keyDiv = true;
  // define dropped handler
  rd.event.dropped = function(targetCell) {
    var tbl, // table reference of dropped element
    id, // id of scrollable container
    msg; // message
    // find table of target cell
    tbl = rd.findParent('TABLE', targetCell);
    // test if table belongs to scrollable container
    if (tbl.sca !== undefined) {
      // every table has defined scrollable container (if table belongs to scrollable container)
      // scrollable container has reference to the DIV container and DIV container has Id :)
      id = tbl.sca.div.id;
      // prepare message according to container Id
      // here can be called handler_dropped for scrollable containers
      switch (id) {
        case 'left':
        msg = 'Left container';
        break;
        case 'right':
        msg = 'Right container';
        break;
        default:
        msg = 'Container without Id';
      }
    }
    // table does not belong to any container
    else {
      msg = 'Table does not belong to any container!';
    }
    // display message
  };
};


// add onload event listener
if (window.addEventListener) {
  window.addEventListener('load', redipsInit, false);
} else if (window.attachEvent) {
  window.attachEvent('onload', redipsInit);
}
/********************************************/
/* JQUERY, DOCUMENT READY */
/********************************************/

$(document).ready(function() {
  /* Date Stuff */
  d = new Date();
  currentDay = d.getDay();
  init_table_from_db($('#day-table'), toStringDate(currentDay).toLowerCase(), "query_day_info");
  /* Day buttons on Exercise.php page */
  $('#incDayBut').on('click',function() {
    currentDay++;
    wrap_around_day();
    init_table_from_db($('#day-table'), toStringDate(currentDay).toLowerCase(), "query_day_info");
  });
  $('#decDayBut').on('click',function() {
    currentDay--;
    wrap_around_day();
    init_table_from_db($('#day-table'), toStringDate(currentDay).toLowerCase(),"query_day_info");
  });
  /* Scheduling page buttons */
  $("#day-choice").on('change', function() {
    $('#muscle-choice').prop('disabled', false);
    $('#muscle-choice').selectpicker('refresh');
    init_drag_table_from_db($('#toExerTable'), $(this).val().toLowerCase(), SCHEDULE_TABLE_SIZE, "query_day_info");
    REDIPS.drag.init();
  });
  $('#muscle-choice').on('change', function() {
    init_muscles_from_db($('#fromExerTable'), $(this).val(), "query_muscle_info");
    REDIPS.drag.init();
  });
  $('#reload-button').on('click', function() {
    init_muscles_from_db($('#fromExerTable'), $(this).val(), "query_muscle_info");
    REDIPS.drag.init();
  });
  $('#submit-button').on('click', function() {
    save_to_db();
    alert("Schedule for " + $("#day-choice").val() + " has been saved.");
  });
});
/********************************************/
/* DATABASE MANAGEMENT BACKEND */
/********************************************/

function init_muscles_from_db(table, muscles, func) {
  // initialization of array to be size SCHEDULE_TABLE_SIZE
  var exercises = [];
  var query = "";
  for (var add = 0; add < muscles.length; add++) {
    /* Skip first and last entry */
    if (add > 0 && add < muscles.length) {
      query += " OR ";
    }
    query += "body_part='" + muscles[add].toLowerCase() + "'";
  }
  /*Getting info from database for table update */
  // Update day shown
  $.ajax({
    url: '../php/functions.php',
    async: false,
    // This calles the show_sidebar() method in the functions.php file
    // The 1 is passed just to check if something is set
    data: {phpfunc: func, muscles: query},
    type:"POST",
    success:function(muscResponse){
      console.log(muscResponse);
      exercises = muscResponse;
    },
    dataType:"json"
  });
  /*
  * Check if object returned from query is valid
  * If valid, schedule for that day is loaded into a table
  */
  if (isValid(exercises)) {
    var heading = new Array("Exercise");
    console.log(exercises);
    createDragTable(exercises, table, heading);
  }
}
/*
* Called everytime the day is changed by user
* Responsible for querying database, loading table,
* clearing html elements and error checking
*/
function init_table_from_db(table, day, func) {
  var exercises = [];
  // Update day shown
  $("#day-of-week").html(toStringDate(currentDay));
  $.ajax({
    url: '../php/functions.php',
    async: false,
    // This calles the show_sidebar() method in the functions.php file
    // The 1 is passed just to check if something is set
    data: {phpfunc: func, day: day},
    type:"POST",
    success:function(response){
        exercises = response;
    },
    dataType:"json"
  });
  /*
  * Check if object returned from query is valid
  * If valid, schedule for that day is loaded into a table
  */
  if (isValid(exercises)) {

    /* Setting up arrays and functions for building the table */
    var heading = new Array("Exercise");
    var onmouseover = function(e) {}//updateInfoPane($(this).find('td').text());}
    createTable(exercises, table, heading, onmouseover);
    $("#error-section").html("");
    //update info pane with first exercise returned
    //updateInfoPane(exercises);
    /* Query returned an invalid object. Schedule has not been created.
    * Clear html elements and show user error msg
    */
  } else {
    var error = "Your trainer has not created an exercise schedule for today yet."
    $("#error-section").html(error);
    $("#day-table").html("");


  }
}
/*
* Called everytime the day is selected by user
* Responsible for querying database, loading table
*/
function init_drag_table_from_db(table, day, tableSize, func) {
  // initialization of array to be size SCHEDULE_TABLE_SIZE
  var exercises = [];
  while(tableSize--) exercises.push("");
  //Request data from DATABASE
  $.ajax({
    url: '../php/functions.php',
    async: false,
    // This calles the show_sidebar() method in the functions.php file
    // The 1 is passed just to check if something is set
    data: {phpfunc: func, day: day},
    type:"POST",
    success:function(response){
      //Check if query response is valid info
      if (isValid(response)) {
        //copy values returns from query into array.
        for (idx = 0; idx < response.length; idx++)
          exercises[idx] = response[idx];
      } else {
        console.log("Day schedule empty.");
      }
    },
    dataType:"json"
  });
  /*
  * Check if object returned from query is valid
  * If valid, schedule for that day is loaded into a table
  */
  var heading = new Array("Exercise");
  console.log(exercises);
  createDragTable(exercises, table, heading);
}

/* Updates the right pane to show users info about specific exercise
*  This is called everytime :hover is actived on '#day-table'
*/
function save_to_db() {
  $('#toExerTable tr').each(function() {
    $(this).find('td').each(function() {
      var name = $(this).find('.redips-drag').text();
      var day = $('#day-choice').val().toLowerCase();
      //Send info to server
      if (day == "" || name == "") {
        console.log("updateSchedule: error with day.");
        return;
      } else {
        $.ajax({
          url: '../php/update.php',
          async: false,
          data: {name: name, day: day},
          type:"POST",
          success: function(msg) {
          }

        });
      }
    });
  });
}

/**********************************************/
/* TABLE DATA POPULATION AND DATABASE REQUESTS*/
/**********************************************/

/* Take in array of info, table id, a top header array and function
* that each row should call when :hover is enabled
*/
function createTable(queryInfo, table, headerArray, onmouseover) {
  table.empty();
  var tableBody = document.createElement('TBODY')
  var header = headerArray;
  //TABLE COLUMNS
  var tr = document.createElement('TR');
  tableBody.appendChild(tr);
  for (var col = 0; col < header.length; col++) {
    var th = document.createElement('TH')
    th.appendChild(document.createTextNode(header[col]));
    tr.appendChild(th);
  }
  //Create Rows
  for (var row = 0; row < queryInfo.length; row++) {
    var tr = document.createElement('TR');
    tr.onmouseover = onmouseover;
    var td = document.createElement('TD')
    var div = document.createElement('DIV')
    td.appendChild(document.createTextNode(queryInfo[row]));
    tr.appendChild(td)
    tableBody.appendChild(tr);
  }
  table.append(tableBody);

}
function createDragTable(queryInfo, table, header, onmouseover) {
  table.empty();
  var tableBody = document.createElement('TBODY');
  var tr = document.createElement('TR');
  //TABLE COLUMNS
  tableBody.appendChild(tr);
  for (var col = 0; col < header.length; col++) {
    var th = document.createElement('TH')
    th.innerHTML = header[col];
    tr.appendChild(th);
  }
  //ROWS
  for (var row = 0; row < queryInfo.length; row++) {
    var tr = document.createElement('TR');
    var td = document.createElement('TD');
    var div = document.createElement('DIV');
    tr.className = "rl";
    //Only add DRAGGABLE row if it contains information
    if (queryInfo[row] != "") {
      div.innerHTML = queryInfo[row];
      div.className = "redips-drag darkRed";
      td.appendChild(div);
    }
    tr.appendChild(td);
    tableBody.appendChild(tr);
  }
  table.html(tableBody);
}
function updateInfoPane (exer_name) {
  var titleDiv = $('#title');
  var subInfo = $('#subtitle');
  var descripDiv = $('#info-explanation');
  /* CONNECT TO DATABASE */
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'TrackerPro.db', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    var uInt8Array = new Uint8Array(this.response);
    db = new SQL.Database(uInt8Array);
    var req = "SELECT name, sets, reps, link, description FROM exercises WHERE name='" + exer_name +"'";
    var exercises = db.exec(req);
    if (isValid(exercises)) {
      var exer = exercises[0].values;
      /* Setting title and description */
      $('#title').html("<h3>" + exer[0][0] + " <small class=\"text-muted\"> Sets: " + exer[0][1] + " Reps: " + exer[0][2] + "</small></h3>");
      $('#info-explanation').html("<p><strong>Steps: </strong>" + exer[0][4] + "</p>");
      /* Creating Video and Setting URL*/
      var vidHTML = "<div class=\"youtube-player\" data-id=" + exer[0][3] + "\"></div>";
      $('#info-section').find('div:first').remove();
      $('#info-section').prepend(vidHTML);
      var div, n, v = document.getElementsByClassName("youtube-player");
      for (n = 0; n < v.length; n++) {
        div = document.createElement("div");
        div.setAttribute("data-id", v[n].dataset.id);
        div.innerHTML = labnolThumb(v[n].dataset.id);
        div.onclick = labnolIframe;
        v[n].appendChild(div);
      }
      //Handle error if exercise cannot be found
    } else {
      console.error("Couldnt find exercise with name: " + exer_name);
    }
  };
  xhr.send();
}
function updateExerciseResults(muscles) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'TrackerPro.db', true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function(e) {
    var uInt8Array = new Uint8Array(this.response);
    db = new SQL.Database(uInt8Array);
    /*ERROR HANDLING */
    if (isValid(muscles)) {
      curMuscleRequest = muscles;
    } else {
      console.log("User did not select muscle type");
      return;

    }
    /*Getting info from database for table update */
    var req = "SELECT name FROM exercises WHERE ";
    for (var add = 0; add < muscles.length; add++) {
      /* Skip first and last entry */
      if (add > 0 && add < muscles.length) {
        req += " OR ";
      }
      req += "body_part='" + muscles[add].toLowerCase() + "'";
    }
    var exercises = db.exec(req);
    if (exercises.length == 0) {
      console.debug("0 rows returned from:" + req);
      return;
    }
    exercises = exercises[0].values;
    var heading = new Array("Exercise");
    updateDragTable(exercises, "fromExerTable", heading);
    REDIPS.drag.init();
  };
  xhr.send();
}
/**********************************************/
/*               HELPER SCRIPTS                 */
/**********************************************/
//Checks if an array is valid and has information
function isValid(array) {
  return array != null && typeof array !== 'undefined' && array.length > 0;
}
/**********************************************/
/*               DATE SCRIPTS                 */
/**********************************************/
function dayToListId(day) {
  return day.toLowerCase() + "List";
}
function wrap_around_day() {
  if (currentDay < 0) currentDay = 6;
  if (currentDay > 6) currentDay = 0;
}
function toStringDate(day) {
  var weekday = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
  return weekday[day];
}
