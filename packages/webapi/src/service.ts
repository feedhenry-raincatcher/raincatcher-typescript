import RaincatcherStore, { HasId, Store } from '@raincatcher/store';
import * as Promise from 'bluebird';
import * as Logger from 'bunyan';

const log = Logger.createLogger({ name: __filename, level: 'debug' });

/**
 * WebApi Service interface that can be used to define custom data handlers
 */
export interface ApiService<T extends HasId> extends Store<T> {
}

export class StoreApiService<T extends HasId> implements ApiService<T> {
  protected store: Store<T>;

  constructor(store: Store<T>) {
    this.store = store;
  }

  public list() {
    log.info('Service list called');
    return this.store.list() as Promise<T[]>;
  }

  public listWithCondition(condition: Object, limit: number) {
    log.info('Service list called', condition);
    return this.store.list() as Promise<T[]>;
  }

  public add(object: T) {
    log.info('Service create called', object);
    return this.store.add(object) as Promise<T>;
  }

  public reset() {
    return this.store.reset() as Promise<T[]>;
  }
}
