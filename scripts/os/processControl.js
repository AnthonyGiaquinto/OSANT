/*
	processControl.js
	Contains Process Control Block.
	Contains functions for loading and running programs.
*/

function ProcessControlBlock()
{
	this.pid = _PID;
	this.base = 0;
	this.limit = 255;
	
	this.pc = 0;
	this.acc = 0;
	this.x = 0;
	this.y = 0;
	this.z = 0;
}


function loadProgram(program)
{
	// Creates a new PCB and stores the program contents into the array of loaded programs
	var pcb = new ProcessControlBlock();	
	
	var opCodes = program.split(" ");
	for (var i = pcb.base; i < opCodes.length; i++)
	{
		setLocation(i, opCodes[i]); // memoryManager.js
	}
	// Update the list of loaded programs and the memory display
	_ProgramList[_PID] = opCodes;
	updateMemoryDisplay();
}
