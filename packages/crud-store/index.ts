import * as Promise from 'bluebird';
import IridiumStore from './iridium';

export interface CrudStore<T> {
  create(data: T): Promise<T>;
  get(id: string): Promise<T>;
  find(): Promise<T[]>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<T>;
}

export default IridiumStore;
