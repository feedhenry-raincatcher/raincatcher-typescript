import RaincatcherStore, { HasId, Store } from '@raincatcher/store';
import * as Promise from 'bluebird';
import * as Logger from 'bunyan';

const log = Logger.createLogger({ name: __filename, level: 'debug' });

/**
 * WebApi Service interface that can be used to define custom data handlers
 */
export interface ApiService<T extends HasId> extends Store<T> {
  //Extends store which already has list, listWithCondition, add and reset.

  /**
   * Update a user
   * @param userToUpdate User to be updated.
   */
  update(dataToUpdate: T): Promise<T>;

  /**
   * Remove a user
   * @param userToRemove User to be removed.
   */
  remove(dataToRemove: T): Promise<T>;

  /**
   * Read a user
   * @param userID a unique identifier for the user to be read.
   */
  read(dataID: string): Promise<T>;
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

  public listWithCondition(condition: object, limit: number) {
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

  public update(dataToUpdate: T) {
    log.info('Service update called', dataToUpdate);
    return Promise.resolve(dataToUpdate);
  }

  public remove(dataToRemove: T) {
    log.info('Service remove called', dataToRemove);
    return Promise.resolve(dataToRemove);
  }

  public read(dataID: string) {
    const sampleData = {
      id: "this_is_a_sample_data"
    };
    log.info('Service read called', dataID);
    return Promise.resolve(sampleData as T);
  }
}
