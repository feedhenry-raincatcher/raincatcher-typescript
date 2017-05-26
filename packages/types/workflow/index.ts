import * as _ from 'lodash';
import {Step} from '../step';
import TaskImpl, {Task} from '../task';
/**
 * Workflow is the definition holder for a set of Steps that can become a Task
 */
export interface Workflow {
  id: string;
  /** Description for UI */
  displayName: string;
  steps: Step[];

  buildTask(): Task;
}

export default class WorkflowImpl implements Workflow {
  public steps: Step[];
  public id: string;
  constructor(public displayName) {
  }

  public buildTask() {
    const task = new TaskImpl(this.steps);
    return task;
  }
}
