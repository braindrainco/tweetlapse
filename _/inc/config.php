<?php
	$location = "localhost";
	$user = "root";
	$pass = "root";

	$con = mysql_connect($location, $user, $pass);
	if (!$con) {
		die('Could not connect: ' . mysql_error());
	}
?>