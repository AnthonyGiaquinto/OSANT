/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;
    
    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date and time.";
    sc.function = shellDate;
    this.commandList[this.commandList.length] = sc;
    
    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Displays your current location.";
    sc.function = shellWhereAmI;
    this.commandList[this.commandList.length] = sc;
    
    // TODO: Add an interesting and creative command.
    
    // BSOD
    sc = new ShellCommand();
    sc.command = "bluescreen";
    sc.description = "- Tests the blue screen of death.";
    sc.function = shellBSOD;
    this.commandList[this.commandList.length] = sc;
    
    // load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "- Checks the User Program Input for an error.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;

    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    if (!_CriticalError)
    {
    	this.putPrompt();
    }
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
	var result = "";
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
    	result = "Duh. Go back to your Speak & Spell.";
        _StdIn.putText(result);
        _ConsoleTextHistory.push("Invalid Command. " + result);
    }
    else
    {
    	result = "Type 'help' for, well... help.";
        _StdIn.putText(result);
        _ConsoleTextHistory.push("Invalid Command. " + result);
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _ConsoleTextHistory.push("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _ConsoleTextHistory.push("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   var result = "";
   if (_SarcasticMode) {
      result = "Okay. I forgive you. This time.";
      _StdIn.putText(result);
      _ConsoleTextHistory.push(result);
      _SarcasticMode = false;
   } else {
      result = "For what?";
      _StdIn.putText(result);
      _ConsoleTextHistory.push(result);
   }
}

function shellVer(args)
{
	var result = APP_NAME + " Version " + APP_VERSION;
    _StdIn.putText(result);
    _ConsoleTextHistory.push(result);
}

function shellHelp(args)
{
	var result = "";
    _StdIn.putText("Commands:");
    _ConsoleTextHistory.push("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        result = "  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description;
        _StdIn.putText(result);
        _ConsoleTextHistory.push(result);
    }    
}

function shellShutdown(args)
{
	var result = "Shutting down...";
     _StdIn.putText(result);
     _ConsoleTextHistory.push(result);
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
	var result = "";
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
            	result = "Help displays a list of (hopefully) valid commands.";
                break;
            default:
            	result = "No manual entry for " + args[0] + ".";
        }        
    }
    else
    {
    	result = "Usage: man <topic>  Please supply a topic.";
    }
    _StdIn.putText(result);
    _ConsoleTextHistory.push(result);
}

function shellTrace(args)
{
	var result = "";
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                	result = "Trace is already on, dumbass.";
                }
                else
                {
                    _Trace = true;
                    result = "Trace ON";
                }
                
                break;
            case "off": 
                _Trace = false;
                result = "Trace OFF";
                break;                
            default:
            	result = "Invalid arguement.  Usage: trace <on | off>.";
        }        
    }
    else
    {
    	result = "Usage: trace <on | off>";
    }
    _StdIn.putText(result);
    _ConsoleTextHistory.push(result);
}

function shellRot13(args)
{
	var result = "";
    if (args.length > 0)
    {
    	result = args[0] + " = '" + rot13(args[0]) +"'";   // Requires Utils.js for rot13() function.
    }
    else
    {
    	result = "Usage: rot13 <string>  Please supply a string.";
    }
    _StdIn.putText(result);
    _ConsoleTextHistory.push(result);
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
    	var result = "Usage: prompt <string>  Please supply a string.";
        _StdIn.putText(result);
        _ConsoleTextHistory.push(result);
    }
}

function shellDate()
{
	// Determines date using the date object
	var date = new Date();
	//date.setTime(date.getTime());
	var month = date.getMonth()+1;
	var day = date.getDate();
	var year = date.getFullYear();
	var minutes = date.getMinutes();
	var hour = date.getHours();
	var day_or_night;
	
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
	
	var result = "It is currently " + hour + ":" + minutes + " " + day_or_night + 
	               " on "  + month + "/" + day + "/" + year + ".";
	_StdIn.putText(result);
    _ConsoleTextHistory.push(result);
}

function shellWhereAmI()
{
    var result = "You are sitting down in front of your computer somewhere on Earth.";
	_StdIn.putText(result);
	_ConsoleTextHistory.push(result);
}

function shellBSOD()
{
	krnTrapError(".. Gotcha! It's only a test!");
}

function shellLoad()
{
	var result = "";
	var input = document.getElementById("taProgramInput");
	var text = input.value;
	text = trim(text);
	// Must start and end with 2-digit hex values, hex numbers following the first are preceded by spaces.
	var goodOp = /^[A-F0-9]{2}(?:\s[A-F0-9][A-F0-9])*$/;
	var isGood = goodOp.test(text);
	if (isGood)
	{
		result = "This is a valid Op Code.";
	}
	else
	{
		result = "This is not a valid Op Code.";
	}
	_StdIn.putText(result);
	_ConsoleTextHistory.push(result);
}