/*
	processControl.js
	Contains Process Control Block.
	Contains functions for loading and running programs.
*/

function ProcessControlBlock()
{
	this.pid = _PID;
	// Sets the Base and Limit based on the current PID which takes up one partition each
	if (this.pid === 0)
	{
	   this.base = 0;
	   this.limit = _PartitionSize;
	}
	else if (this.pid === 1)
	{
	   this.base = _PartitionSize + 1;
	   this.limit = _PartitionSize * 2 + 1;
	}
	else if (this.pid === 2)
	{
	   this.base = _PartitionSize * 2 + 2;
	   this.limit = _MemorySize - 1;
	}
	this.state = _NEW;
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
	var count = 0;
	for (var i = pcb.base; i < pcb.limit; i++)
	{
		if (count < opCodes.length)
		{
		   setLocation(i, opCodes[count]); // memoryManager.js
		}
		count++;
	}
	pcb.state = _READY;
	// Update the list of loaded programs and the memory display
	_ProgramList[pcb.pid] = opCodes;
	_ReadyQueue[pcb.pid] = pcb;
	updateMemoryDisplay();
	updateReadyQueueDisplay(pcb.pid);
}
