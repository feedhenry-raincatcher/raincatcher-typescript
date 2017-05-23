import {EventEmitter} from 'events';
type StepEventHandler<T extends Step> = (e: StepEventData<T>) => any;
type StepStatus = 'pending' | 'in progress' | 'done '; // can have more here
export interface StepEventData<T extends Step> {
  step: T;
  date: Date;
}
interface Step extends EventEmitter {
  status: StepStatus;
  on(event: StepStatus, handler: StepEventHandler<this>): this;
  // Step implementations would carry extra metadata needed for execution and UI
}

/** Represents a set of `Step`s that can be executed in parallel inside a workflow */
class ParallelStep extends EventEmitter implements Step {
  public steps: Step[];
}

/**
 * Simple step example that hits a remote http endpoint
 */
// class HttpRequestStep extends EventEmitter implements Step {
//   constructor(protected Uri: string) {
//     super(); // EventEmitter's constructor
//   }
// }

export default Step;
