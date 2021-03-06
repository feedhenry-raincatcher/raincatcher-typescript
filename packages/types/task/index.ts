import { EventEmitter } from 'eventemitter3';
import * as _ from 'lodash';
import {Step} from '../step';
import Workflow from '../workflow';

export interface TaskStepEventData<T extends Task>  {
  task: T;
  step: Step;
}

export interface TaskEventData<T extends Task> {
  task: T;
}

export interface Task extends EventEmitter {
  assigneeId: string;
  // multiple Users might want to watch a Task's progression
  watcherIds: string[];

  // If we take a snapshot of the Workflow's Steps we might not need a reference to it
  // maybe just for keeping a historical/UI link
  // workflowId: string;

  steps: Step[];
  currentStep: Step;
  // Optionally async
  next(): Step | Promise<Step>;

  getId(): string;

  on(event: 'step:change', handler: (e: TaskStepEventData<this>) => any): this;
  on(event: 'task:done', handler: (e: TaskEventData<this>) => any): this;
}

// Task is a class I don't see much need for custom implementations
class TaskImpl extends EventEmitter implements Task {
  public id: string;
  public assigneeId: string;
  public watcherIds: string[];
  public workflowId: string;
  public currentStep: Step;
  public steps: Step[];

  protected currentStepIdx: number;

  constructor(initialSteps: Step[]) {
    super();
    this.steps = _.cloneDeep(initialSteps);
    this.currentStep = this.steps[0];
    this.currentStepIdx = 0;
  }

  public getId() {
    return this.id;
  }

  public next() {
    this.currentStep = this.steps[++this.currentStepIdx];
    const e: TaskStepEventData<this> = {
      task: this,
      step: this.currentStep
    };
    this.emit('step:change', e);
    return this.currentStep;
  }
}

export default TaskImpl;
