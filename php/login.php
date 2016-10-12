<?php

if (!isset($_SESSION['id']) || !isset($_SESSION['username']))
{

	// user is not logged in.
    if (isset($_POST['cmdlogin']))
    {
        // retrieve the username and password sent from login form
        // First we remove all HTML-tags and PHP-tags, then we create a md5-hash
        // This step will make sure the script is not vurnable to sql injections.
        $u = strip_tags($_POST['username']);
        $p = strip_tags($_POST['password']);
        //Now let us look for the user in the database.
        $query = sprintf("SELECT id FROM admin WHERE username = '%s' AND password = '%s';",
            mysqli_real_escape_string($conn, $u), mysqli_real_escape_string($conn, $p));
        $result = mysqli_query($conn, $query);
        // If the database returns a 0 as result we know the login information is incorrect.
        // If the database returns a 1 as result we know  the login was correct and we proceed.
        // If the database returns a result > 1 there are multple users
        // with the same username and password, so the login will fail.
        if (mysqli_num_rows($result) != 1)
        {
            // invalid login information
            echo "Wrong username or password!";
            //show the loginform again.
            include "loginform.php";
        } else {
            // Login was successfull
            $row = mysqli_fetch_array($result);
            // Save the user ID for use later
            $_SESSION['id'] = $row['id'];
              // Save the username for use later
            $_SESSION['username'] = $u;
              // Now we show the userbox
            header('Location: ../exercise.php');
        }
    } else {
    	 // User is not logged in and has not pressed the login button
    	 // so we show him the loginform
        include "loginform.php";
    }
 
} else {
	 // The user is already loggedin, so we show the userbox.
    show_userbox();
}

?>