# RainCatcher Store Spike

The store module for RainCatcher has the primary goal of providing users with a way to supply the data-accessing features required by other modules in whatever data storage engine they prefer.

Since RainCatcher modules are expected to work with any supplied storage engine, they are forced to use a generic baseline API, and not leverage advanced features from a given database engine.

Users, on the other hand, are not required to use it in their custom application code and can directly use their chosen data library and db engine features.

We have the following options for a store module in WFM 1.0:

## Per-module Repository pattern with slim CRUD Store

In this alternative each of our modules would expose a Repository interface that would be part of their constructor-injected dependencies and have all the required data access functions.

The query definitions for a given database would reside on the Repository implementation, which can be in the cloud app in most scenarios. This means that the app just utilizes the chosen database library normally.

We can include our own mongo-based implementation in the module itself so it falls under supported code.

Assuming the querying capabilities in RainCatcher tech preview, this solution could prove quite sufficient.

We can have a very simple CRUD store module as a way to DRY out the simpler methods.

Example:

```typescript
/** The exported repository interface, contains extra methods specific to the module's needs */
export interface TaskRepository {
  /** Each function's intent should be well documented */
  findByUser(userId: string): Promise<Task>;
  findActive(): Promise<Task[]>;
  getSteps(taskId: string): Promise<Step[]>;
}

/**
 * Module can have our own mongo-based supported implementation
 */
export class MongoTaskRepository implements TaskRepository {
  constructor(protected connection: mongo.Db) {
  }
}

export interface Step{};

// import CrudStore from '@raincatcher/data-store
export interface CrudStore<T> {
  create(data: T): Promise<T>;
  get(id: string): Promise<T>;
  find(): Promise<T[]>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<T>;
}

export default class Task {
  constructor(protected repository: TaskRepository, store: CrudStore<Task>) {
  }
  // ...
}
```

### Pros

- Application code uses database libraries as it normally would
- Easy mocking for unit tests
- Very low maintenance
- Queries become application code
- Repository methods might be one liners for most libraries

### Cons

- Might prove too inflexible as modules become complex
- Hard to add support for more advanced features (pagination, referential integrity, etc.)
- Prone to wrong interpretation by users
- Users would need to implement new repository methods as they update versions of the modules
- Modules would need more frequent larger semver bumps since the Repository would be a frequently changing point of their public API

## Use an existing OSS ORM with support for multiple databases

Instead of using the single-database solutions like mongoose/mongodb, sequelize, etc, we turn to ORMs that aim to support a larger number of databases:

- [Waterline](http://waterlinejs.org/)
- [ORM2](https://github.com/dresende/node-orm2)
- [FeathersJS' services](https://docs.feathersjs.com/api/databases/common.html)
- [TypeORM](https://github.com/typeorm/typeorm) (written in TS, but relational databases only)

### Pros

- Zero initial implementation cost, 1.0 comes out a bit earlier
- Zero maintenance cost, team can focus on business features
- Existing mature ecossystem that our own implementations can't initially match
- Documentation around building new adapters if needed

### Cons

- No support from us?
- Variable TypeScript support quality
- Locked in with the ORM's way of working

## Full generic ORM wrapper

Consists of having a full-fledged ORM-style wrapper around a given database library in nodejs, optionally with a reusable data validation layer.

Our implementation would use ajv along with the mongodb driver, implementing a custom query interface.
In order to support a different DB driver the query building methods would need to be reimplemented fully.

Our other modules would have access to the entire querying interface, and the query definitions that they require to work would be inside them (contrast with the other approach), hence the need for a custom database-agnostic query interface.

This is the approach partially spiked in [types/mongoose-store](types/mongoose-store).

### Pros

- Flexible internal usage by our modules
- Can be extended over time to have lots of features (projection, joins, referential integrity, pagination, etc.)
- Might become attractive as a standalone OSS project since the TypeScript NoSQL ORM niche isn't filled
- Implementations for other databases can be contributed by the community

### Cons

- Expensive maintenance
- Customer implementations would be big/harder
- Customer implementations would need to 'play catch-up' with new features
- Overkill for our current demands?
- Customers might prefer just using the underlying library.
