import RaincatcherStore, { HasId } from '@raincatcher/store';
import * as Promise from 'bluebird';
const sayHello = ((from: string) => console.log(`Hello from extending store's ${from}!`));

class StoreImpl<T extends HasId> extends RaincatcherStore<T> {
  constructor(seedData?: T[]) {
    super(seedData);
    sayHello('constructor');
  }

  list() {
    sayHello('list');
    return super.list() as Promise<T[]>;
  }

  listWithCondition(condition: Object, limit: number) {
    sayHello('listWithCondition');
    return super.list() as Promise<T[]>;
  }

  add(user: T) {
    sayHello('add');
    return super.add(user) as Promise<T>;
  }

  reset() {
    super.reset;
    return super.reset() as Promise<T[]>;
  }
}

export default StoreImpl;
