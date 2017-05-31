/// <reference types="bluebird" />
import { Store, HasId } from '@raincatcher/store';
import * as Promise from 'bluebird';
/**
 * WebApi Service interface that can be used to define custom data handlers
 */
export interface ApiService<T extends HasId> extends Store<T> {
}
export declare class StoreApiService<T extends HasId> implements ApiService<T> {
    store: Store<T>;
    constructor(store?: Store<T>);
    list(): Promise<T[]>;
    listWithCondition(condition: Object, limit: number): Promise<T[]>;
    add(user: T): Promise<T>;
    reset(): Promise<T[]>;
}
