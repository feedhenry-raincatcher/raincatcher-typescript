import BaseStep from './BaseStep';
import Step from './index';
/** Represents a set of `Step`s that can be executed in parallel */
class ParallelStep extends BaseStep implements Step {
  public status;
  constructor(public steps: Step[]) {
    super();
  }
  public run() {
    this.steps.forEach(s => this.setupListening(s));
  }

  protected setupListening(step: Step) {
    step.on()
  }
}

export default ParallelStep;
