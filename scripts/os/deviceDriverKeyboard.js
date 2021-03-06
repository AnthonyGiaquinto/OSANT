/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

// Tested on Firefox, Safari, and Chrome
function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 123)) )   // a..z
    {
        // Determine the character we want to display.  
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);        
    }    
    else if ( ((keyCode >= 48) && (keyCode <= 57) && !isShifted) ||   // digits 
               (keyCode == 32)                                   ||   // space
               (keyCode == 13)                                   ||   // enter
               (keyCode == 8)                                    ||   // backspace
               (keyCode == 38)                                   ||   // up arrow
               (keyCode == 40) )                                      // down arrow
    {
        chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr); 
    }
    else if ((keyCode >= 48) && (keyCode <= 57) && isShifted)   // shifted digits
    {
    	switch(keyCode)
    	{
    	case 48:
    		chr = ")";
        	_KernelInputQueue.enqueue(chr);
        	break;
        case 49:
    		chr = "!";
        	_KernelInputQueue.enqueue(chr);
        	break;
        case 50:
    		chr = "@";
        	_KernelInputQueue.enqueue(chr);
        	break;
        case 51:
    		chr = "#";
        	_KernelInputQueue.enqueue(chr);
        	break;
        case 52:
    		chr = "$";
        	_KernelInputQueue.enqueue(chr);
        	break;
        case 53:
    		chr = "%";
        	_KernelInputQueue.enqueue(chr);
        	break;
        case 54:
    		chr = "^";
        	_KernelInputQueue.enqueue(chr);
        	break;
        case 55: // Error: Chrome recognizes this as the up arrow?
    		chr = "&";
        	_KernelInputQueue.enqueue(chr);
        	break;
        case 56:
    		chr = "*";
        	_KernelInputQueue.enqueue(chr);
        	break;
        case 57:  // Error: Chrome recognizes this as the down arrow?
    		chr = "(";
        	_KernelInputQueue.enqueue(chr);
        	break;
        default:
        	krnTrace("Warning: Unhandled keyboard input."); 
        }
    }
    else   // Other punctuation characters not already handled
    {
    	switch(keyCode)
    	{
    	case 192:
    		chr = isShifted ? "~" : "`";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 189: // for chrome
    	case 173:
    		chr = isShifted ? "_" : "-";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 187: // for chrome
    	case 61:
    		chr = isShifted ? "+" : "=";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 219:
    		chr = isShifted ? "{" : "[";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 221:
    		chr = isShifted ? "}" : "]";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 220:
    		chr = isShifted ? "|" : "\\";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 59:
    		chr = isShifted ? ":" : ";";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 186:
    		chr = isShifted ? ":" : ";";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 222:
    		chr = isShifted ? "\"" : "'";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 188:
    		chr = isShifted ? "<" : ",";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 190:
    		chr = isShifted ? ">" : ".";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	case 191:
    		chr = isShifted ? "?" : "/";
    		_KernelInputQueue.enqueue(chr);
    		break;
    	default:
    		krnTrace("Warning: Unhandled keyboard input."); 
    	}
    }
}
