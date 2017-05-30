import { EventEmitter } from 'eventemitter3';
import Step, { StepEventData, StepStatus } from './index';

abstract class BaseStep extends EventEmitter implements Step {
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

  // typescript has abstract classes+methods, not sure if we should use them
  public abstract run(): void;

  public getOptions = () => ({});
  public setOptions(options: object) {
    // TODO: JsonSchema validation with http://epoberezkin.github.io/ajv/
    this.options = options;
  }

  public getStatus() {
    const roundedDownStatus = this.status % 100;
    return roundedDownStatus || StepStatus.pending;
  }
}

export default BaseStep;
