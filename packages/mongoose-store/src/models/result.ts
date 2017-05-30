import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;
import SchemaBuilder from './SchemaBuilder';
import config from '../config';
var labels = config.modelLabels;
var dataset = config.datasetIDs;

var resultSchema = new Schema({
  status: {
    type: String
  },
  workorderId: {
    type: String
  },
  _localuid: {
    type: String
  },
  id: {
    type: String
  },
  nextStepIndex: {
    type: String
  },
  stepResults: Schema.Types.Mixed
}, {timestamps: true});

const create: SchemaBuilder = function (db: mongoose.Connection) {
  var model = db.model(labels.RESULT, resultSchema, dataset.RESULT);
  return model;
};
export default create;