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
function initDrag() {
  // reference to the REDIPS.drag lib
  var rd = REDIPS.drag;
  // initialization
  rd.init();
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


/********************************************/
/* JQUERY, DOCUMENT READY */
/********************************************/

$(document).ready(function() {
  /* Date Stuff */
  d = new Date();
  currentDay = d.getDay();
  $('#delete-button').hide();
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
    $('#delete-button').show();
    init_drag_table_from_db($('#toExerTable'), $(this).val().toLowerCase(), SCHEDULE_TABLE_SIZE, "query_day_info");
    initDrag();
  });
  $('#muscle-choice').on('change', function() {
    init_muscles_from_db($('#fromExerTable'), $(this).val(), "query_muscle_info");
    initDrag();
  });
  $('#reload-button').on('click', function() {
    init_muscles_from_db($('#fromExerTable'), $(this).val(), "query_muscle_info");
    initDrag();
  });
  $('#submit-button').on('click', function() {
    save_to_db();
    alert("Schedule for " + $("#day-choice").val() + " has been saved.");
  });
  $('#delete-button').on('click', function() {
    if (confirm("Are you sure you want to delete selected exercises from the schedule?")) {
      remove_from_db();
    }
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
      //console.log(muscResponse);
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
    //console.log(exercises);
    createDragTable(exercises, table, heading, false);
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
    var onmouseover = function(e) {query_exer_info($(this).find('td').text());}
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
        console.debug("Day schedule empty.");
      }
    },
    dataType:"json"
  });
  /*
  * Check if object returned from query is valid
  * If valid, schedule for that day is loaded into a table
  */
var heading = new Array("Exercise");
  createDragTable(exercises, table, heading, true);
}

function query_exer_info(exer_name) {
  /*Getting info from database for table update */
  // Update day shown
  $.ajax({
    url: '../php/functions.php',
    async: false,
    // This calles the show_sidebar() method in the functions.php file
    // The 1 is passed just to check if something is set
    data: {phpfunc: "query_exer_info", name: exer_name},
    type:"POST",
    success:function(result){
      $('#info-container').html(result);
    },
  });

  var div, n, v = document.getElementsByClassName("youtube-player");
  for (n = 0; n < v.length; n++) {
    div = document.createElement("div");
    div.setAttribute("data-id", v[n].dataset.id);
    div.innerHTML = labnolThumb(v[n].dataset.id);
    div.onclick = labnolIframe;
    v[n].appendChild(div);
  }

}
/*
* Saves the schedule to the database
*/
function save_to_db() {
  var day = $('#day-choice').val().toLowerCase();
  //Clear column
  $.ajax({
    url: '../php/functions.php',
    async: false,
    data: {phpfunc: "clear_column", day: day},
    type:"POST",
    success: function(msg) {
      console.log(msg);
    }
  });
  //Search through rows for exercises
  $('#toExerTable tr').each(function() {
    $(this).find('td').each(function() {
      var name = $(this).find('.exer_name').text();
      var sets = $(this).find('.exer_sets').val();
      var reps = $(this).find('.exer_reps').val();
      if (sets == "" || reps == "") {
        sets = 4;
        reps = 8;
      }
      //Send info to server
      if (day == "" || name == "") {
        return;
      } else {
        console.log("Trying to save exercise: " + name + " into " + day);
        //Save Schedule
        $.ajax({
          url: '../php/functions.php',
          async: false,
          data: {phpfunc: "update_schedule", name: name, day: day, sets: sets, reps: reps},
          type:"POST",
          success: function(msg) {
            console.log(msg);
          }
        });
      }
    });
  });
}
function remove_from_db() {
  $('#toExerTable input:checked').each(function() {
    $(this).closest('.redips-drag').remove();
  });
  save_to_db();
}

/**********************************************/
/*        TABLE DATA POPULATION               */
/**********************************************/

/* Take in array of info, table id, a top header array and function
* that each row should call when :hover is enabled
*/
function createTable(queryInfo, table, header, onmouseover) {
  table.empty();
  var tableBody = document.createElement('TBODY')
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
function createDragTable(queryInfo, table, header, hasChecks) {
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
    var innerdiv = document.createElement('DIV');
    var redips = document.createElement('SPAN');
    var check = document.createElement('SPAN');
    var sets = document.createElement('SPAN');
    var reps = document.createElement('SPAN');

    tr.className = "rl";
    //Only add DRAGGABLE row if it contains information
    if (queryInfo[row] != "") {
      check.innerHTML = '<label class="checkbox-inline"><input type="checkbox" value="">&nbsp;</label>';
      sets.innerHTML =  '<label class="checkbox-inline">Sets:&nbsp;<input onkeypress="validate(event)" class="exer_sets" type="text" value=""></label>';
      reps.innerHTML =  '<label class="checkbox-inline">Reps:&nbsp;<input onkeypress="validate(event)" class="exer_reps" type="text" value=""></label>';
      redips.innerHTML = queryInfo[row];

      innerdiv.className = "exer_details";
      div.className = "redips-drag exer_row style-4";
      redips.className = "exer_name";

      if (hasChecks) {
        div.appendChild(check);
      }
      innerdiv.appendChild(sets);
      innerdiv.appendChild(reps);
      div.appendChild(innerdiv);
      div.appendChild(redips);
      td.appendChild(div);
    }
    tr.appendChild(td);
    tableBody.appendChild(tr);
  }
  table.html(tableBody);
}


/**********************************************/
/*               HELPER SCRIPTS                 */
/**********************************************/
//Checks if an array is valid and has information
function isValid(array) {
  return array != null && typeof array !== 'undefined' && array.length > 0;
}
/*allows only numbers to be entered into text field*/
function validate(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
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
