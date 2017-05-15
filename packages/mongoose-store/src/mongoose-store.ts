'use strict';

import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import buildQuery from './query-builder';

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
  let error: ErrorWithId = new Error('No document with id ' + id  + ' found');
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
  constructor (protected _datasetId: string, protected model: mongoose.Model<mongoose.Document>) {
  }

  init = function(this: Store, data: Object[]) {
    let self = this;
    if (!_.isArray(data)) {
      console.log('Initialization data is not array.');
      return Promise.resolve();
    }

    return Promise.map(data, function(entry) {
      let record = new self.model(entry);
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
  handleError = function handleError(id: string | undefined, error: ErrorWithId | any) {
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

  create = function(this: Store, object: Object) {
    let self = this;
    let record = new this.model(object);
    return record.save().catch(function(err) {
      return self.handleError(undefined, err);
    });
  };
  findById = function(this: Store, id: any) {
    let self = this;
    return this.model.findOne({id: id}, {_id: 0}).exec().then(convertToJSON).catch(function(err) {
      return self.handleError(id, err);
    });
  };
  read = function(this: Store, id: any) {
    let self = this;
    return this.model.findOne({id: id}, {_id: 0}).exec().then(function(foundDocument) {

      if (!foundDocument) {
        return createNoDocumentError(id);
      }

      return foundDocument;
    }).then(convertToJSON).catch(function(err) {
      return self.handleError(id, err);
    });
  };
  update = function(this: Store, object: { _localuid?: string, id?: string }) {
    const self = this;
    let query;

    if (!_.isObject(object)) {
      return self.handleError(undefined, new Error('Expected an object to update'));
    }

    let uid = object._localuid || object.id;

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
  remove = function(object: { id?: string | number}) {
    let self = this;

    let id = object instanceof Object ? object.id : object;
    return this.model.findOneAndRemove({id: id}).then(convertToJSON).catch(function(err: Error) {
      return self.handleError(id, err);
    });
  };

  /**
   *
   * Lists documents for a model.
   *
   * @param {object} filter - Optional filter to pass when listing documents for a model. (See https://docs.mongodb.com/manual/tutorial/query-documents/)
   */
  list = function(this: Store, filter: any) {
    let self = this;
    filter = filter || {};

    let query = buildQuery(filter);

    let mongooseQuery = this.model.find(query, {_id: 0});

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
