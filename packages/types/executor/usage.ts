import * as assert from 'assert';
import BaseStep, { StepStatus } from '../step';
import { Task } from '../task';
import Workflow from '../workflow';
import ExecutorImpl, { Executor, TaskRepository } from './index';

describe('Executor', function() {
  class SingleRepository implements TaskRepository {
    public savedTask: Task;
    public save(task: Task) {
      this.savedTask = task;
      return Promise.resolve(task);
    }
  }
  class NullStep extends BaseStep {
    public run() {
      // advance to next status
      this.status += 100;
    }
  }

  const repository = new SingleRepository();
  const workflow = new Workflow('sample');
  workflow.steps = [
    new NullStep(),
    new NullStep(),
    new NullStep()
  ];
  let executor: Executor;

  it('wraps the creation of a Task', function() {
    executor = new ExecutorImpl(workflow, repository);
    return Promise.resolve(executor);
  });
  it('Can start the execution of the Task and its Steps', function(done) {
    executor.task.on('task:done', function(e) {
      assert(e.task.currentStep.getStatus() === StepStatus.done);
    });
    executor.start();
  });
});
