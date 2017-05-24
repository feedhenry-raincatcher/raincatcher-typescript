import Step from './index';
/** Represents a set of `Step`s that can be executed in parallel */
class ParallelStep {
  public status;
  constructor(public steps: Step[]) {
    super();
  }
}

export default ParallelStep;
