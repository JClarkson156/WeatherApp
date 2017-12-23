/*
	App.js
	
	This file runs all of the javascript required for the weather app. On Load it attempts to get the location of the browser, it defaults to Toronto.
	Calling setLocation allows the weather to be updated without refreshing the page.
	
	Author: James Clarkson
	Date: Dec 23, 2017
*/
var Location;
var WeatherData;
var skycons;

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

$(document).ready(function()
{
	skycons = new Skycons({"color": "black"});
	skycons.play();
	setLocation();
});

function setLocation()
{
	if(navigator.geolocation)
		navigator.geolocation.getCurrentPosition(showPosition);
	else
	{
		$("#location").html("Geolocation is not supported by this browser. Location has been autoset.");
		Location = {lat:43.6532, lng: -79.3832};
		$("#curtime").html( tempDate.toLocaleDateString() + " " + tempDate.toLocaleTimeString() );
		getWeather();
	}
}

function showPosition(position)
{
	var tempDate = new Date();
	$("#curtime").html( tempDate.toLocaleDateString() + " " + tempDate.toLocaleTimeString() );
	$("#location").html("Latitude: " + position.coords.latitude.toFixed(2) + ", Longitude: " + position.coords.longitude.toFixed(2));
	Location = {lat:position.coords.latitude, lng: position.coords.longitude};
	getWeather();
}

function getWeather()
{
	$.ajax({
		url: 'scripts/weather.php',
		type: 'GET',
		data: {
			lat:Location.lat,
			lng:Location.lng
		}
	}).done(function(data){
		console.log(JSON.parse(data));
		WeatherData = JSON.parse(data);
		displayData();
	});
}

function displayData()
{
	if(WeatherData.currently)
	{
		var current = $("#currently");
		var html = getData(WeatherData.currently, "current_icon");
		current.html(html);
		
		skycons.add("current_icon", WeatherData.currently.icon);
	}
	
	if(WeatherData.hourly)
	{
		var hourly = $("#hourly");
		var html = "<div class=\"hour\">" + getData(WeatherData.hourly.data[2], "hour1") + "</div>";
		html += "<div class=\"hour\">" + getData(WeatherData.hourly.data[4], "hour2") + "</div>";
		html += "<div class=\"hour\">" + getData(WeatherData.hourly.data[6], "hour3") + "</div>";
		html += "<div class=\"hour\">" + getData(WeatherData.hourly.data[8], "hour4") + "</div>";
		hourly.html(html);
		
		skycons.add("hour1", WeatherData.hourly.data[1].icon);
		skycons.add("hour2", WeatherData.hourly.data[2].icon);
		skycons.add("hour3", WeatherData.hourly.data[3].icon);
		skycons.add("hour4", WeatherData.hourly.data[4].icon);
	}
	
	if(WeatherData.daily)
	{
		var daily = $("#daily");
		var html = "<div class=\"day\">" + getData(WeatherData.daily.data[1], "day1", true) + "</div>";
		html += "<div class=\"day\">" + getData(WeatherData.daily.data[2], "day2", true) + "</div>";
		html += "<div class=\"day\">" + getData(WeatherData.daily.data[3], "day3", true) + "</div>";
		html += "<div class=\"day\">" + getData(WeatherData.daily.data[4], "day4", true) + "</div>";
		html += "<div class=\"day\">" + getData(WeatherData.daily.data[5], "day5", true) + "</div>";
		daily.html(html);
		
		skycons.add("day1", WeatherData.daily.data[1].icon);
		skycons.add("day2", WeatherData.daily.data[2].icon);
		skycons.add("day3", WeatherData.daily.data[3].icon);
		skycons.add("day4", WeatherData.daily.data[4].icon);
		skycons.add("day5", WeatherData.daily.data[5].icon);
	}
}

function getData(data, icon, day)
{
	if(!day)
		return "<p class=\"item\">" + timeHour(data.time) + "</p>" +
				"<p class=\"item\">" + data.summary + "</p>" +	
				"<span class=\"temp\"><canvas class=\"icon\" id=\"" + icon + "\" width=\"64\" height=\"64\"></canvas>" +
					"<p class=\"temp item\">" + data.temperature.toFixed(0) + "&deg;C</p></span>" +									
					"<p class=\"italic item\">Feels Like:" + data.apparentTemperature.toFixed(0) + "&degC</p>" +					
					( data.precipAccumulation ? "<p class=\"item\">Precip:" + (data.precipAccumulation.toFixed(0) ? data.precipAccumulation.toFixed(0) : "<1")  + "cm</p>" : "") +
					"<p class=\"item\">POP:" + (data.precipProbability * 100).toFixed(0) + "%</p>" +
					"<p class=\"item\">Humidity:" + (data.humidity * 100).toFixed(0) + "%</p>";
	return "<p class=\"item\">" + timeHour(data.time, day) + "</p>" +
			"<p class=\"item\">" + data.summary + "</p>" +
			"<span class=\"temp\"><canvas class=\"icon\" id=\"" + icon + "\" width=\"64\" height=\"64\"></canvas>" +
			"<p class=\"temp item\">H:" + data.temperatureHigh.toFixed(0) + "&deg;C<br>L:" + data.temperatureLow.toFixed(0) + "&degC</p></span>" +				
				"<p class=\"italic item\">Feels Like- H:" + data.apparentTemperatureHigh.toFixed(0) + "&deg;C, L:" + data.apparentTemperatureLow.toFixed(0) + "&degC</p>" +
				"<p class=\"item\">Precip:" + (data.precipAccumulation.toFixed(0) ? data.precipAccumulation.toFixed(0) : "<1")  + "cm</p>" +
				"<p class=\"item\">POP:" + (data.precipProbability * 100).toFixed(0) + "%</p>" +
				"<p class=\"item\">Humidity:" + (data.humidity * 100).toFixed(0) + "%</p>";
}

function timeHour(unixTime, dayTime)
{
	var dataTime = new Date(unixTime * 1000);	
	var retTime = "";
	
	if(dayTime)
		retTime += monthNames[dataTime.getMonth()] + ". " + dataTime.getDate();
	else
		retTime += dataTime.toLocaleTimeString();
	return retTime;
}

