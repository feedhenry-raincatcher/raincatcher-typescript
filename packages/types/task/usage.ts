import assert from 'assert';
import Step from '../step';
import TaskImpl, {Task} from './index';
describe('Task', function() {
  const task: Task = new TaskImpl([
    new Step(),
    new Step(),
    new Step()
  ]);
  it('should contain a set of Steps', function() {
    task.steps = [
      new Step(),
      new Step(),
      new Step()
    ];
  });

  it('should keep an assignment to a single User', function() {
    task.assigneeId = 'trever';
  });

  it('should fire events related to a change in the active Step', function(done) {
    task.on('step:change', function(e) {
      assert(e.task === task);
      done();
    });
    task.currentStep = task.steps[1];
  });

  it('should fire an event when all Steps are done');
});
