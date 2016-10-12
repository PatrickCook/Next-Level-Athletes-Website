
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
    for (col = 0; col < header.length; col++) {
        var th = document.createElement('TH')
        th.appendChild(document.createTextNode(header[col]));
        tr.appendChild(th);
    }
    //Create Rows
    for (row = 0; row < queryInfo.length; row++) {
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

