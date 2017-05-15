import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import DB from './DB';
import modelSchemas, { SchemaBuilder, SchemaMap } from './models';

interface MongooseBackedStore {
  /**
   *
   * Function to connect to mongoose and set up models based on schemas.
   *
   * Users have the option to set their own custom schemas if required.
   *
   * @param mongoUrl - A valid mongodb connection URL
   * @param options - Any custom connection parameters for the mongoose connection
   * @param customSchemas - Optional Custom schemas passed by the application.
   */
  connect(mongoUrl: string, options: mongoose.ConnectionOptions, customSchemas: SchemaMap): Promise<boolean>;
  /** Disconnects the underlying client from the database */
  disconnect(): void;
  /** Obtain one of the stores for the added schemas */
  getDAL(dataset: string): Promise<Store>;
}

// replace mongoose's promise implementation with Bluebird
import * as Bluebird from 'bluebird';
// tslint:disable-next-line:no-var-requires
require('mongoose').Promise = Bluebird;
declare module 'mongoose' {
  type Promise<T> = Bluebird<T>;
}

import config from './config';
import Store from './mongoose-store';
const label = config.module;

interface MongooseModelMap {
  [index: string]: mongoose.Model<mongoose.Document>;
};

let MODELS: MongooseModelMap = {};

const connector = new DB();

function addCollection(name: string, schema: SchemaBuilder, db: mongoose.Connection) {
  MODELS[name] = schema(db);
}

const api: MongooseBackedStore = {
  connect: function connect(mongoUrl: string, options: mongoose.ConnectionOptions, customSchemas: SchemaMap) {
    // The default dataset schemas to use will be the ones passed by the user
    const schemasToUse = _.defaults(customSchemas, modelSchemas);

    return connector.connectToMongo(mongoUrl, options)
    .then((db) => _.each(schemasToUse,
    (schema, key) => addCollection(key, schema, db)))
    .then(() => true);
  },
  disconnect: function disconnect() {
    return connector.closeConnection();
  },
  getDAL: function getDAL(dataset: string) {
    let model = MODELS[dataset];
    if (!model) {
      return Promise.reject<Store>(new Error('Invalid model for dataset ' + dataset));
    }
    let mongooseDal = new Store(dataset, model);
    return Promise.resolve(mongooseDal);
  }
};
