import * as mongoose from 'mongoose';

import MongooseStore, { Store } from './index';

interface User {
  id: string;
  name: string;
  age: number;
  getFullName: () => string;
}

const store: Store<User> = null; // = new MongooseStore<User>(mongoose.createConnection('localhost'));

// Fluent interface example
store.query()
  .where('name', 'john')
  .gt('age', 18)
  .getSingle().then((u) => console.log(u.age));

// Mongoose-style large query object example
store.find({
  where: {
    eq: { name: 'john' },
    gt: { age: 18 }
  }
});
