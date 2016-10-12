/********************************************/
          /* DRAGGABLE TABLE ROWS */
/********************************************/
var db;
"use strict";
// define redipsInit variable
var redipsInit;
var curMuscleRequest;
// redips initialization
redipsInit = function() {
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


// add onload event listener
if (window.addEventListener) {
    window.addEventListener('load', redipsInit, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', redipsInit);
}
/********************************************/
          /* JQUERY, DOCUMENT READY */
/********************************************/
var d, currentDay;
$(document).ready(function() {
    /* Date Stuff */
     d = new Date();
    currentDay = d.getDay();
    updateDay();

    $('#incDayBut').on('click',function() {
        currentDay++;
        updateDay();
    });
    $('#decDayBut').on('click',function() {
        currentDay--;
        updateDay();
    });
    /* Scheduling page buttons */
    $("#day-choice").on('change', function() {
        $('#muscle-choice').prop('disabled', false);
        $('#muscle-choice').selectpicker('refresh');
    });
    $('#muscle-choice').on('change', function() {
        updateExerciseResults($(this).val());
    });

    $('#reload-button').on('click', function() {
        updateExerciseResults($('#muscle-choice').val());
    });
    $('#submit-button').on('click', function() {
        var fs = require('fs');
        var SQL = require('sql.js');
        var filebuffer = fs.readFileSync('TrackerPro.db');
        db = new SQL.Database(filebuffer);
        var curDaySchedule = [];
        $('#toExerTable tr').each(function() {
            $(this).find('td').each(function() {
                var xhr = new XMLHttpRequest();
                var exer_name = $(this).find('.redips-drag').text();

                xhr.open('GET', 'TrackerPro.db', true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function(e) {
                    var uInt8Array = new Uint8Array(this.response);
                    db = new SQL.Database(uInt8Array);
                    var query = "SELECT id FROM exercises WHERE name='" + exer_name + "'";
                    var response = db.exec(query);
                    /*Check if query returned an exercise */
                    if (isValid(response)) {
                        /* Add exercise to list */
                        var id = response[0].values[0];
                        curDaySchedule.push(id);
                        query = "INSERT INTO " + dayToListId($("#day-choice").val()) + " (exer_id) VALUES ('" + id + "');"
                        console.log("Adding: " + query);
                        db.run(query);
                    } else {
                        console.log("Error in scheduling.js");
                    }
                    
                };
                xhr.send();
            });
        });
        alert("Schedule for " + $("#day-choice").val() + " has been saved. \n" + curDaySchedule);
        var data = db.export();
        var buffer = new Buffer(data);
        fs.writeFileSync('TrackerPro.db', buffer);
    });
});
/********************************************/
          /* EXERCISE.HTML BACKEND */
/********************************************/
/* 
* Called everytime the day is changed by user
* Responsible for querying database, loading table,
* clearing html elements and error checking
*/
function changeDay() {
    var query, exercises, exerciseName, item, db;
    /* Open database and prepare for query */
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'TrackerPro.db', true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        var uInt8Array = new Uint8Array(this.response);
        db = new SQL.Database(uInt8Array);
        /* Create query text */
        query = "SELECT * FROM " + $("#day-of-week").text().toLowerCase() + "List";
        exercises = db.exec(query);
        /* 
         * Check if object returned from query is valid 
         * If valid, schedule for that day is loaded into a table
         */

        if (isValid(exercises)) {
            // clear error section
            $("#error_section").html("");
            exercises = exercises[0].values;
            //Loop through all exercise IDs returned from query 
            for (item = 0; item < exercises.length; item++) {
                query = "SELECT name FROM exercises WHERE id='" + exercises[item] +"'";
                exerciseName = db.exec(query);
                // checks if exercise ID corresponds to an exercise
                if (isValid(exerciseName)) {
                    exercises[item] = exerciseName[0].values[0];
                } else {
                    console.error("Could not find exercise with id: " + exercises[item]);
                }
            }
            /* Setting up arrays and functions for building the table */
            var heading = new Array("Exercise");
            var onmouseover = function(e) {updateInfoPane($(this).find('td').text());}
            addTable(exercises, $('#day-table'), heading, onmouseover);
            //update info pane with first exercise returned
            updateInfoPane(exercises[0]);
        /* Query returned an invalid object. Schedule has not been created.
         * Clear html elements and show user error msg 
         */
        } else {
            var error = "Your trainer has not created an exercise schedule for today yet."
            $("#error_section").html(error);
            $("#day-table").html("");
            $("#title").html("");
            $("#subtitle").html("");
            $("#info-video").html("");
            $("#info-explanation").html("");
        }        
    };
    xhr.send();
}
/* Take in array of info, table id, a top header array and function
 * that each row should call when :hover is enabled 
 */
function addTable(queryInfo, tableID, headerArray, onmouseover) {
    var table = tableID;
    var tableBody = document.createElement('TBODY')
    var header = headerArray;
   //TABLE COLUMNS
   table.empty();
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
        for (col = 0; col < queryInfo[row].length; col++) {
            var td = document.createElement('TD')
            var div = document.createElement('DIV')
            td.appendChild(document.createTextNode(queryInfo[row][col]));
            tr.appendChild(td)
        }
        tableBody.appendChild(tr);
    }
    table.append(tableBody);

}
/* Updates the right pane to show users info about specific exercise 
 *  This is called everytime :hover is actived on '#day-table'
 */
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
/* Function used to check if an object is valid/has elements */
function isValid(response) {
    return typeof response !== 'undefined' && response.length > 0;
}
/**********************************************/
/* TABLE DATA POPULATION AND DATABASE REQUESTS*/
/**********************************************/
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

function updateDragTable(queryInfo, tableID, headerArray) {
    var table = document.getElementById(tableID);
    var tableBody = document.createElement('TBODY')
    var header = headerArray;
    table.innerHTML = "";
    //TABLE COLUMNS
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    for (var col = 0; col < header.length; col++) {
        var th = document.createElement('TH')
        th.innerHTML = header[col];
        tr.appendChild(th);
    }
    //ROWS
    for (var row = 0; row < queryInfo.length; row++) {
        var tr = document.createElement('TR');
        tr.className = "rl"
        for (var col = 0; col < queryInfo[row].length; col++) {
            var td = document.createElement('TD')
            var div = document.createElement('DIV')
            div.innerHTML = queryInfo[row][col];
            div.className = "redips-drag darkRed";
            td.appendChild(div);
            tr.appendChild(td)
        }
        tableBody.appendChild(tr);
    }
    table.appendChild(tableBody);
}

function dayToListId(day) {
    return day.toLowerCase() + "List";
}

/**********************************************/
                /*DATE SCRIPTS*/
/**********************************************/

function updateDay() {
    if (currentDay < 0) currentDay = 6;
    if (currentDay > 6) currentDay = 0;
    document.getElementById("day-of-week").innerHTML = toStringDate(currentDay);
    changeDay();

}

function toStringDate(day) {
    var weekday = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
    return weekday[day];
}

