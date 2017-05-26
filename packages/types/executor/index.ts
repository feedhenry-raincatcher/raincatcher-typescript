import {Store} from '../mongoose-store';
import { Step } from '../step';
import { Task, TaskStepEventData } from '../task';
import { Workflow } from '../workflow';

interface Executor {
  workflow: Workflow;
}
class ExecutorImpl implements Executor {
  public task: Task;
  constructor(public workflow: Workflow, public store: Store<Task>) {
  }
  public start() {
    this.task = this.workflow.buildTask();
    this.task.currentStep = this.task.steps[0];
    this.task.currentStep.run();
    this.task.on('step:change', this.stepChanged);
  }
  public stepChanged(e: TaskStepEventData<Task>) {
    this.saveTask()
      .then(() => e.task.currentStep.run());
  }
  protected saveTask() {
    return this.store.update(this.task.id, this.task);
  }
}
