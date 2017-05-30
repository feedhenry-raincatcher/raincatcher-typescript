import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;
import config from '../config';
import SchemaBuilder from './SchemaBuilder';
var moment = require('moment');
var labels = config.modelLabels;
var dataset = config.datasetIDs;

function setTimestamp(time: any) {
  return new Date(time).getTime();
}

var workorderSchema = new Schema({
  id: {type: String , unique: true, required: true},
  workflowId: {type: String, required: false },
  assignee: {type: String, required: false  },
  type: {type: String, required: true  },
  title: {type: String, required: true },
  status: {type: String, required: true, default: "New" },
  startTimestamp: {type: Number, required: false, set: setTimestamp},
  finishTimestamp: {type: Number, required: false, set: setTimestamp },
  address: {type: String, required: true },
  location: [Number],
  summary: {type: String, required: true }
},{timestamps: true});

workorderSchema.pre('validate', function(next) {
  if (this.startTimestamp) {

    if (!moment(this.startTimestamp).isValid()) {
      return next(new Error("Invalid date value for startTimestamp"));
    }

    this.startTimestamp = new Date(this.startTimestamp).getTime();
  }

  if (this.finishTimestamp) {

    if (!moment(this.finishTimestamp).isValid()) {
      return next(new Error("Invalid date value for finishTimestamp"));
    }

    this.finishTimestamp = new Date(this.finishTimestamp).getTime();
  }

  next();
});

workorderSchema.index({
  id: 1
});

const create: SchemaBuilder = function (db: mongoose.Connection) {
  return db.model(labels.WORKORDERS, workorderSchema, dataset.WORKORDERS);
};
export default create;