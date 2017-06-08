import {Core, Model} from 'iridium';
import TaskInstance, {Task} from './models/task';

export default class Database extends Core {
  public Task = new Model<Task, TaskInstance>(this, TaskInstance);

  public seed() {
    this.Task.remove()
      .then(() => this.Task.create(TaskInstance.seedData));
  }
}
