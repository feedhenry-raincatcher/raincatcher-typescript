/// <reference types="mocha" />
import * as assert from 'assert';
import * as Promise from 'bluebird';
import { Seedable, Store } from '../src';

import StoreImpl from '../src';
interface MockUser {
  id: string;
  name: string;
  address: string;
}

interface StoreTests {
  store: Store<MockUser>;
  getStore(): Store<MockUser>;
  [suites: string]: any;
}

const tests: StoreTests = {
  store: null,
  getStore() {
    return new StoreImpl<MockUser>([{
      address: 'somewhere',
      id: 'susy',
      name: 'susy'
    }]);
  },
  beforeEach(this: StoreTests) {
    this.store = this.getStore();
    return this.store.reset();
  },
  '#list returns all items via an Array'(this: StoreTests) {
    return this.store.list().then(l =>
      assert.equal(l.length, 1));
  },
  '#add returns the added user'(this: StoreTests) {
    return this.store.add({
      address: 'Somewhere only we know',
      id: 'trever',
      name: 'trever'
    }).then(u => assert.equal(u.name, 'trever'));
  },
  '#reset resets data to the seed data'(this: StoreTests) {
    return this.store.reset().then(l =>
      assert.equal(l.length, 1));
  }
};

exports = tests;
