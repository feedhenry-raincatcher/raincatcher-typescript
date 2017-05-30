import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;
import config from '../config';
import SchemaBuilder from './SchemaBuilder';
var labels = config.modelLabels;
var dataset = config.datasetIDs;

var stepSchema = new Schema({
  code: {
    type: String
  },
  name: {
    type: String
  },
  templates: {
    form: {
      type: String
    },
    view: {
      type: String
    }
  }
}, {
  _id: false,
  timestamps: true
});

mongoose.model('Step', stepSchema);

var workflowSchema = new Schema({
  id: {
    type: String
  },
  title: {
    type: String
  },
  steps: {
    type: [stepSchema]
  }
}, { timestamps: true, strict: false, versionKey: false });



const create: SchemaBuilder = function (db: mongoose.Connection) {
  var model = db.model(labels.WORKFLOW, workflowSchema, dataset.WORKFLOW);
  return model;
};
export default create;