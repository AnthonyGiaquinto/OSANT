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
    
    this.update = function(pc, acc, xreg, yreg, zflag) // Used for Context Switching
    {
    	this.PC    = pc;
        this.Acc   = acc;
        this.Xreg  = xreg;
        this.Yreg  = yreg;
        this.Zflag = zflag;
    }
        
    this.cycle = function() {
        krnTrace("CPU cycle");
        if (_CpuScheduler.cycle > _Quantum)
        {
        	_CpuScheduler.contextSwitch();
        }
        // Executes current instruction, increments scheduler cycle, updates CPU Display
        this.execute(getData(this.PC));
        _CpuScheduler.cycle++;
        updateCPUDisplay();
        updateReadyQueueDisplay();
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
	// Loads the decimal value of the next byte in memory
	// Must increment PC twice
	var data = getData(++_CPU.PC);
	_CPU.Acc = parseInt(data, 16);
	_CPU.PC++;
}

// Load the accumulator from memory
function loadAccFromMemory()
{
	var suffix = getData(++_CPU.PC);
	var prefix = getData(++_CPU.PC);
	var address = parseInt(prefix + "" + suffix, 16);
	if (inBounds(address))
	{
		_CPU.Acc = parseInt(getData(address), 16);
	}
	else
	{
		krnTrapError("Address not in bounds.");
	}
	_CPU.PC++;
}

// Store the accumulator in memory
function storeAccInMemory()
{
	var suffix = getData(++_CPU.PC);
	var prefix = getData(++_CPU.PC);
	var address = parseInt(prefix + "" + suffix, 16);
	if (inBounds(address))
	{
		setLocation(_CpuScheduler.currentProcess.base + address, _CPU.Acc.toString(16).toUpperCase());
	}
	else
	{
		krnTrapError("Address not in bounds.");
	}
	_CPU.PC++;
}

// Adds contents of an address to 
// the contents of the accumulator and 
// keeps the result in the accuculator 
function addWithCarry()
{
	var suffix = getData(++_CPU.PC);
	var prefix = getData(++_CPU.PC);
	var address = parseInt(prefix + "" + suffix, 16);
	if (inBounds(address))
	{
		_CPU.Acc += parseInt(getData(address), 16);
	}
	else
	{
		krnTrapError("Address not in bounds.");
	}
	_CPU.PC++;
}

// Load the X register with a constant
function loadXWithConstant()
{
	_CPU.Xreg = parseInt(getData(++_CPU.PC), 16);
	_CPU.PC++;
}

// Load the X register from memory
function loadXFromMemory()
{
	var suffix = getData(++_CPU.PC);
	var prefix = getData(++_CPU.PC);
	var address = parseInt(prefix + "" + suffix, 16);
	if (inBounds(address))
	{
		_CPU.Xreg = parseInt(getData(address), 16);
	}
	else
	{
		krnTrapError("Address not in bounds.");
	}
	_CPU.PC++;
}

// Load the Y register with a constant
function loadYWithConstant()
{
	_CPU.Yreg = parseInt(getData(++_CPU.PC), 16);
	_CPU.PC++;
}

// Load the Y register from memory
function loadYFromMemory()
{
	var suffix = getData(++_CPU.PC);
	var prefix = getData(++_CPU.PC);
	var address = parseInt(prefix + "" + suffix, 16);
	if (inBounds(address))
	{
		_CPU.Yreg = parseInt(getData(address), 16);
	}
	else
	{
		krnTrapError("Address not in bounds.");
	}
	_CPU.PC++;
}

// No Operation
function noOperation()
{
	_CPU.PC++;
}

// Break
function systemBreak()
{
	// Updates the process to being terminated
	_CpuScheduler.currentProcess.update(_TERMINATED, _CPU.PC, _CPU.Acc, 
	                                    _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
	// If there are more processes to execute, then context switch                                   
	if (_ReadyQueue.getSize() > 0)
	{
		_CpuScheduler.contextSwitch();
	}
	else // Otherwise, stop executing
	{
		_CPU.isExecuting = false;
	}
	_StdIn.putText("Process finished.");
	_ConsoleTextHistory.push("Process finished");
	_StdIn.advanceLine();
	_OsShell.putPrompt();
}

// Compare a byte in memory to the X reg
// Sets the Z flag to 1 if equal
function compareToX()
{
	var suffix = getData(++_CPU.PC);
	var prefix = getData(++_CPU.PC);
	var address = parseInt(prefix + "" + suffix, 16);
	
	if (inBounds(address))
	{
		var memoryValue = parseInt(getData(address), 16);
		if (memoryValue === _CPU.Xreg)
		{
			_CPU.Zflag = 1;
		}
		else
		{
			_CPU.Zflag = 0;
		}
	}
	else
	{
		krnTrapError("Address not in bounds.");
	}
	_CPU.PC++;
}

// Branch X bytes if Z flag = 0
function branchXBytes()
{
	// Obtain the branch value and move the program counter accordingly.
	if (_CPU.Zflag === 0)
	{
		var branch = parseInt(getData(++_CPU.PC), 16);
		_CPU.PC += branch;
		
		// Are we passed the memory limit?
		if (_CPU.PC > _PartitionSize)
		{
			_CPU.PC -= (_PartitionSize + 1);
		}
			
		_CPU.PC++;
	}
	else
	{
		// Skip the operand
		_CPU.PC += 2;
	}
}

// Increment the value of a byte
function incrementByte()
{
	var suffix = getData(++_CPU.PC);
	var prefix = getData(++_CPU.PC);
	var address = parseInt(prefix + "" + suffix, 16);
	
	if (inBounds(address))
	{
		var byteValue = parseInt(getData(address), 16);
		byteValue++;
		setLocation(_CpuScheduler.currentProcess.base + address, byteValue.toString(16).toUpperCase());
	}
	
	_CPU.PC++;
}

// System Call
// #$01 in X reg = print the integer stored in the Y register. 
// #$02 in X reg = print the 00-terminated string stored at the address in the Y register.
function systemCall()
{
	if (_CPU.Xreg === 1)
	{
		_StdIn.putText(_CPU.Yreg.toString());
		_ConsoleTextHistory.push(_CPU.Yreg);
		_StdIn.advanceLine();
		_OsShell.putPrompt();
	}
	else if (_CPU.Xreg === 2)
	{
		var adress = _CPU.Yreg;     // Current adress that is being converted into a char
		var data = getData(adress)  // 
		var code = 0;               // Integer that will be decoded into a character
		var str = "";               // String of all chars that are retrieved
		
		while (data != "00")
		{
			code = parseInt(data, 16);
			str += String.fromCharCode(code);
			data = getData(++adress);
		}
		_StdIn.putText(str);
		_ConsoleTextHistory.push(str);
		_StdIn.advanceLine();
		_OsShell.putPrompt();
	}
	_CPU.PC++;
}