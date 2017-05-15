// TODO move to the modules

// We need to import mongoose here to be able to reexport its types
import * as mongoose from 'mongoose';

import result from './result';
import workflows from './workflows';
import workorders from './workorders';

export interface SchemaMap { [index: string]: SchemaBuilder; }
const models: SchemaMap = {
  result,
  workflows,
  workorders
};

export default models;

import SchemaBuilder from './SchemaBuilder';
export { SchemaBuilder };
