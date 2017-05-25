import * as Promise from 'bluebird';
import * as mongoose from 'mongoose';

export default class MongooseStore<T>{
  constructor(protected conn: mongoose.Connection) {

  }
}

type ID = string | number;

export interface Store<T> {
  query(): ExecutableChainQuery<T>;
  or(): ChainQuery<T>;
  find(query: QueryParams<T>): Promise<T[]>;
  create(data: T): Promise<T>;
  update(id: ID, data: T): Promise<T>;
  delete(id: ID): Promise<T>;
}

interface Predicate<T> {
  // An object with the same keys as T,
  // with the same types as the corresponding property of T
  eq?: { [K in keyof T]?: T[K] };
  ne?: { [K in keyof T]?: T[K] };
  gt?: { [K in keyof T]?: T[K] };
  gte?: { [K in keyof T]?: T[K] };
  lt?: { [K in keyof T]?: T[K] };
  lte?: { [K in keyof T]?: T[K] };
  matches?: { [K in keyof T]?: RegExp };

  or?: Predicate<T>;
}

interface QueryParams<T> {
  where: Predicate<T>;
  limit?: number;
  skip?: number;
  sort?: { [K in keyof T]?: 'asc' | 'desc' | ((value: T[K]) => number) };
}

interface ChainQuery<T> {
  // For any supplied key of T,
  // take a value with the same type as the corresponding property of T
  where<K extends keyof T>(key: K, value: T[K]): this;
  gt<K extends keyof T>(key: K, value: T[K]): this;
  gte<K extends keyof T>(key: K, value: T[K]): this;
  lt<K extends keyof T>(key: K, value: T[K]): this;
  lte<K extends keyof T>(key: K, value: T[K]): this;
  ne<K extends keyof T>(key: K, value: T[K]): this;
  matches<K extends keyof T>(key: K, value: RegExp): this;
  or(other: ChainQuery<T>): this;

  limit(max: number): this;
  skip(amount: number): this;

  sort<K extends keyof T>(key: K, value: 'asc' | 'desc'): this;
  sortBy<K extends keyof T>(key: K, by: (value: T[K]) => number): this;
}

interface ExecutableChainQuery<T> extends ChainQuery<T> {
  get(): Promise<T[]>;
  getSingle(): Promise<T>;
}
