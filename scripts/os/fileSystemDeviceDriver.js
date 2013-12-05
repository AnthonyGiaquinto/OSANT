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