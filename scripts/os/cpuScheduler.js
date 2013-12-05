/*
	cpuScheduler.js 
	CPU Scheduler
*/

function CpuScheduler()
{
	this.cycle = 1;  // Current cycle of process
	this.currentProcess = null; // Current Running Process
	
	// Function that handles context switching
	this.contextSwitch = function()
	{
		// If the current process isn't finished, add it to the end of the ready queue
		if (this.currentProcess.state != _TERMINATED)
		{
			this.currentProcess.update(_WAITING, _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
			_ReadyQueue.enqueue(this.currentProcess);
		}
		this.currentProcess = this.prioritize();
		_CPU.update(this.currentProcess.pc, 
		            this.currentProcess.acc,
		            this.currentProcess.x,
		            this.currentProcess.y,
		            this.currentProcess.z);
		this.currentProcess.state = _RUNNING;
		this.cycle = 1;
		updateReadyQueueDisplay();
	}
	
	// Determine the next process in terms of priority
	this.prioritize = function()
	{
		// Next process will be the one with the highest priority (lowest number)
		if (_SchedulingAlgorithm === _PRIORITY)
		{
			var nextProcess = _ReadyQueue.dequeue();
			for (var i = 0; i < _ReadyQueue.getSize(); i++)
			{
				var candidate = _ReadyQueue.dequeue();
				if (nextProcess.priority > candidate.priority)
				{
					_ReadyQueue.enqueue(nextProcess);
					nextProcess = candidate;
				}
				else
				{
					_ReadyQueue.enqueue(candidate);
				}
			}
			return nextProcess;
		}
		else // Next process will just be the next in the queue
		{
			return _ReadyQueue.dequeue();
		}
	}
}