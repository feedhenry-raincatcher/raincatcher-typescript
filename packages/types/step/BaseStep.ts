import { EventEmitter } from 'events';
import Step, { StepEventData, StepStatus } from './index';

class BaseStep extends EventEmitter implements Step {
  protected _status: StepStatus | number = StepStatus.pending;
  protected options: object;

  public set status(to: StepStatus | number) {
    const e: StepEventData<this> = {
      date: new Date(),
      previousStatus: this.status,
      step: this
    };
    this.status = to;
    this.emit('statusChange', e);
  }
  public get status() {
    return this._status;
  }

  public getOptions = () => ({});
  public setOptions(options: object) {
    // TODO: JsonSchema validation with http://epoberezkin.github.io/ajv/
    this.options = options;
  }
}

export default BaseStep;