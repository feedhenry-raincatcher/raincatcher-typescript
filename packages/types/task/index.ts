import { EventEmitter } from 'eventemitter3';
import Step from '../step';
import Workflow from '../workflow';

interface TaskStepEventData<T extends Task>  {
  task: T;
  step: Step;
}

interface TaskEventData<T extends Task> {
  task: T;
}

// Task is a class I don't see much need for custom implementations
class TaskImpl extends EventEmitter implements Task {
  public id: string;
  public assigneeId: string;
  public watcherIds: string[];
  public workflowId: string;
  public currentStep: Step;
  public steps: Step[];
}


interface Task extends EventEmitter {
  id: string;
  assigneeId: string;
  // multiple Users might want to watch a Task's progression
  watcherIds: string[];

  // If we take a snapshot of the Workflow's Steps we might not need a reference to it
  // maybe just for keeping a historical/UI link
  // workflowId: string;

  steps: Step[];
  currentStep: Step;

  on(event: 'step:change', handler: (e: TaskStepEventData<this>) => any): this;
  on(event: 'task:done', handler: (e: TaskEventData<this>) => any): this;
}
export default Task;
