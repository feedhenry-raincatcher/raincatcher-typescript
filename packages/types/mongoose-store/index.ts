import * as mongoose from 'mongoose';

export default class MongooseStore<T>{
  // TODO
}

type ID = string | number;

export interface Store<T> {
  query(): ChainQuery<T>;
  find(query: QueryParams<T>);
  create(data: T): Promise<T>;
  update(id: ID, data: T): Promise<T>;
  delete(id: ID): Promise<T>;
}

interface Predicate<T> {
  eq?: { [K in keyof T]?: T[K] };
  ne?: { [K in keyof T]?: T[K] };
  gt?: { [K in keyof T]?: T[K] };
  gte?: { [K in keyof T]?: T[K] };
  lt?: { [K in keyof T]?: T[K] };
  lte?: { [K in keyof T]?: T[K] };
}

interface QueryParams<T> {
  where: Predicate<T> | { or: Array<Predicate<T>> };
  limit?: number;
  skip?: number;
  sort?: { [K in keyof T]?: 'asc' | 'desc' | ((value: T[K]) => number) };
}

export interface ChainQuery<T> {
  where<K extends keyof T>(key: K, value: T[K]): this;
  gt<K extends keyof T>(key: K, value: T[K]): this;
  gte<K extends keyof T>(key: K, value: T[K]): this;
  lt<K extends keyof T>(key: K, value: T[K]): this;
  lte<K extends keyof T>(key: K, value: T[K]): this;
  ne<K extends keyof T>(key: K, value: T[K]): this;
  or(other: ChainQuery<T>);

  limit(max: number): this;
  skip(amount: number): this;

  sort<K extends keyof T>(key: K, value: 'asc' | 'desc'): this;
  sortBy<K extends keyof T>(key: K, by: (value: T[K]) => number);
  get(): Promise<T[]>;
  getSingle(): Promise<T>;
}
