import { HasId, Store } from '@raincatcher/store';
import * as Promise from 'bluebird';
import { cloneDeep } from 'lodash';
const sayHello = ((from: string) => console.log(`Hello from reimplementing store's ${from}!`));

class StoreImpl<T extends HasId> implements Store<T> {
  private data: T[];

  constructor(private readonly seedData?: T[]) {
    sayHello('constructor');
    if (seedData) {
      this.reset();
    } else {
      this.data = [];
    }
  }

  public list() {
    sayHello('list');
    return Promise.resolve(this.data);
  }

  public listWithCondition(condition: Object, limit: number) {
    sayHello('listWithCondition');
    return Promise.resolve(this.data);
  }

  public add(user: T) {
    sayHello('add');
    this.data.push(user);
    return Promise.resolve(user);
  }

  public reset() {
    sayHello('reset');
    if (this.seedData) {
      this.data = cloneDeep(this.seedData);
    } else {
      this.data = [];
    }
    return this.list();
  }
}

export default StoreImpl;
