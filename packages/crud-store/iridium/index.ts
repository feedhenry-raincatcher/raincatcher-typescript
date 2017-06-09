import * as Promise from 'bluebird';
import {Core, Instance, Model} from 'iridium';
import { CrudStore } from '../';

export default class IridiumStore<T> implements CrudStore<T> {
  constructor(protected model: Model<any, T>) {
  }
  public create(data: T) {
    return this.model.create(data);
  }
  public get(id: string) {
    return this.model.get(id);
  }
  public find() {
    return this.model.find().toArray();
  }
  public update(id: string, data: T) {
    return this.model.update({ _id: id }, data)
      .then(() => this.get(id));
  }
  public delete(id: string) {
    // get the current data before deleting it so it can be returned
    return this.get(id)
      .tap(() => this.model.remove({ _id: id }));
  }
}
