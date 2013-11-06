/*
	cpuScheduler.js 
	CPU Scheduler Using Round Robin Scheduling
*/

function CpuScheduler()
{
	this.cycle = 0;  // Current cycle of process
	this.currentProcess = null; // Current Running Process
	
	this.contextSwitch = function()
	{
		// If the current process isn't finished, add it to the end of the ready queue
		if (this.currentProcess.state != _TERMINATED)
		{
			this.currentProcess.update(_WAITING, _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
			_ReadyQueue.enqueue(this.currentProcess);
		}
		this.currentProcess = _ReadyQueue.dequeue();
		_CPU.update(this.currentProcess.pc, 
		            this.currentProcess.acc,
		            this.currentProcess.x,
		            this.currentProcess.y,
		            this.currentProcess.z);
		this.cycle = 1;
	}
}