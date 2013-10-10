/*
	memoryManager.js 
*/

// Sets the given value to given memory location
function setLocation(index, value)
{
	// If only one digit was passed, put a zero in front of it
	if (value.length === 1)
	{
		value = "0" + value;
		_Memory.coreMemory[index] = value;
	}
	else
	{
		_Memory.coreMemory[index] = value;
	}
}

// Retrieves the value of the given memory location
function getData(index)
{
	return _Memory.coreMemory[index];
}