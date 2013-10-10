/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false;  
    };
        
    this.cycle = function() {
        krnTrace("CPU cycle");
        
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.
    };
    
    this.execute = function(opCode) {
    	switch(opCode)
    	{
    		case "A9":
    			loadAccWithConstant();
    			break;
			case "AD":
				loadAccFromMemory();
				break;
			case "8D":
				storeAccInMemory();
				break;
			case "6D":
				addWithCarry();
				break;
			case "A2":
				loadXWithConstant();
				break;
			case "AE":
				loadXFromMemory();
				break;
			case "A0":
				loadYWithConstant();
				break;
			case "AC":
				loadYFromMemory();
				break;
			case "EA":
				noOperation();
				break;
			case "00":
				systemBreak();
				break;
			case "EC":
				compareToX();
				break;
			case "D0":
				branchXBytes();
				break;
			case "EE":
				incrementByte();
				break;
			case "FF":
				systemCall();
				break;
			default:
				krnTrapError("Invalid Op Code");
				break;
		}
    };
}

// Load the accumulator with a constant
function loadAccWithConstant()
{
}

// Load the accumulator from memory
function loadAccFromMemory()
{
}

// Store the accumulator in memory
function storeAccInMemory()
{
}

// Adds contents of an address to 
// the contents of the accumulator and 
// keeps the result in the accuculator 
function addWithCarry()
{
}

// Load the X register with a constant
function loadXWithConstant()
{
}

// Load the X register from memory
function loadXFromMemory()
{
}

// Load the Y register with a constant
function loadYWithConstant()
{
}

// Load the Y register from memory
function loadYFromMemory()
{
}

// No Operation
function noOperation()
{
}

// Break
function systemBreak()
{
}

// Compare a byte in memory to the X reg
// Sets the Z flag if equal
function compareToX()
{
}

// Branch X bytes if Z flag = 0
function branchXBytes()
{
}

// Increment the value of a byte
function incrementByte()
{
}

// System Call
// #$01 in X reg = print the integer stored in the Y register. 
// #$02 in X reg = print the 00-terminated string stored at the address in the Y register.
function systemCall()
{
}