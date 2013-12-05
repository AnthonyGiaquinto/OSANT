/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "OSANT";  // 'cause I was also at a loss for a better name.
var APP_VERSION = "1";   // What did you expect?

var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;  

var _NEW = "New";               //
var _READY = "Ready";           //
var _RUNNING = "Running";       // Process States
var _WAITING = "Waiting";       //
var _TERMINATED = "Terminated"; //

var _RR = "Round Robbin";             //
var _FCFS = "First Come First Serve"; // Scheduling Algorithms
var _PRIORITY = "Priority";           //
var DEFAULT_PRIORITY = 50;

//
// Global Variables
//
var _CPU = null;
var _Memory = null;
var _ResidentList = new Array(); // List of loaded processes
var _ReadyQueue = null; // Queue of running processes

var _MemorySize = 768;   // Total Memory Size
var _PartitionSize = 255 // Memory Partition Size
var _PID = 0;            // Variable to keep track of current PID

var _CpuScheduler = null; // CPU Scheduler Initialized on start button
var _SchedulingAlgorithm = _FCFS; // Scheduling algorithm (round robin by default)
var _Quantum = 6; // Round Robin Quantum. Default is 6.


var _OSclock = 0;        // Page 23.

var _TaskBarInterValID = null // Interval ID for the clock that will run in the task bar.

var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _TaskBar = null;              // Initialized in hostInit().
var _TaskBarContext = null;       // Initialized in hostInit().

var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

// Has a blue screen of death happened?
var _CriticalError = false;

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;
var _ConsoleTextHistory = new Array(); // An array that stores all lines of text to help scroll

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;
