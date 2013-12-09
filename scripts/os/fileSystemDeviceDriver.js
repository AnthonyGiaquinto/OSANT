/* ----------------------------------
   fileSystemDeviceDriver.js
   
   Requires deviceDriver.js
   
   File System Device Driver.
   ---------------------------------- */

FileSystemDeviceDriver.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function FileSystemDeviceDriver()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnFileDriverEntry;
    this.isr = krnFileFunctions;
    // "Constructor" code.
}

function krnFileDriverEntry()
{
    // Initialization routine for this.
    this.status = "loaded";
    // More?
}

// Creates the file
function create(filename)
{
	
}

// Initializes File System Memory in local storage
function format()
{
	for(i = 0; i < _TRACKS; i++)
    {
        for(j = 0; j < _SECTORS; j++)
        {
            for(k = 0; k < _BLOCKS; k++)
            {
                var TSB = "" + i + "" +  j + "" + k;
                localStorage[TSB] = "";
            }
        }
    }
}
