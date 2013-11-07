/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer = "";
    this.commandHistory = new Array();  // Array containing the commands that were entered
    this.index = -1;   // Index of most recent command or most recent command selected by the arrow keys.
                       // (Increments when up, decrements when down)
    
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
    };

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };
    
    this.blueScreen = function() { // Used for the blue screen of death
       _DrawingContext.fillStyle = "blue";
       _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
       this.CurrentFontSize += 3;
       this.resetXY();
       _CriticalError = true;
    };
    
    this.clearLine = function() {
    	_DrawingContext.clearRect(0, this.CurrentYPosition - this.CurrentFontSize, _Canvas.width, this.CurrentFontSize + _FontHeightMargin);
    	this.CurrentXPosition = 0;
    	_OsShell.putPrompt();
    };

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };

    this.handleInput = function() {
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if (chr == String.fromCharCode(13))  //     Enter key
           {
               var str = this.buffer;
               // The enter key marks the end of a console command, so ...
               // ... while adding the command to the front of the command history ...
               this.commandHistory.unshift(str);
               // ... and the back of the total history ... 
               _ConsoleTextHistory.push(">" + str);
               // ... tell the shell ...
               _OsShell.handleInput(this.buffer);
               // ... and reset our buffer and command history index.
               this.buffer = "";
               this.index = -1;
           }
           else if (chr == String.fromCharCode(8))   // Backspace key
           {
           	   // Trim the last character of the buffer, if there is any.
           	   if (this.buffer != "")
           	   {
           	   	   this.buffer = this.buffer.substring(0, this.buffer.length - 1);
           	   	   this.clearLine();
           	   	   for (var i = 0; i < this.buffer.length; i++)
           	   	   {
           	   	       this.putText(this.buffer[i]);
           	   	   }
           	   }
           }
           else if (chr == String.fromCharCode(38))   // Up Arrow
           {
               // Not the oldest command? Show the next oldest!
               if (this.index < this.commandHistory.length - 1)
               {
                   ++this.index;
                   var str = this.commandHistory[this.index];
                   this.clearLine();
                   this.buffer = "";
                   for (var i = 0; i < str.length; i++)
                   {
                       this.putText(str[i]);
                       this.buffer += str[i];
                   }
               }
           }
           else if (chr == String.fromCharCode(40))   // Down Arrow
           {
               // Not the most recent command? Show the next most recent one!
               if (this.index > 0)
               {
                   --this.index;
                   var str = this.commandHistory[this.index];
                   this.clearLine();
                   this.buffer = "";
                   for (var i = 0; i < str.length; i++)
                   {
                       this.putText(str[i]);
                       this.buffer += str[i];
                   }
               }
           }
           // TODO: Write a case for Ctrl-C.
           else
           {
               // This is a "normal" character, so ...
               // ... draw it on the screen...
               this.putText(chr);
               // ... and add it to our buffer.
               this.buffer += chr;
           }
       }
    };

    this.putText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.
       if (text !== "")
       {
           // Draw the text at the current X and Y coordinates.
           _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
           // Move the current X position.
           var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
           this.CurrentXPosition = this.CurrentXPosition + offset;
       }
    };

    this.advanceLine = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
       if (this.CurrentYPosition > 489)   // The last line that you can enter data on
       {
           //  clear the canvas...
           this.init();
           //   make room for the next line as well as the next prompt...
           _ConsoleTextHistory.shift();
           _ConsoleTextHistory.shift();
           //   repopulate canvas with new material
           for (var i = 0; i < _ConsoleTextHistory.length; i++)
           {
               this.putText(_ConsoleTextHistory[i].toString());
               this.advanceLine();
           }
       }
    };
}
