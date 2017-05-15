'use strict';

import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';

export interface ErrorWithId extends Error {
  id?: any;
}

/**
 *
 * Converting the mongoose document to a JSON object.
 *
 * @param mongooseDocument
 * @returns {JSON}
 */
function convertToJSON(document: mongoose.Document) {
  return document ? document.toJSON() : undefined;
}

/**
 *
 * Creating an error describing a document that hasn't been found.
 *
 * @param id - The ID of the document that wasn't found
 */
function createNoDocumentError(id?: string) {
  const error: ErrorWithId = new Error('No document with id ' + id  + ' found');
  error.id = id;
  return error;
}

/**
 *
 * A single mongoose store for a single data set (e.g. workorders etc)
 *
 * @param {string} _datasetId - The ID of the data set for this store
 * @param {Model} _model - The mongoose model associated with this data set.
 * @constructor
 */
class Store {
  public isPersistent = true;
  constructor(protected _datasetId: string, protected model: mongoose.Model<mongoose.Document>) {
  }

  public init = function(this: Store, data: object[]) {
    const self = this;
    if (!_.isArray(data)) {
      // tslint:disable-next-line:no-console
      console.log('Initialization data is not array.');
      return Promise.resolve();
    }

    return Promise.map(data, function(entry) {
      const record = new self.model(entry);
      return record.save().catch(function(err) {
        return self.handleError(undefined, err);
      });
    });
  };

  /**
   *
   * Handling an error response that includes an ID.
   *
   * If it's a mongoose Validation Error, it should include the mongoose validation error message.
   *
   * @param {string} id - An ID to pass include with the error
   * @param {Promise} error - The error to handle
   */
  public handleError = function handleError(id: string | undefined, error: ErrorWithId | any) {
    if (error.name === 'ValidationError') {
      error = new Error(error.toString());
    }

    if (!(error instanceof Error)) {
      error = new Error(error);
    }

    error.message += ' (' + this.datasetId + ')';

    error.id = id;

    return Promise.reject<ErrorWithId>(error);
  };

  public create = function(this: Store, object: object) {
    const self = this;
    const record = new this.model(object);
    return record.save().catch(function(err) {
      return self.handleError(undefined, err);
    });
  };
  public findById = function(this: Store, id: any) {
    const self = this;
    return this.model.findOne({id}, {_id: 0}).exec().then(convertToJSON).catch(function(err) {
      return self.handleError(id, err);
    });
  };
  public read = function(this: Store, id: any) {
    const self = this;
    return this.model.findOne({id}, {_id: 0}).exec().then(function(foundDocument) {

      if (!foundDocument) {
        return createNoDocumentError(id);
      }

      return foundDocument;
    }).then(convertToJSON).catch(function(err) {
      return self.handleError(id, err);
    });
  };
  public update = function(this: Store, object: { _localuid?: string, id?: string }) {
    const self = this;
    let query;

    if (!_.isObject(object)) {
      return self.handleError(undefined, new Error('Expected an object to update'));
    }

    const uid = object._localuid || object.id;

    if (object.id) {
      query = {id: object.id};
    } else if (object._localuid) {
      query = {_localuid: object._localuid};
    } else {
      return self.handleError(undefined, new Error('Expected the object to have either an id or _localuid field'));
    }

    return this.model
      .findOne(query)
      .exec()
      .then(function(foundDocument) {
      if (!foundDocument) {
        throw createNoDocumentError(uid);
      } else {
        _.extend(foundDocument, object);
        return foundDocument.save();
      }
    }).then(convertToJSON).catch(function(err: Error) {
      return self.handleError(uid, err);
    });
  };
  public remove = function(object: { id?: string | number}) {
    const self = this;

    const id = object instanceof Object ? object.id : object;
    return this.model.findOneAndRemove({id}).then(convertToJSON).catch(function(err: Error) {
      return self.handleError(id, err);
    });
  };

  /**
   *
   * Lists documents for a model.
   *
   * @param filter - Optional filter to pass when listing documents for a model.
   * @see {@link https://docs.mongodb.com/manual/tutorial/query-documents/}
   */
  public list = function(this: Store, filter?: any) {
    const self = this;
    filter = filter || {};
    const mongooseQuery = this.model.find(filter, {_id: 0});

    if (filter.sort && typeof filter.sort === 'object') {
      mongooseQuery.sort(filter.sort);
    }

    return mongooseQuery.exec().then(function(arrayOfDocuments) {
      return _.map(arrayOfDocuments || [], convertToJSON);
    }).catch(function(err) {
      return self.handleError(undefined, err);
    });
  };
}
export default Store;
