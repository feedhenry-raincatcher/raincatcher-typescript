import { Step } from '../step';
import { Task, TaskStepEventData } from '../task';
import { Workflow } from '../workflow';

interface Executor {
  workflow: Workflow;
}

export interface TaskRepository {
  save(task: Task): Promise<Task>;
}

class ExecutorImpl implements Executor {
  public task: Task;
  constructor(public workflow: Workflow, public taskRepository: TaskRepository) {
  }
  public start() {
    this.task = this.workflow.buildTask();
    this.task.currentStep = this.task.steps[0];
    this.task.currentStep.run();
    this.task.on('step:change', this.stepChanged);
  }
  public stepChanged(e: TaskStepEventData<Task>) {
    Promise.resolve(this.task.next())
      .then(this.saveTask)
      .then(() => this.task.currentStep.run());
  }
  protected saveTask() {
    return this.taskRepository.save(this.task);
  }
}
