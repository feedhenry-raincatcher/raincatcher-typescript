import Step from '../step';
import Task from '../task';
import Workflow from './index';
describe('Workflow', function() {
  const workflow = new Workflow('Example Workflow');
  it('should allow for defining a set of Steps', function() {
    workflow.steps = [
      new Step(),
      new Step(),
      new Step(),
      new Step()
    ];
  });

  it('should be able to instantiate a Task', function() {
    const task: Task = workflow.buildTask();
  });
});
