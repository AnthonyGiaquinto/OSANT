/* --------  
   Utils.js

   Utility functions.
   -------- */

function trim(str) {     // Use a regular expression to remove leading and trailing spaces.
	return str.replace(/^\s+ | \s+$/g, "");
	/* 
	Huh?  Take a breath.  Here we go:
	- The "|" separates this into two expressions, as in A or B.
	- "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
    - "\s+$" is the same thing, but at the end of the string.
    - "g" makes is global, so we get all the whitespace.
    - "" is nothing, which is what we replace the whitespace with.
	*/
	
}

function rot13(str) {   // An easy-to understand implementation of the famous and common Rot13 obfuscator.
                        // You can do this in three lines with a complex regular expression, but I'd have
    var retVal = "";    // trouble explaining it in the future.  There's a lot to be said for obvious code.
    for (var i in str) {
        var ch = str[i];
        var code = 0;
        if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
            code = str.charCodeAt(i) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
            retVal = retVal + String.fromCharCode(code);
        } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
            code = str.charCodeAt(i) - 13;  // It's okay to use 13.  See above.
            retVal = retVal + String.fromCharCode(code);
        } else {
            retVal = retVal + ch;
        }
    }
    return retVal;
}

function getTime() {
	// Determines date using the date object and stores into an array for use
	var time = [];
	var date = new Date();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var year = date.getFullYear();
	var minutes = date.getMinutes();
	var hour = date.getHours();
	var day_or_night;
	
	if (day < 10)
	{
		day = "0" + day;
	}
	if (month < 10)
	{
		month = "0" + month;
	}
	if (minutes < 10)
	{
		minutes = "0" + minutes;
	}
	if (hour === 0)
	{
		hour = 12;
		day_or_night = "AM";
	}
	else if (hour <= 11)
	{
		day_or_night = "AM";
	}
	else if (hour >= 13)
	{
		hour -= 12;
		day_or_night = "PM";
	}
	if (hour < 10)
	{
		hour = "0" + hour;
	}
	
	time = [hour, minutes, day_or_night, month, day, year];
	return time;
}

// Functions to support the Task Bar's functionality
function runClock() {  // Calculates the time every 30 seconds and updates the taskbar's clock
	_TaskBarContext.font = "26px sans-serif";
	_TaskBarContext.fillStyle="black";
	_TaskBarContext.clearRect(0, 0, 141, _TaskBar.height);
	var currentTime = getTime();
	var timeString = currentTime[0] + ":" + currentTime[1] + " " + currentTime[2];
	var dateString =  currentTime[3] + "/" + currentTime[4] + "/" + currentTime[5];
    _TaskBarContext.fillText(timeString, 12, 23);
    _TaskBarContext.fillText(dateString, 5, 51);
	_TaskBarContext.rect(138, 0, 2, _TaskBar.height);
	_TaskBarContext.fillStyle="red";
	_TaskBarContext.fill(); 
}

function statusUpdate(msg) {   // Writes a status message on the task bar
	_TaskBarContext.clearRect(600, 0, _TaskBar.width, _TaskBar.height);
	_TaskBarContext.font = "italic 30px sans-serif";
	_TaskBarContext.fillStyle="black";
	_TaskBarContext.fillText("status: " + msg, 403, 35, 302);
}