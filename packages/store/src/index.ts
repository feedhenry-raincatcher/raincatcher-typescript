import * as Promise from 'bluebird';
import * as _ from 'lodash';

/**
 * Extra optional interface to enforce constructor signature
 */
export interface Seedable<T extends HasId> {
  new(seedData: T[]): Store<T>;
}

export interface HasId {
  id: string;
}

export interface Store<T extends HasId> {
  /**
   * Returns a list of all members of the store's data
   */
  list(): Promise<T[]>;

  /**
   * Returns a list of  members of the store's data filtered by condition
   *
   * @param condition - condition used to filter things
   * @param limit - max number of entries to return
   * NOTE Intentionally not breaking interface but providing new modified method.
   */
  listWithCondition(condition: Object,  limit: number): Promise<T[]>;

  /**
   * Adds a new user to the store's data
   * @param user User to add
   */
  add(user: T): Promise<T>;
  /**
   * Reset's the store's data
   */
  reset(): Promise<T[]>;
}

class StoreImpl<T extends HasId> implements Store<T> {
  protected data: T[];

  constructor(protected readonly seedData?: T[]) {
    if (seedData) {
      this.reset();
    } else {
      this.data = [];
    }
  }

  list() {
    return Promise.resolve(this.data);
  }

  listWithCondition(condition: Object,  limit: number) {
    const conditionsKeys = _.keys(condition);
    const tmpData: T[] = _.filter(this.data, (element) => {
      return _.isMatch(element, condition);
    });
    return Promise.resolve(_.take(tmpData, limit));
  }

  add(user: T) {
    this.data.push(user);
    return Promise.resolve(user);
  }

  reset() {
    if (this.seedData) {
      this.data = _.cloneDeep(this.seedData);
    } else {
      this.data = [];
    }
    return this.list();
  }
}

export default StoreImpl;
