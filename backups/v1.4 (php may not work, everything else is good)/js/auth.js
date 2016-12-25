var db;
function check_login(usr, pwd) {
    /* CONNECT TO DATABASE */
    var employees;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'TrackerPro.db', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        var uInt8Array = new Uint8Array(this.response);
        db = new SQL.Database(uInt8Array);
        var req = "SELECT * FROM admin WHERE username='" +usr.toString()+ "' AND password='" +pwd.toString()+"'";
        employees = db.exec(req);
        console.log(employees);
        
        if (isValid(employees) && employees[0].values.length != 0) {
            console.log("0 rows returned from:" + req);
            localStorage['login'] = false;
            $('#pwd_error').html("Invalid username/password"); 
        } else if (isValid(employees) && employees[0].values.length == 0) {
            localStorage['login'] = false;
        } else {
            localStorage['login'] = true;
        } 
    };
    xhr.send();
   
}
function showGuest () {
    $('#welcome').html("Welcome!");
    $('#user-info').hide();
    $('#pwd_error').html("");
    $('#user').hide();
    $('#guest').show();
    $('#logout').hide();
}
function showUser () {
    $('#welcome').html("Welcome!");
    $('#user-info').html("This text area is used for users that have logged in.");
    $('#pwd_error').html("");
    $('#user').show();
    $('#guest').hide();
    $('#logout').show();
}
$(document).ready(function() {
    if (localStorage['login'] == true) {
        showUser();
    } else {
        showGuest();
    }
    $('#login').on('click', function() {
        var username = $("#usr").val();
        var password = $("#pwd").val();
        check_login(username, password);
        /* User Area */
        if (localStorage['login']) {
            showUser();
        }
        
    });
    $('#logout').on('click', function() {
        localStorage['login'] = false;
        showGuest();
    });
});
function isValid(response) {
    return typeof response !== 'undefined' && response.length > 0;
}