/* 
	Memory.js
	Core Memory Prototype
	For now it initializes the memory with 
*/

function Memory()
{
	// Initialize memory array
	this.coreMemory = new Array();
	// Memory size is 256
	for (var i = 0; i < _MemorySize; i++)
	{
		this.coreMemory[i] = "00";
	}
};
		