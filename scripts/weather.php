<?php
/*
	Weather.php
	
	This file takes in a latitude and a longitude value and returns the weather at the location provided.
	Inputs: 
		Latitude : float
		Longitude : float
	Outputs:
		Weather: Object
		
	Author: James Clarkson
	Date: Dec 22, 2017
*/
	if(isset($_REQUEST["lat"]) && isset($_REQUEST["lng"]))
	{
		$lat = (float)$_REQUEST["lat"];
		$lng = (float)$_REQUEST["lng"];
		$file_string = 'https://api.darksky.net/forecast/1899654d2e621f2f86561b871b235451/' . $lat . ',' . $lng. "?units=ca";		
		$ret = file_get_contents($file_string);
	}
	
	if(!isset($ret))
		$ret = "No weather data found";
	echo $ret;
?>